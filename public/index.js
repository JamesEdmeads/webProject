"use strict"

addEventListener('load', setUp);

function submit()  {

  var name = document.getElementById("name").value;
  var pw = document.getElementById("pw").value;

  var send = new XMLHttpRequest();

  send.onreadystatechange = updatePage;
  send.open("GET", "login?"+name+"?"+pw, true);
  send.send();

  function updatePage()  {

    if(this.readyState === 4 && this.status === 200) {
      var response = this.responseText;
      console.log("update page: ",response);
      switch(response)  {
        case "success": loggedIn(); break;
        case "Fail": redo(); break;
        case "newUser": newUser(); break;
        default: window.location.href = "index.html";
      }


    }

  }

}

function newUser()  {
  document.getElementById("response").innerHTML = "added user";

}

function loggedIn()  {
  document.getElementById("response").innerHTML = "<p>success</p>";

}

function redo() {
  document.getElementById("response").innerHTML = "wrong password";

}

function setUp()  {
  
  var formSubmit = document.getElementById('formSend');
  formSubmit.addEventListener('click', submit);

}
