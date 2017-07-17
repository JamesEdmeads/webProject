
var seen = [];

addEventListener('load', setUp);

function setUp() {

  updateForm();
  ownerOptions();
  display();

}

function updateForm()  {

  var creator = sessionStorage.getItem('id');
  document.getElementById('creator').value = creator; 
  var owner = sessionStorage.getItem('associate');
  document.getElementById('owner').value = owner;

}

function ownerOptions()  {

  var owner = sessionStorage.getItem('owner');

  if(owner === 'true' || owner === 1) {
    document.getElementById("viewButton").style.display = "block";
    document.getElementById('view').addEventListener('click', view);
  }

}

function view()  {
  //re-direct to view button
  console.log("TODO: re-direct");

}


function display()  {

  var owner = sessionStorage.getItem('owner');
  if(owner === true) {
    var id = sessionStorage.getItem('id');
  } else {
    var id = sessionStorage.getItem('associate');
  }
  var send = new XMLHttpRequest();

  send.onreadystatechange = updatePage;
  send.open("GET", "display?"+id, true);
  send.send();

  function updatePage()  {

    if(this.readyState === 4 && this.status === 200) {

      var response = this.responseText;
      if(response === "fail")  {
        console.log("fail"); //TODO: change
      }
      else if(response === "isNull" || response === "alreadyExists"||response === "fail")
        console.log("failed");//TODO: change
      else {
        var results = response.split("?");
        var i;
        var node = document.getElementById('image');

        for(i = 1; i < results.length; i += 2) {
          var part = results[i].split("\.")[1];
          if(part === "jpg")  { //TODO: change to include other types
            seen.push(results[i]);
            if(!done(results[i]))  {
              var nLine = document.createElement("BR"); //TODO : change to seperate functions
              node.appendChild(nLine);
              var image = document.createElement("IMG");
              image.src = results[i+1];
              image.alt = results[i];
              image.className = "image";
              node.appendChild(image);
              addMusicUpload(node);
            }
          }
          else if(part === "mp3") { //TODO: change to include other types
            var name = document.createElement("LABEL");
            var temp = results[i].split("/")[1];
            name.innerHTML = temp.split("\.")[0];
            node.appendChild(name);
            var music = document.createElement("AUDIO");
            music.controls = "controls";
            music.controlsList = "nodownload";
            music.src = results[i+1];
            music.alt = results[i];
            node.appendChild(music);
          }
        } 
        
      }
    }
  }

function addMusicUpload(node)  {
  var parent = node.lastChild.alt
  var message = document.createElement("LABEL");
  message.innerHTML = "upload new audio for this picure";
  node.appendChild(message);
  
  var form = document.createElement("FORM");
  form.action = "/addMusic";
  form.enctype = "multipart/form-data";
  form.method = "post";

  var names = ["creator", "assocPic", "ownerForm"];
  var inputs = [];

  var input0 = document.createElement("INPUT");
  input0.id = "musicUpload";
  input0.type = "file";
  input0.name = "upload";
  inputs.push(input0);

  for(var i = 1; i < 4; i++) {

    var input = document.createElement("INPUT");
    input.className = "hidden";
    input.type = "text";
    input.id = names[i-1];
    input.name = names[i-1];
    inputs.push(input);

  }

  var input4 = document.createElement("INPUT");
  input4.type = "submit";
  input4.value = "Upload";
  inputs.push(input4);

  for(var i = 0; i < inputs.length; i++)  {
    form.appendChild(inputs[i]);
  }

  node.appendChild(form);
  updateValues(inputs[1], inputs[2], inputs[3], form);

}

function updateValues(input1, input2, input3, form)  {
  
  var value3;
  input1.value = sessionStorage.getItem('id');
  input2.value = form.previousSibling.previousSibling.alt;
  var owner = sessionStorage.getItem('owner');

  if(owner === 'true' || owner === 1) {
    value3 = sessionStorage.getItem('id');
    input3.value = value3;
  } else {

    input3.value = sessionStorage.getItem('associate');
  }

}

function done(current)  {
  var i;
  for(i = 0; i < seen.length-1; i++)  {
    if(seen[i] === current) return true;
  }
  return false;

}


}
