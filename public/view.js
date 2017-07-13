


addEventListener('load', setUp);

function setUp() {
  console.log("here");
  display()

}


function display()  {

  var send = new XMLHttpRequest();

  send.onreadystatechange = updatePage;
  send.open("GET", "display", true);
  send.send();

  function updatePage()  {

    if(this.readyState === 4 && this.status === 200) {

      var response = this.responseText;
      console.log(response);
      if(response === "fail")  {
        console.log(response); //TODO: change
      }
      else {
        var results = response.split("?");
        var i;
        var node = document.getElementById('image');

        for(i = 1; i < results.length; i += 2) {
          var image = document.createElement("IMG");
          image.src = results[i+1];
          image.alt = results[i];
          image.className = "image";
          node.appendChild(image);

        } 
        
      }

    }


  }

}
