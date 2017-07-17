"use strict";

//catch insert failure where not null or pk is not unique

var fs = require("fs");
var file = "DB/data.db"; 
var exists = fs.existsSync(file); 
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(file);

  function getMediaAssociation(visual, execute)  {
    if(visual === undefined || visual === null) {
      execute("isNull");
    }
    else{
      var ps = db.prepare("select audio from mediaAssociate where "
      +"visual = ?");
      
      try{
        ps.all(visual, check);
        function check(err, row) {
          if(row === undefined){
            execute("noAudio");
          }
          else{
            var result;
            for(var i = 0; i < row.length; i++) {
              results = results + "?" + row.audio;
            }
            execute("success"+results);
          }
        }
      }catch(err){
        execute("fail");
      }
    }
  }

module.exports = {

  addUser: function(uName, pWord, owner, execute)  {

    if(uName === undefined || uName === null) {
      execute("isNull");
    }
    else{
   
      var ps = db.prepare("select * from person where uname = ?");

      try{
        ps.get(uName, check);
        ps.finalize();
        function check(err, row) {
          if(row != undefined) {
            execute("alreadyExists");
          }
          else{
            var ps1 = db.prepare("insert into person (uname, pword, owner)"
            +" values (?, ?, ?)");
            try {
              ps1.run(uName, pWord, owner); 
              ps1.finalize();
            }catch(err){
              execute("fail");
            }
            execute("success?"+uName+"?"+owner);
          }
        }
      }catch(err){
        execute("fail");
      }
    }

  },

  checkUser: function (userName, pWord, execute)  {

    if(userName === undefined || userName === null) {
      execute("isNull");
    }
    else{
     
      var ps = db.prepare("select * from person where uname = ?");

      ps.get(userName, check);

      function check(err, row)  {
        try {
          if(row.pword !== pWord) { 
            execute("wrong");
          }
          else{
            execute("success?"+userName+"?"+row.owner);
          }
        }catch(err){
          execute("fail");
        }
      }
    }

  },

  associate: function(userName, owner, execute) {
    if(owner === undefined || owner === null) {
      execute("isNull");
    }
    else{

      var ps0 = db.prepare("select * from person where uname = ?");
      try {
        ps0.get(owner, check0);
        function check0(err, row) {
          if(row === undefined || row.uname !== owner) {
            execute("wrongUName");
          }
          else if(row.owner === false || row.owner === 0) {
            execute("notOwner");
          }
          else {
            var ps1 = db.prepare("select * from personAssociate where "
            +"owner = ? and associate = ?");
            try {
              ps1.get(owner, userName, check1);
              function check1(err,row) {
                if(row !== undefined) {
                  execute("alreadyExists");;
                }
                else {
                  var ps2 = db.prepare("insert into personAssociate "
                  +"(owner, associate) values (?,?)");
                  try {
                    ps2.run(owner, userName);
                    ps2.finalize();
                    execute("success");
                  }catch(err){
                    execute("fail");
                  }
                }
              }        
            }catch(err){
              execute("fail");
            } 
          }
        }
      }catch(err) {
        execute("fail");
      }
    }
  },

  addMedia: function(name, place, creator, owner, execute)  {
    console.log(name, place, creator, owner);
    if(name === undefined || name === null) {
      console.log("^^^^^^^^^^^^^^^^^^^^^failed");
      execute("isNull");
    }
    else{
      console.log("!!!!!!!!!!!!!!!!!!!!!!!in media: ", creator, owner);
      var ps0 = db.prepare("select * from media where name = ?");
      try {
        ps0.get(name, check);
        function check(err, row) {
          if(row !== undefined || row === null)  {
            console.log("alreadyExists");
            execute();
          }
          else{
            var ps1 = db.prepare("insert into media "
            +"(name, place, creator, owner) values (?,?,?,?)");
            try{
              ps1.run(name, place, creator, owner);
              ps1.finalize();
              console.log("success");
              execute();
            }catch(err){
              console.log("fail");
              execute();
            }
          }
        }
      }catch(err){
        console.log("fail");
        execute();
      }
    }
  },


  addMediaAssociation: function(visual, audio, execute)  {

    if(visual === undefined || visual === null) {
      execute("isNull");
    }
    else{
    
      var ps0 = db.prepare("select count(*) from media as mediacount "+
      "where name = ? or ?");

      try{
        ps0.get(visual, audio, check);
        function check(err, row) {
          if(row.mediacount !== 2) {
            execute("namesWrong");
          }
          else {
            var ps1 = db.prepare("insert into mediaAssociation "
            +"(visual, audio) values (?,?)");
            try{
              ps1.run(visual, audio);
              ps1.finalize();
              execute("success");
            }catch(err){
              execute("fail");
            }
          }
        }
      }catch(err){
        execute("mediaWrong");
      }
    }
  },

  getMedia: function(name, execute)  {
    if(name === undefined || name === null) {
      execute("isNull");
    }
    else{

      var ps = db.prepare("select name, place, sName, sPlace from media join ("+
      "select name as sName, place as sPlace, visual as sVisual from "+
      "(select * from media inner join mediaAssociate on name = audio)) "+
      "where name = sVisual and owner = ? "+
      "union all "+
      "select name, place, null as sName , null as sPlace from media where owner = ? and name "+
      " like ('%.jpg') order by name asc");

      try {
        ps.all(name, name, check);
        function check(err, rows) {
          if(rows === undefined || rows === null) {
            execute("notExist");
          } else {

            var result = "";
            rows.forEach(function(row) {

              result = result +"?"+row.name+"?"+row.place+"?"+row.sName+"?"+row.sPlace;
            });
            execute("success"+result);
          }
        }      
      }catch(err){
        execute("fail");
      }
    }
  },

  getPersonAssociation: function(name, execute)  {

    if(name === undefined || name === null) {
      console.log("is Null");
      execute("isNull");
    }
    else{

      var ps = db.prepare("select owner from personAssociate where "
      +"associate = ?"); 
    
      try{
        ps.all(name, check);
        function check(err, rows) {
          if(rows === undefined || rows === null) {
            console.log("no associate");
            execute("noAssociate");
          } else {
            var result = "";
            rows.forEach(function(row) {
              result = result + "?"+row.owner;
              console.log("HERE  :",result);
            });
            execute("success?"+result);
          }
        }
      }catch(err){
        console.log("err in row");
        execute("fail");
      }
    }
  },
    
  getMediaAssociation: function(visual, execute)  {
    if(visual === undefined || visual === null) {
      execute("isNull");
    }
    else{
      var ps = db.prepare("select audio from mediaAssociate where "
      +"visual = ?");
      
      try{
        ps.all(visual, check);
        function check(err, row) {
          if(row === undefined){
            execute("noAudio");
          }
          else{
            var result;
            for(var i = 0; i < row.length; i++) {
              results = results + "?" + row.audio;
            }
            execute("success"+results);
          }
        }
      }catch(err){
        execute("fail");
      }
    }
  }

}


