

addEventListener('load', setUp);

var media = [];
var seen = [];

var nextAudio = 1;
var current = 0;
var last = 0;
var sound;
var audio_context;
var recorder;
var recording = false;

function setUp() {

  var nextImage = source('nextImage');
  var nextSong = source('nextSound');
  var record = source('record');
  var mute = source('mute');

  event(mute, 'click', muteSong);
  event(record, 'click', recordStart);
  event(nextImage, 'click', nextPic);
  event(nextSong, 'click', check);

  loadMedia();
  setUpAudio();

}


/*********************************************
**          SetUp and server info           **
*********************************************/


function loadMedia() {

  var owner = sessionStorage.getItem('id');
  var send = new XMLHttpRequest();

  send.onreadystatechange = updatePage;
  send.open("GET", "display?"+owner, true);
  send.send();

  function updatePage()  {
    if(this.readyState === 4 && this.status === 200) {
      handleLoadResponse(this.responseText)
    }
  }
}

function handleLoadResponse(response) {

  var seen = [];
  console.log(response);
  if(response === "fail" || response === "isNull" || 
    response === "alreadyExists"||response === "fail") {
    fail();
  } else {
    var results = response.split("?");
    var part;
    
    for (var i = 2; i < results.length; i += 2)  {
      part = results[i].split("\.")[2];
      if(isVisual(part)) {
        seen.push(results[i]);
      }
      if(!done(results[i], seen) && results[i] !== "null") {
        media.push(results[i]);
      }
    }
    display();
  } 
}


function fail() {
  
  var response = source('response');
  response.innerHTML = 
  "No story to load, click continue to add to story";

  var button = create('BUTTON', "none", "buttons");
  button.name = "continue";
  event(button, 'click', update);
  
  response.appendChild(button);

}

function update()  {

  window.location.href = "view.html";

}



/**********************************************
**                 Display Pics              **
**********************************************/
function display()  {

  var image = source('image');
  var w = window.innerWidth;
  var h = window.innerHeight;
  image.src = media[current];
  image.width = w-200;
  image.height = h;
  nextSong();

}

function nextPic() {

  current = getNext();
  nextAudio = 1;
  display();

}


function getNext() {

  var part;
  for( var i = current+1; i < media.length; i++) {
    part = media[i].split("\.")[2];
    if(isVisual(part)) {
    last = current;
    return i;
    }
  }
  return 0;

}

//checks whether images have already been seen so they are not displayed
function done(current, seen)  {

  var i;
  for(i = 0; i < seen.length-1; i++)  {
    if(seen[i] === current) return true;
  }
  return false;

}

/**********************************************
**                 Play Audio                **
**********************************************/
function check()  {

  nextSong();
  
}

function nextSong() {
  
  sound = source('sound');
  var song = getNextSong();
  
  var part = media[song].split("\.")[2];

  if(part === undefined || part === null) {
    sound.src = "";
  }

  if(isAudio(part)) {  
    sound.src = media[song];
    sound.play();
  }
  else  {
    sound.src = "";
  }

}

function getNextSong()  {

  var part;
  if(current+nextAudio > media.length-1) {
    nextAudio = 1;
    return current;
  }
  part = media[current+nextAudio].split("\.")[2];
  if(isAudio(part)) {
    nextAudio++;
    return current+nextAudio-1;
  } else {
    nextAudio = 1;
    return current+nextAudio;
  }
}

function muteSong() {

  if(!sound.paused){
    sound.pause();
  } else {
    sound.play();
  }

}


/*********************************************
**                 Audio upload             **
*********************************************/

//Ajax request to send blob file to server
function send(blob) {

  var formData = getForm(blob);
  var send = new XMLHttpRequest();
  send.onreadystatechange = updatePage0;

  send.open("POST", "addstory?", true);
  send.send(formData);
    
  function updatePage0()  {  
    if(this.readyState === 4 && this.status === 200) {
      handleResponse(this.responseText);
    }
  }
}

function getForm(blob) {

  var formData = new FormData();
  var mediaName = media[current].split("/")[3];
  var name = mediaName.split("\.")[0];  
  var id = sessionStorage.getItem('id'); 
  var num = time();
  mediaName = id + "/" + mediaName;
  formData.append("file", blob, name+num+"story.wav");
  formData.append("assocPic", mediaName);
  formData.append("creator", id);
  formData.append("owner", id);

  return formData;

}

function handleResponse(response) {

  var result = source('response');
  var reply;
  var success = false;
  switch(response) {
    case "alreadyExist": reply = "Already Exists"; break;
    case "failtypes": reply = "Unable to associate image with image"; break;
    case "success": success = true; break;
    default: reply = "error with upload";
  }
  if(!success) result.innerHTML = reply;
  else
    window.location.href = "story.html";
}


