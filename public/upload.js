"use strict"

addEventListener('load', setUp);


function print()  {

console.log("here");
  var file = this.files[0];
  console.log(file);
  console.log("FILE NAME: "+file.name);
  console.log("FILE size: "+file.size);
  console.log("type: "+file.type);
}

function send()  {
  
  console.log("pressed");

  var pic = document.getElementById("picUpload");

  console.log(pic.files[0]);

  var formData = new FormData();
  formData.append("Pic", pic);
  

  var send = new XMLHttpRequest();

  send.onreadystatechange = updatePage;
  send.open("GET", "upload", true);
  send.send(formData);

  function updatePage()  {

    if(this.readyState === 4 && this.status === 200) {
      var response = this.responseText;
      console.log("update page: ", response);
    }

  }

}

function setUp()  {
  document.getElementById("picUpload").addEventListener('change', print);
  document.getElementById("musicUpload").addEventListener('change', print);
  document.getElementById("upload").addEventListener('click', send);


}


