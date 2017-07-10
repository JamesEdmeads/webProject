"use strict";

var fs = require("fs");
var file = "DB/data.db"; 
var exists = fs.existsSync(file); 
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(file);


//to add if not user then associations
function addNewUser(userName, pWord, owner)  {
  console.log("adding new user ........" + userName);
  owner = (owner === true) ? 0: 1;
  var ps = db.prepare("insert into person (uname, pword, owner) values(?, ?, ?)");
  try {
    ps.run(userName, pWord, owner);
    ps.finalize();
    return true;
  }catch(err) {
    return false;
  }
  
}

/* NEED:
  get user id
  add media
  add associate
  add mediaassociate
  get associattion person 
  get association media

*/
module.exports = {

  addUser: function (userName, pWord, owner, execute)  {
    //need to add association
    if(addNewUser(userName, pWord, owner)){
      execute("success?"+userName);
    }
    else {
      execute("fail");
    }
  },

  checkUser: function (userName, pWord, execute)  {
   
    var ps = db.prepare("select * from person where uname = ?");

    ps.get(userName, check);

    function check(err, row)  {
      try {
        console.log("exists: ", row.uname, row.pword);
        if(row.pword !== pWord) { //this works
          console.log("password fail");
          execute("Fail");
        }
        else{
          execute("success?"+userName);
        }
      }catch(err){
        execute("Fail");
      }
    }

  },
  
  addMedia: function (name, place, creator, owner)  {

    var ps = db.prepare("insert into media (name, place, creator, owner) values (?,?,?,?)");

    try{
      ps.run(name, place, creator, owner);
      ps.finalize();
    }
    catch(err){
      console.log("failed");
    }


  }


}
