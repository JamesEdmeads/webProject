"use strict";

var fs = require("fs");
var file = "DB/data.db"; 
var exists = fs.existsSync(file); 
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(file);

function addNewUser(userName, pWord)  {
  console.log("adding new user ........" + userName);
  var ps = db.prepare("insert into person (uname, pword) values(?, ?)");
  try {
    ps.run(userName, pWord);
    ps.finalize();
    return true;
  }catch(err) {
    return false;
  }
  
}


module.exports = {

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
          execute("success");
        }
      }catch(err){
        addNewUser(userName, pWord);
        execute("newUser");
      }
    }

  }


}
