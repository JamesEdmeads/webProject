"use strict"

addEventListener('load', setUp);

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

function fail(code)  {
  var show = document.getElementById('fail');
  var reply;
  switch(code) {
    case "wrongUName": 
      reply = "unknown user: please re-enter"; break;
    case "alreadyExists": 
      reply = "already linked to this person's story. Click continue";
      console.log("already exists");
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

function addContinue()  {
  console.log("in add continue");
  var button = document.createElement("INPUT");
  button.type = "button";
  button.value = "continue";
  button.addEventListener('click', addShow);
  console.log(button);
  var cont = document.getElementById('cont');
  cont.appendChild(button);

}

function addShow() {
  console.log("here");
  var userOwner = document.getElementById('ownerName').value;
  showStory(userOwner);

}

function showStory(name)  {
  console.log("in show Story");
  sessionStorage.setItem('associate', name);
  window.location.href = "view.html";
}

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
  cont.addEventListener('click', go);
  div.appendChild(cont);

}

function go() {

  window.location.href = "view.html";

}

function setUp()  {
  var owner = sessionStorage.getItem('owner');
  console.log(owner);

  document.getElementById('oNameGo').addEventListener('click', associate);
  if(owner==="false") {
    document.getElementById('rel').style.display = "block";
  } 
  else {
    newOwner();
  }


}
