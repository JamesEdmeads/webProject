"use strict";

var fs = require("fs");
var file = "DB/data.db"; 
var exists = fs.existsSync(file); 
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(file);

module.exports = {

  addUser: function(uName, pWord, owner, execute)  {
   
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

  },

  checkUser: function (userName, pWord, execute)  {
   
    var ps = db.prepare("select * from person where uname = ?");

    ps.get(userName, check);

    function check(err, row)  {
      try {
        if(row.pword !== pWord) { 
          execute("wrong");
        }
        else{
          execute("success?"+userName);
        }
      }catch(err){
        execute("fail");
      }
    }

  },

  associate: function(userName, owner, execute) {

    var ps0 = db.prepare("select * from person where uname = ?");
    try {
      ps0.get(owner, check0);
      function check0(err, row) {
        if(row === undefined || row.uname !== owner) {
          execute("wrongUName");
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
  },

  addMedia: function(name, place, creator, owner, execute)  {
  
    var ps0 = db.prepare("select * from media where name = ?");
    
    try {
      ps0.get(name, check);
      function check(err, row) {
        if(row !== undefined)  {
          execute("alreadyExists");
        }
        else{
          var ps1 = db.prepare("insert into media "
          +"(name, place, creator, owner) values (?,?,?,?)");
          try{
            ps1.run(name, place, creator, owner);
            ps1.finalize();
            execute("success");
          }catch(err){
            execute("fail");
          }
        }
      }
    }catch(err){
      execute("fail");
    }
  },

  addMediaAssociation: function(visual, audio, execute)  {
    
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
  },

  getMedia: function(name, execute)  {

    var ps = db.prepare("select * from media where name = ?");

    try {
      ps.get(name, check);
      function check(err, row) {
        if(row === undefined) {
          execute("notExist");
        }
        else {
          execute("success?"+name+"?"+place);
        }
      }      
    }catch(err){
      execute("fail");
    }
  },

  getPersonAssociation: function(name, execute)  {

    var ps = db.prepare("select owner from personAssociate where "
    +"associate = ?");
  
    try{
      ps.get(name, check);
      function check(err, row) {
        if(row === undefined) {
          execute("noAssociate");
        }
        else{
          execute("success?"+row.owner);
        }
      }
    }catch(err){
      execute("fail");
    }
  },
    
  getMediaAssociation: function(visual, execute)  {
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


