"use strict"

addEventListener('load', setUp);

function submit()  {

  var name = document.getElementById("name").value;
  var pw = document.getElementById("pw").value;
  var owner = document.getElementById("own").checked;

  var send = new XMLHttpRequest();

  send.onreadystatechange = updatePage;
  send.open("GET", "newUser?"+name+"?"+pw+"?"+owner, true);
  send.send();

  function updatePage()  {

    if(this.readyState === 4 && this.status === 200) {
      var response = this.responseText;
      var response = response.split("?");
      switch(response[0])  {
        case "fail": document.getElementById("response").innerHTML = "failed: please try again";break;
        case "success": newUser(response[1]);break;
        default: window.location.href = "index.html";

      }
    }
  }
}

function newUser(response)  {
  sessionStorage.setItem('id', response);
  window.location.href = "/intropage.html";
  //re-direct(); to go to new user page

}

function login()  {

  var name = document.getElementById('eUser').value;
  var pw = document.getElementById('ePw').value;

  var send = new XMLHttpRequest();

  send.onreadystatechange = updatePage;
  send.open("GET", "login?"+name+"?"+pw, true);
  send.send();

  function updatePage()  {
    if(this.readyState === 4 && this.status === 200)  {
      var response = this.responseText;
      var response = response.split("?");
      switch(response[0])  {
        case "Fail": redo(); break;
        case "success" : loggedIn(response[1]); break;
        default: window.location.href = "index.html";

      }
    }

  }
}

function loggedIn(response)  {
  
  sessionStorage.setItem('id', response);
  document.getElementById("response").innerHTML = "<p>success</p>";
  //re-direct

}
function redo() {
  document.getElementById("response").innerHTML = "wrong password - please re-enter";

}

function show()  {
  document.getElementById('newUser0').style.display = "block";
  document.getElementById('existUser').style.display = "none";

}

function show0()  {
  document.getElementById('existUser').style.display = "block";
  document.getElementById('newUser0').style.display = "none";

}

function setUp()  {
  
  var formSubmit = document.getElementById('formSend');
  formSubmit.addEventListener('click', submit);
  document.getElementById('newUser').addEventListener('click', show);
  document.getElementById('login').addEventListener('click', show0);
  document.getElementById('send').addEventListener('click', login);

}
