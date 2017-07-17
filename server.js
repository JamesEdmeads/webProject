//adapted from Dr Ian Holyer's server.js

var http = require("http");
var formidable = require("formidable");
var QS = require("querystring");
var fs = require("fs");
var OK = 200, NotFound = 404, BadType = 415, Error = 500;
var types, banned, parameters = "";
var dbFunction = require("./DB/db.js");

startHTTP(8080);

function startHTTP(port) {

    types = defineTypes();
    banned = [];
    banUpperCase("./public/", "");
    var service = http.createServer(handleHTTP);
    service.listen(port, "localhost");
    var address = "http://localhost";
    if (port != 80) address = address + ":" + port;
    console.log("Server running at", address);

}


// Serve a request by delivering a file.
function handleHTTP(request, response) {

    var url = request.url.toLowerCase();
    var requestURL = url.split("?");

    if (url.endsWith("/")) url = url + "index.html";
    if(reject(url)) return fail(response, NotFound, "URL access refused");
    if(isBanned(url)) return fail(response, NotFound, "URL has been banned");
    var type = findType(url, request);

    switch (requestURL[0])  {
      case "/newuser" : newUser(requestURL[1], requestURL[2], requestURL[3], response, type); break;
      case "/login" : login(requestURL[1], requestURL[2], response, type); break;
      case "/associate" : associate(requestURL[1], requestURL[2], response, type); break;
      case "/display" : display(requestURL[1], response, type); break;
      case "/addpic" : addPic(request, response, type); break;
      case "/addmusic" : addMusic(request, response, type); break;
      case "/relations" : getRelations(requestURL[1], response, type); break;
      default: defaultReply(response, type, url);

    }

    //if (type == null) return fail(response, BadType, "File type unsupported"); //TODO - add all types we allow

}

function getRelations(id, response, type)  {

  dbFunction.getPersonAssociation(id, execute);

  function execute(result){
    var textTypeHeader = { "Content-Type": "text/plain" };
    response.writeHead(200, textTypeHeader);
    response.write(result);
    response.end();
  }
}

function display(owner, response, type)  {

  dbFunction.getMedia(owner, execute);

  function execute(result){
      var textTypeHeader = { "Content-Type": "text/plain" };
      response.writeHead(200, textTypeHeader);
      response.write(result);
      response.end();
  }

}

function associate(name, owner, response, type)  {

    dbFunction.associate(name, owner, execute);

    function execute(result) {
      var textTypeHeader = { "Content-Type": "text/plain" };
      response.writeHead(200, textTypeHeader);
      response.write(result);
      response.end();
    }
}

function login(name, pw, response, type)  {

  var user = dbFunction.checkUser(name, pw, execute);

    function execute(result) {
      var textTypeHeader = { "Content-Type": "text/plain" };
      response.writeHead(200, textTypeHeader);
      response.write(result);
      response.end();
    }

}

function addMusic(request, response, type) { //TODO:come back to this - need to associate and get pic name from form
  var name0, path, owner, creator;

    var form = new formidable.IncomingForm();
    form.parse(request);

    form.on('fileBegin', function (name, file){  
      path = "files/"+file.name;
    });

    form.on('file', function(name, file)  { 
      name0 = file.name;
    });

    form.on('field', function(name, value) {
      creator = value;
    });

    form.on('end', function(){
      //dbFunction.addMedia(name0, path, creator, creator, execute ); //tochange
      function execute() {
        renderHTML("./public/view.html", response, type);
      }
    });


}

function addPic(request, response, type)  {

  var name0, path, owner, creator;

    var form = new formidable.IncomingForm();
    form.parse(request, function(err, fields, files){
      var oldpath = files.upload.path;
      var newpath = './files/' + files.upload.name;
      fs.rename(oldpath, newpath, function (err) {
        if (err) console.log(err); //TODO:change
      });
     });

    form.on('fileBegin', function (name, file){
      path = "./files/"+file.name;
    });

    form.on('file', function(name, file)  { 
      name0 = file.name;

    });

    form.on('field', function(name, value) {
      creator = value;
    });

    form.on('end', function(){   
      dbFunction.addMedia(name0, path, creator, creator, execute ); 

      function execute() {
        renderHTML("./public/view.html", response, type);
      }
    });

}

function newUser(name, pw, owner, response, type)  {

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
function defaultReply(response, type, url){ //TODO:this will need to change to be secure

    if (type === null) return fail(response, BadType, "File type unsupported");
    var place = url.lastIndexOf(".");
    var bit = url.substring(place);
    if(bit === ".jpg" || bit === ".mp3") {
      var file = "."+url;
    }else{
      var file = "./public" + url;
    }
    renderHTML(file, response, type);

}


// Delivers the website
function renderHTML(file, response, type){

    fs.readFile(file, ready);
    function ready(err, content) { deliver(response, type, err, content); }

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


// Addapted to the types we use
function defineTypes() {

    var types = {
        html : "text/html",
        xhtml : "application/xhtml+xml",
        css  : "text/css",
        js   : "application/javascript",
        png  : "image/png",
        gif  : "image/gif",    // for images copied unchanged
        jpeg : "image/jpeg",   // for images copied unchanged
        jpg  : "image/jpeg",   // for images copied unchanged
        svg  : "image/svg+xml",
        json : "application/json",
        pdf  : "application/pdf",
        txt  : "text/plain",
        ttf  : "application/x-font-ttf",
        woff : "application/font-woff",
        aac  : "audio/aac",
        mp3  : "audio/mpeg",
        mp4  : "video/mp4",
        webm : "video/webm",
        ico  : "image/x-icon", // just for favicon.ico
        xhtml: undefined,      // non-standard, use .html
        htm  : undefined,      // non-standard, use .html
        rar  : undefined,      // non-standard, platform dependent, use .zip
        doc  : undefined,      // non-standard, platform dependent, use .pdf
        docx : undefined,      // non-standurard, platform dependent, use .pdf
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


// Checks if string is a valid ascii, addapted from:
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

    for (var i=0; i<banned.length; i++) {
        var b = banned[i];
        if (url.startsWith(b)) return true;
    }
    return false;

}


