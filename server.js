//adapted from Dr Ian Holyer's server.js and server used for web project

var http = require("http");
var https = require("https");
var formidable = require("formidable");
var fs = require("fs");
var fs0 = require('fs-extra');
var mkdir = require('mkdirp');
var OK = 200, NotFound = 404, BadType = 415, Error = 500;
var types, banned, parameters = "";
var dbFunction = require("./DB/db.js");

reDirectHTTP(8080);
startHTTPS(4430);

function reDirectHTTP(port) {

  var service = http.createServer(reDirect)
  service.listen(port, "localhost");

}

function reDirect(request, response)  {

  response.writeHead(302, {'Location':'https://localhost:4430/index.html'});
  response.end();

}

//creates server and starts listening on port
function startHTTPS(port) {

  const options = {
    key: fs.readFileSync('key/server.key'),
    cert: fs.readFileSync('key/server.crt')
  }

  types = defineTypes();
  banned = [];
  banUpperCase("./public/", "");
  var service = https.createServer(options, handleHTTPS);
  service.listen(port, "localhost");
  var address = "https://localhost";
  if (port != 80) address = address + ":" + port;
  console.log("Server running at", address);

}


// Serve a request by delivering a file.
function handleHTTPS(request, response) {

  var url = request.url.toLowerCase();
  var reqType = url.split("?");

  if (url.endsWith("/")) url = url + "index.html";
  if(reject(url)) return fail(response, NotFound, "URL access refused");
  if(isBanned(url)) return fail(response, NotFound, "URL has been banned");
  var type = findType(url, request);

  switch (reqType[0])  {
    case "/newuser" : newUser(reqType[1], reqType[2], reqType[3], response, type); break;
    case "/login" : login(reqType[1], reqType[2], response, type); break;
    case "/associate" : associate(reqType[1], reqType[2], response, type); break;
    case "/display" : display(reqType[1], response, type); break;
    case "/addpic" : addPic(request, response, type); break;
    case "/relations" : getRelations(reqType[1], response, type); break;
    case "/addstory": case "/addmusic":
      addStory(request, response, type, reqType[0]); break;
    default: defaultReply(response, type, url);

  }

}

//inspired by
//http://www.codediesel.com/nodejs/processing-file-uploads-in-node-js/

// adds an image to a user's profile
function addPic(request, response, type)  {

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
    var newPath = './files/'+owner0+"/"+fileName; 

    if(!checkPic(name0)) execute("fail");
    else fs0.copy(tempPath, newPath, done);
 
    function done(err) {  
      if (err) console.error(err);
      else {
        var name1 = owner0+"/"+name0;
        dbFunction.addMedia(name1, newPath, creator, owner0, null, execute); 
      }
    }

    function execute(result) {
      renderHTML("./public/view.html", response, type);
    }
  }
}

function addStory (request, response, type, reDirect) {

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
    var fileName = this.openedFiles[0].name;
    var newPath = './files/'+owner0+"/"+fileName; 

    if(!checkMusic(name0)) execute("fail");
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

function checkPic(name) {
  var check = name.split("\.")[1];
  if(check === 'jpg' || check === 'jpeg' || check === 'png') 
    return true;
  else return false;

}

function checkMusic(name)  {

  var check = name.split("\.")[1];
  if(check === 'wav' || check === 'mp3' || check === 'aac' || check === 'ogg')
    return true;
  else return false;
  
}


//all below functions wrappers for db.functions that pass execute to be used
//on completion of database actions

//gets user's associated peoplpe
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

  var user = dbFunction.checkUser(name, pw, execute);

  function execute(result) {
    var textTypeHeader = { "Content-Type": "text/plain" };
    response.writeHead(200, textTypeHeader);
    response.write(result);
    response.end();
  }

}

//adds a new user to the database
function newUser(name, pw, owner, response, type)  {
  
  if(owner === "true") {
    mkdir('./files/'+name, function (err) {
      if(err) console.log(err) //for maintenance
    });
  }

  var user = dbFunction.addUser(name, pw, owner, execute);

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

  if (type === null) return fail(response, BadType, "File type unsupported");
  var place = url.lastIndexOf(".");
  var bit = url.substring(place);
  if(bit === ".jpg" || bit === ".mp3" || bit === ".jpeg" || bit === ".png" 
    || bit === ".aac" || bit === ".wav" || bit === ".ogg") {
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


// Addapted to the types used
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


