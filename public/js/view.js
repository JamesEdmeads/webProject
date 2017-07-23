
var seen = [];

addEventListener('load', setUp);

//calls functions to setup the page correctly
function setUp() {

  updateForm();
  ownerOptions();
  display();

}

//puts values into hidden forms
function updateForm()  {

  var creator = sessionStorage.getItem('id');
  document.getElementById('creator').value = creator; 
  var owner = sessionStorage.getItem('associate');
  document.getElementById('owner').value = owner;

}

//if owner display button for them to continue to view story page
function ownerOptions()  {

  var owner = sessionStorage.getItem('owner');

  if(owner === 'true' || owner === 1) {
    document.getElementById("viewButton").style.display = "block";
    document.getElementById('view').addEventListener('click', view);
  }

}

//re-directs to the view story page
function view()  {
  //re-direct to view button
  window.location.href = "story.html";

}

//sends request to server to get the media associated with 
//the account
//on response - sends to functions to dynamically create 
//image and audio html to display correctly the items returned
//checks what has already been displayed to avoid duplication
function display()  {

  var owner = sessionStorage.getItem('owner');
  if(owner === true) {
    var id = sessionStorage.getItem('id');
  } else {
    var id = sessionStorage.getItem('associate');
  }
  var send = new XMLHttpRequest();

  send.onreadystatechange = updatePage;
  send.open("GET", "display?"+id, true);
  send.send();

  function updatePage()  {

    if(this.readyState === 4 && this.status === 200) {

      var response = this.responseText;
      if(response === "fail" || response === "isNull" || response === "alreadyExists"||response === "fail") {
          fail();
      }
      else {
        var results = response.split("?");
        var i;
        var node = document.getElementById('image');

        for(i = 1; i < results.length; i += 2) {
          var part = results[i].split("\.")[1];
          if(part === "jpg" || part === "png" || part === "jpeg")  { 
            seen.push(results[i]);
            if(!done(results[i]))  {
              appendImage(node, results[i+1], results[i]);
            }
          }
          else if(part === "mp3" || part === 'aac' || part === "ogg" || part === "wav") { 
            appendMusic(node, results[i+1], results[i])
          }
        }   
      }
    }
  }
}

//pauses for a second to display message then re-directs to 
//the log in page
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fail() {
  reply.innerHTML = "Error, returning to log in";
  await sleep(1000);
  window.location.href = "index.html";
}
  

//creates image HTML for each image
function appendImage(node, next, current)  {

  var nLine = document.createElement("BR"); 
  node.appendChild(nLine);
  var image = document.createElement("IMG");
  image.src = next;
  image.alt = current;
  image.className = "image";
  node.appendChild(image);
  addMusicUpload(node);

}

//creates music HTML for each song associated with the image
function appendMusic(node, next, song)  {

  var name = document.createElement("LABEL");
  var temp = song.split("/")[1];
  name.innerHTML = temp.split("\.")[0];
  name.className = "audio";
  name.id = "audioName";
  node.appendChild(name);
  var music = document.createElement("AUDIO");
  music.controls = "controls";
  music.controlsList = "nodownload";
  music.src = next;
  music.alt = song;
  music.className = "audio";
  node.appendChild(music);

}

//creates form HTML to add new music to each image file
function addMusicUpload(node)  {
  var parent = node.lastChild.alt
  var message = document.createElement("LABEL");
  message.innerHTML = "upload new audio for this picure:";
  message.className = "audioUploadTag"
  node.appendChild(message);
  
  var form = document.createElement("FORM");
  form.action = "/addMusic?0";
  form.enctype = "multipart/form-data";
  form.method = "post";
  form.className = "musicForm";

  var names = ["creator", "assocPic", "ownerForm"];
  var inputs = [];

  var input0 = document.createElement("INPUT");
  input0.id = "musicUpload";
  input0.type = "file";
  input0.name = "upload";
  //input0.className = "buttons";
  inputs.push(input0);

  for(var i = 1; i < 4; i++) {

    var input = document.createElement("INPUT");
    input.className = "hidden";
    input.type = "text";
    input.id = names[i-1];
    input.name = names[i-1];
    inputs.push(input);

  }

  var input4 = document.createElement("INPUT");
  input4.type = "submit";
  input4.value = "Upload";
  input4.className = "buttons";
  inputs.push(input4);

  for(var i = 0; i < inputs.length; i++)  {
    form.appendChild(inputs[i]);
  }

  node.appendChild(form);
  updateValues(inputs[1], inputs[2], inputs[3], form);

}

//updates form created above for the music uploads to have the 
//correct values
function updateValues(input1, input2, input3, form)  {
  
  var value3;
  input1.value = sessionStorage.getItem('id');
  input2.value = form.previousSibling.previousSibling.alt;
  var owner = sessionStorage.getItem('owner');

  if(owner === 'true' || owner === 1) {
    value3 = sessionStorage.getItem('id');
    input3.value = value3;
  } else {

    input3.value = sessionStorage.getItem('associate');
  }
  console.log(form);
}

//checks whether images have already been seen so they are not displayed
function done(current)  {
  var i;
  for(i = 0; i < seen.length-1; i++)  {
    if(seen[i] === current) return true;
  }
  return false;

}



