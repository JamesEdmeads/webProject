addEventListener('load', setUp);

var media = [];
var seen = [];
var current = 0;
var last = 0;

function setUp() {
  console.log("here");
  var nextImage = document.getElementById('nextImage');
  var nextSong = document.getElementById('nextSong');

  nextImage.addEventListener('click', nextPic);

  loadMedia();

}

function fail() {
  
  var response = document.getElementById('response');
  response.innerHTML = 
  "No story to load, click continue to add to story";

  var button = document.createElement('BUTTON');
  button.className = "buttons";
  button.name = "continue";
  button.addEventListener('click', update);
  
  response.appendChild(button);

}

function update()  {

  window.location.href = "view.html";

}

function display()  {

  var image = document.getElementById('image');

  image.src = media[current];

}

function nextPic() {

  current = getNext();

  display();

}

function getNext() {
 
  var part;
  for( var i = current+1; i < media.length; i++) {
    part = media[i].split("\.")[2];
    if(part === "jpg" || part === "png" || part === "jpeg") {
    last = current;
    return i;
    }
  }
  return last;

}

function loadMedia() {

  var owner = sessionStorage.getItem('id');
  var send = new XMLHttpRequest();
  var seen = [];

  send.onreadystatechange = updatePage;
  send.open("GET", "display?"+owner, true);
  send.send();

  function updatePage()  {
    if(this.readyState === 4 && this.status === 200) {
      var response = this.responseText;
      if(response === "fail" || response === "isNull" || response === "alreadyExists"||response === "fail") {
          fail();
      }
      else {
        var results = response.split("?");
        var part;
        for (var i = 2; i < results.length; i += 2)  {
          part = results[i].split("\.")[2];
          if(part === "jpg" || part === "png" || part === "jpeg") {
            seen.push(results[i]);
          }
          if(!done(results[i], seen) && results[i] !== "null") {
            media.push(results[i]);
          }
        }
      display();
      } 
    }

  }
}

//checks whether images have already been seen so they are not displayed
function done(current, seen)  {

  var i;
  for(i = 0; i < seen.length-1; i++)  {
    if(seen[i] === current) return true;
  }
  return false;

}


  


