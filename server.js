/*adapted from Dr Ian Holyer's server.js and server used for web project
  written by J.Edmeads and J.Valvoda.
*/



var http = require("http");
var formidable = require('formidable');
var fs = require("fs");
var fs0 = require('fs-extra');
var mkdir = require('mkdirp');
var OK = 200, NotFound = 404, BadType = 415, Error = 500;
var types, banned, parameters = "";
var dbFunction = require("./DB/db.js");


startHTTP(3000);

//creates server and starts listening on port
function startHTTP(p) {

  types = defineTypes();
  banned = [];
  banUpperCase("./public/", "");
  var service = http.createServer(handleRequest);
  service.listen(process.env.PORT || p);

}


// Deals with requests to server. Checks allowed request then 
// directs to relevant function
function handleRequest(request, response) {

  var url = request.url.toLowerCase();
  var head = url.split("?");
  console.log(url);
  if (url.endsWith("/")) url = url + "index.html";
  if (reject(url)) return fail(response, NotFound, "URL access refused");
  if (isBanned(url)) return fail(response, NotFound, "URL has been banned");
  
  var type = findType(url, request);

  switch (head[0])  {
    case "/newuser" : newUser(head[1], head[2], head[3], response, type); break;
    case "/login" : login(head[1], head[2], response, type); break;
    case "/associate" : associate(head[1], head[2], response, type); break;
    case "/display" : display(head[1], response, type); break;
    case "/addpic" : addVisual(request, response, type); break;
    case "/relations" : getRelations(head[1], response, type); break;
    case "/addstory": case "/addmusic":
      addAudio(request, response, type, head[0]); break;
    default: defaultReply(response, type, url);

  }

}

//file copy in next two functions inspired by
//http://www.codediesel.com/nodejs/processing-file-uploads-in-node-js/

//although similarities in next two functions kept seperate to avoid
//long multiple condtional statements
//conversion to lowercase of names for security 

// adds an image to a user's profile
function addVisual(request, response, type)  {

  var name0, owner0, creator;
  var form = new formidable.IncomingForm();
  
  form.parse(request) 
  form.on('file', function(name, file)  {name0 = file.name;});
  form.on('field', function(name, value) {
    if(name === 'creator') creator = value;
    else owner0 = value; 
  });
  form.on('end', complete);

  function complete(fields, files) {
    var tempPath = this.openedFiles[0].path;
    var fileName = this.openedFiles[0].name;
    var newPath = './files/'+owner0+"/"+fileName.toLowerCase(); 

    if(!checkVisual(name0)) execute("fail");
    else fs0.copy(tempPath, newPath, done);
 
    function done(err) {  
      if (err) console.error(err);
      else {
        var name1 = owner0+"/"+name0.toLowerCase();
        dbFunction.addMedia(name1, newPath, creator, owner0, null, execute); 
      }
    }

    function execute(result) {
      renderHTML("./public/view.html", response, type);
    }
  }
}

//adds Audio to user's profile
function addAudio (request, response, type, reDirect) {

  var owner0, creator, associate, name0;
  var form = new formidable.IncomingForm();

  form.parse(request);
  form.on('file', function(name, file){name0 = file.name;});
  form.on('field', function(name, value) {
    if(name === "creator") creator = value;
    else if(name === "assocPic") associate = value;
    else owner0 = value;
  });
  form.on('end', complete);

  function complete(fields, files) {
    var tempPath = this.openedFiles[0].path;
    var fileName = this.openedFiles[0].name.toLowerCase();
    var newPath = './files/'+owner0+"/"+fileName.toLowerCase(); 

    if(!checkAudio(name0)) execute("fail");
    else fs0.copy(tempPath, newPath, done);
  
    function done(err) {  
      if (err) console.error(err);
      else {
        var name1 = owner0+"/"+name0;
        dbFunction.addMedia(name1, newPath, creator, owner0, associate, execute); 
      }
    }

    function execute(result) {
      if(reDirect === "/addmusic") {
        renderHTML("./public/view.html", response, type);
      } else {
      var textTypeHeader = { "Content-Type": "text/plain" };
      response.writeHead(200, textTypeHeader);
      response.write(result);
      response.end()
      }
    }
  }
}

//below two functions check type of media to ensure that pictures
//are not stored as music and vice-versa. Checks carried out here
//to reduce database interactions
function checkVisual(name) {
  var check = name.split("\.")[1];
  if(check === 'jpg' || check === 'jpeg' || check === 'png') 
    return true;
  else return false;

}

function checkAudio(name)  {

  var check = name.split("\.")[1];
  if(check === 'wav' || check === 'mp3' || check === 'aac' || check === 'ogg')
    return true;
  else return false;
  
}

//gets user's associated people
function getRelations(id, response, type)  {

  dbFunction.getPersonAssociation(id, execute);

  function execute(result){
    var textTypeHeader = { "Content-Type": "text/plain" };
    response.writeHead(200, textTypeHeader);
    response.write(result);
    response.end();
  }
}

//gets media that belongs to user
function display(owner, response, type)  {

  dbFunction.getMedia(owner, execute);

  function execute(result){
    var textTypeHeader = { "Content-Type": "text/plain" };
    response.writeHead(200, textTypeHeader);
    response.write(result);
    response.end();
  }

}

//associates user with another person
function associate(name, owner, response, type)  {

  dbFunction.associate(name, owner, execute);

  function execute(result) {
    var textTypeHeader = { "Content-Type": "text/plain" };
    response.writeHead(200, textTypeHeader);
    response.write(result);
    response.end();
  }
}

//checks login details
function login(name, pw, response, type)  {

  dbFunction.checkUser(name, pw, execute);

  function execute(result) {
    var textTypeHeader = { "Content-Type": "text/plain" };
    response.writeHead(200, textTypeHeader);
    response.write(result);
    response.end();
  }

}

//adds a new user to the database
function newUser(name, pw, owner, response, type)  {
  
  if(owner === "true") { mkdir('./files/'+name, fail); }

  function fail(err) { if(err) console.log(err); }

  dbFunction.addUser(name, pw, owner, execute);

  function execute(result) {
    var textTypeHeader = { "Content-Type": "text/plain" };
    response.writeHead(200, textTypeHeader);
    response.write(result);
    response.end();
  }

}


////////////////////////////////////////////////////////////
//                          delivery                      //
////////////////////////////////////////////////////////////

    

// Loads the website if it is allowed
function defaultReply(response, type, url){ 

  var temp = url.split('/');
  if (type === null) return fail(response, BadType, "File type unsupported");
  var place = url.lastIndexOf(".");
  var bit = url.substring(place);
  if((checkVisual(bit) || checkAudio(bit)) && temp[1] != "image") { //this allows access -> hackable needed for access to files                                   //could add an and to allow access to users own file
    var file = "."+url;
  }else{
    var file = "./public" + url;
  }
  renderHTML(file, response, type);

}


// Delivers the website
function renderHTML(file, response, type){

  fs.readFile(file, ready);
  function ready(err, content) { 
    deliver(response, type, err, content); 
  }

}

// Deliver the file that has been read in to the browser.
function deliver(response, type, err, content) {

  if (err) return fail(response, NotFound, "File not found");
  var typeHeader = { "Content-Type": type };
  response.writeHead(OK, typeHeader);
  response.write(content);
  response.end();

}

// Give a minimal failure response to the browser
function fail(response, code, text) {

  var textTypeHeader = { "Content-Type": "text/plain" };
  response.writeHead(code, textTypeHeader);
  response.write(text, "utf8");
  response.end();

}

////////////////////////////////////////////////////////////
//                        types                           //
////////////////////////////////////////////////////////////

// Handles browsers which can not deal with xhtm+xml
function findType(url, request) {

  var header = request.headers.accept;
  var accepts = header.split(",");
  var extension;
  var ntype = "application/xhtml+xml";
  var otype = "text/html";

  if (accepts.indexOf(otype) >= 0){

    if (accepts.indexOf(ntype) >= 0){
        var dot = url.lastIndexOf(".");
        extension = url.substring(dot + 1);
    }else{ extension = "html"; }

  }else{

    var dot = url.lastIndexOf(".");
    extension = url.substring(dot + 1);

  }

  return types[extension];

}


// Addapted to the types used by website
function defineTypes() {

  var types = {
    html : "text/html",
    xhtml : "application/xhtml+xml",
    css  : "text/css",
    js   : "application/javascript",
    png  : "image/png",
    jpeg : "image/jpeg",   // for images copied unchanged
    jpg  : "image/jpeg",   // for images copied unchanged
    txt  : "text/plain",
    aac  : "audio/aac",
    mp3  : "audio/mpeg",
    ico  : "image/x-icon", // just for favicon.ico
  }
  return types;

}



////////////////////////////////////////////////////////////
//                         security                       //
////////////////////////////////////////////////////////////

function banUpperCase(root, folder) {

  var folderBit = 1 << 14;
  var names = fs.readdirSync(root + folder);
  for (var i=0; i<names.length; i++) {
    var name = names[i];
    var file = folder + "/" + name;
    if (name != name.toLowerCase()) banned.push(file.toLowerCase());
    var mode = fs.statSync(root + file).mode;
    if ((mode & folderBit) === 0) continue;
    banUpperCase(root, file);
  }

}


// Checks if string is a valid ascii, adapted from:
// https://stackoverflow.com/questions/14313183/javascript-regex-how-do-i-check-if-the-string-is-ascii-only
function isValid(str){
  if(typeof(str)!=='string'){
    return false;
  }
  for(var i=0;i<str.length;i++){
    if(str.charCodeAt(i)>127){
        return false;
    }
  }
  return true;
}


// URL checking, rejects illegal/invalid/empty URLs
function reject(url) {
  var rejectable = ["/./", "/../", "//", "key"];

  if(!isValid(url) || url.length > 2000 || url[0] != "/"){
    return true;
  }

  for (var i=0; i<rejectable.length; i++) {
    if (url.indexOf(rejectable[i]) !== -1){
        return true
    };
  }

  return false;

}


// Forbids any resources which shouldn't be delivered to the browser.
function isBanned(url) {

  for (var i  =0; i<banned.length; i++) {
    var b = banned[i];
    if (url.startsWith(b)) return true;
  }
  return false;

}


