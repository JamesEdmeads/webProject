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
      console.log(response[0]);
      switch(response[0])  {
        case "success": showStory();break;
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
      reply = "already linked to this person's story. Click continue"; break;
    case "fail": 
      reply = "unble to link. Please try again"; break;
    default: 
      reply = "please try again";
  }

  show.innerHTML = reply;

}

function showStory()  {
  document.getElementById('fail').innerHTML = "";
}

function setUp()  {
  var owner = sessionStorage.getItem('owner');

  document.getElementById('oNameGo').addEventListener('click', associate);
  if(owner==="false") {
    document.getElementById('rel').style.display = "block";
  }


}
