"use strict"

addEventListener('load', setUp);

//sends request to server to associate user with an account
//directs responses to functions to deal with 
function associate() {

  var store = sessionStorage.getItem('id');
  var userOwner = document.getElementById('ownerName').value;
  var send = new XMLHttpRequest();

  send.onreadystatechange = updatePage;
  send.open("GET", "associate?"+store+"?"+userOwner);
  send.send();

  function updatePage()  {

    if(this.readyState === 4 && this.status === 200) {
      var response = this.responseText;
      var response = response.split("?");

      switch(response[0])  {
        case "success": showStory(userOwner);break;
        case "wrongUName": case "alreadyExists":
        case "fail": default: fail(response[0]); 
      }
      
    }
  }

}

//deals with all failed associations
function fail(code)  {
  var show = document.getElementById('fail');
  var reply;
  switch(code) {
    case "wrongUName": 
      reply = "unknown user: please re-enter"; break;
    case "alreadyExists": 
      reply = "already linked to this person's story. Click continue";
      addContinue(); 
      break;
    case "fail": 
      reply = "unble to link. Please try again"; break;
    case "notOwner":
      reply = "selected person does not have a story, please select again";
      break;
    default: 
      reply = "please try again";
  }

  show.innerHTML = reply;

}

//creates continue button to add when user tries to add an
//association to an account they are already connected to
function addContinue()  {

  var button = document.createElement("INPUT");
  button.type = "button";
  button.value = "continue";
  button.className = "buttons";
  button.addEventListener('click', addShow);
  var cont = document.getElementById('cont');
  cont.appendChild(button);

}

//gets values from page to re-direct user to their story page
function addShow() {

  var userOwner = document.getElementById('ownerName').value;
  showStory(userOwner);

}

//sets session storage for the associate then re-directs to story page
function showStory(name)  {

  sessionStorage.setItem('associate', name);
  window.location.href = "view.html";

}

//for new owners, adds text and a continue button
function newOwner()  {

  var owner = sessionStorage.getItem('id');
  sessionStorage.setItem('associate', owner);
  var div = document.getElementById("newOwner");

  var p = document.createElement("P");
  p.innerHTML = "To start recording your story click continue";
  div.appendChild(p);

  var cont = document.createElement("INPUT");
  cont.value = "continue";
  cont.type = "button";
  cont.className = "buttons";
  cont.addEventListener('click', go);
  div.appendChild(cont);

}

//re-directs to the story page
function go() {

  window.location.href = "view.html";

}

//changes options depending on whether user is the story owner or not
function setUp()  {

  var owner = sessionStorage.getItem('owner');

  document.getElementById('oNameGo').addEventListener('click', associate);
  if(owner==="false") {
    document.getElementById('rel').style.display = "block";
  } 
  else {
    newOwner();
  }


}
