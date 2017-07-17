addEventListener('load', setUp);

function send()  {

    var id = sessionStorage.getItem('id');
    var send = new XMLHttpRequest();
    send.onreadystatechange = updatePage;
    send.open("GET", "relations?"+id);
    send.send();

    function updatePage()  {
       if(this.readyState === 4 && this.status === 200) {
        var response = this.responseText;
        var response0 = response.split("?");
          console.log(response0);
          switch(response0[0]) {
            case "success": success(response);break;
            case "fail": 
            case "noAssociate" :  
            default : error(response0[0]);break;

          }
        }
    }

}

function success(list)  {
  var owner = sessionStorage.getItem('owner');
  console.log(owner);
  if(owner === "true") {
    console.log("here");
    window.location.href = "view.html";
  } else {

    var response = list.split("?");
    var res = document.getElementById('fail');
    res.innerHTML = "Select Person's story to update"
    var ul = document.createElement("UL");
    for (var i = 1; i < response.length; i++)  {
      if(response[i] !== "") {
        var li = document.createElement("LI");
        li.addEventListener('click', add0);
        li.innerHTML = response[i];
        ul.appendChild(li);
      }
    }
    res.appendChild(ul);
  }

}

function add0()  {
  var choice = this.textContext || this.innerText;
  sessionStorage.setItem('associate', choice);
  window.location.href = "view.html";


}

function fail(error)  {

  var reply = document.getElementById('fail');
  if(error === "noAssociate")
    reply.innerHTML = "no one connected to your account. Plase add connection";
  else if(error === "fail")
    reply.innerHTML = "unable to get connection, please try again";
  else if (error === "isNull") 
    goBack(reply);

}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function goBack(reply) {
  reply.innerHTML = "unable to read your name, returning to log in";
  await sleep(1000);
  window.location.href = "index.html";
}
  

function viewStory() {

  console.log("todo");

}

function add() {

  window.location.href = "intropage.html";

}


function setUp(){

  document.getElementById("update").addEventListener('click', send);
  var view = document.getElementById("view");
  view.addEventListener('click', viewStory);
  var add0 = document.getElementById("add");
  add0.addEventListener('click', add);

  var owner = sessionStorage.getItem('owner');

  if(owner === "false") {
    console.log("here");
    add0.style.display = "block";
  }
  else {
    view.style.display = "block";
  }
    

}
