
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
  console.log(sessionStorage.getItem('owner')); 

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
        console.log(response); //TODO: change
      }
      else if(response === "isNull" || response === "alreadyExists"||response === "fail")
        console.log("!!!!!!!!!!!!!!!!!!failed");
      else {
        var results = response.split("?");
        var i;
        var node = document.getElementById('image');

        for(i = 1; i < results.length; i += 2) {
          var part = results[i].split("\.")[1];
          console.log("PART: ",part);
          if(part === "jpg")  { //change to include other types
            seen.push(results[i]);
            if(!done(results[i]))  {
              var nLine = document.createElement("BR");
              node.appendChild(nLine);
              var image = document.createElement("IMG");
              image.src = results[i+1];
              image.alt = results[i];
              image.className = "image";
              node.appendChild(image);
              addMusicUpload(node);
            }
          }
          else if(part === "mp3") {
            var name = document.createElement("LABEL");
            name.innerHTML = results[i].split("\.")[0];
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
  console.log("HERE: ",parent);
  var message = document.createElement("LABEL");
  message.innerHTML = "upload new audio for this picure";
  node.appendChild(message);
  

  var form = document.createElement("FORM");
  form.action = "/addMusic";
  form.enctype = "multipart/form-data";
  form.method = "post";
  
  var input0 = document.createElement("INPUT");
  input0.id = "musicUpload";
  input0.type = "file";
  input0.name = "upload";
  
  var input1 = document.createElement("INPUT");
  input1.className = "hidden";
  input1.type = "text";
  input1.id = "creator";

  /*var input2 = document.createElement("INPUT");
  input2.className = "hidden";
  input2.type = "text";
  input2.id = "assocPic";*/

  var input3 = document.createElement("INPUT");
  input3.type = "submit";
  input3.value = "Upload";

  form.appendChild(input0);
  form.appendChild(input1);
  //form.appendChild(input2);

  form.appendChild(input3);
  node.appendChild(form);
  //input2.value = form.previousSibling.previousSibling.alt;
  input1.value = sessionStorage.getItem('id');
  console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
 // console.log(document.getElementById('assocPic').value);
  console.log(document.getElementById('creator').value);


}

function done(current)  {
  var i;
  for(i = 0; i < seen.length-1; i++)  {
    console.log("SEEN: ",seen[i]);
    if(seen[i] === current) return true;
  }
  return false;

}


}
