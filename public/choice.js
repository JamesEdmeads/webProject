addEventListener('load', setUp);

function update()  {

  console.log("send to update"):

}

function view() {

  console.log("send to view");

}

function add() {

 window.location.href = "intropage.html";

}


function setUp(){

  document.getElementById("update").addEventListener('click', update);
  var view = document.getElementById("view");
  view.addEventListener('click', view);
  var add = document.getElementById("add");
  add.addEventListener('click', add);

  var owner = sessionStorage.getItem('owner');
  if(owner === "false") {
    add.style.display = "block";
  }
  else {
    view.style.display = "block";
  }
    

}
