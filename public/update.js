addEventListener('load', setUp);

function updateForm()  {

  var creator = sessionStorage.getItem('id');
  document.getElementById('creator').value = creator;

}


function setUp() {
  
  updateForm();

}
