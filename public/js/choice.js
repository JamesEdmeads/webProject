addEventListener('load', setUp);

//sends message to server to get associations for user
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
          switch(response0[0]) {
            case "success": success(response);break;
            case "fail": 
            case "noAssociate" :  
            default : error(response0[0]);break;

          }
        }
    }

}

//if owner re-directs to view of story 
//if not owner displays the stories user is allowed to contribute to
function success(list)  {

  var owner = sessionStorage.getItem('owner');
  if(owner === "true") {
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
        li.className = "list";
        ul.appendChild(li);
      }
    }
    res.appendChild(ul);
  }

}

//adds associate name to local storage then re-directs
function add0()  {
  var choice = this.textContext || this.innerText;
  sessionStorage.setItem('associate', choice);
  window.location.href = "view.html";

}

//handles fails
function fail(error)  {

  var reply = document.getElementById('fail');
  if(error === "noAssociate")
    reply.innerHTML = "no one is connected to your account."+
    " Please add connection";
  else if(error === "fail")
    reply.innerHTML = "unable to get connection, please try again";
  else if (error === "isNull") 
    goBack(reply);

}

//pauses for a second to display message then re-directs to 
//the log in page
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function goBack(reply) {
  reply.innerHTML = "unable to read your name, returning to log in";
  await sleep(1000);
  window.location.href = "index.html";
}
  

function viewStory() { 

  window.location.href = "story.html";

}

//re-directs to add to a story
function add() {

  window.location.href = "intropage.html";

}

//initial set up function. Determines whether user is the owner
//of the story or a contributor and changes the options accordingly
function setUp(){

  document.getElementById("update").addEventListener('click', send);
  var view = document.getElementById("view");
  view.addEventListener('click', viewStory);
  var add0 = document.getElementById("add");
  add0.addEventListener('click', add);

  var owner = sessionStorage.getItem('owner');

  if(owner === "false") {
    add0.style.display = "block";
  }
  else {
    view.style.display = "block";
  }
    

}
