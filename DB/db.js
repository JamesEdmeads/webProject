/*database functions
  all functions check incoming parameters are not empty
  all use prepared statements to avoid sql injection
*/

"use strict";


var pg = require('pg');

  
//functions used by the server
module.exports = {

  //checks whether a user exists and whether correct password
  //has been entered
  checkUser: function (port,userName, pWord, execute)  {

    if(userName === undefined || userName === null) {
      execute("isNull");
    }
    else{
      pg.connect(port, function(err, client, done) {
        client.query('select * from person where uname = me', function(err, result)     {
      done();
      if(err) { console.error(err); execute("fail"); }
      else {
        execute("success?"+userName+"?"+result. row);
          }
      });
    });

  }
}



