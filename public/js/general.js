/*general wrapper functions
 used to minimise code in js files
 only used where reduces overall code*/

function source(name) {
  return document.getElementById(name);
}

function event(object, event, callback) {
  object.addEventListener(event, callback);
}

function create(element, id0, classname ) {

  var temp = document.createElement(element);
  if(id0 !== "none") {
    temp.id = id0;
  }
  if(classname !== "none"){
    temp.className = classname;
  }
  return temp;

}

function createInput(id0, type0, name0, classname)  {

  var temp = document.createElement("INPUT");

  temp.type = type0;
  if(id0 !== "none") {
    temp.id = id0;
  }
  if(name0 !== "none") {
    temp.name = name0;
  }
  if(classname !== "none") {
    temp.className = classname;
  }
  return temp;

}

function createMedia(element, source, alter, classname) {

  var temp = document.createElement(element);
  temp.src = source;
  temp.alt = alter;
  temp.className = classname;
  if(classname === "audio") {
    temp.controls = "controls";
    temp.controlsList = "nodownload";
  }
  return temp;

}
