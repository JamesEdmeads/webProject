addEventListener('load', setUp);

function update()  {

  window.location.href = "update.html";

}

function viewStory() {

  window.location.href = "view.html";

}

function add() {

  window.location.href = "intropage.html";

}


function setUp(){

  document.getElementById("update").addEventListener('click', update);
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
