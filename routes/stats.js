/*
 Code for the stats page. Called by routes.js
 @requires: mongoDbApi
 
*/

module.exports = function (req, res) {
var mongoDbApi = require('../mongoDB/api.js');

  /* //print user with email  
  mongoDbApi.getUser('hhm38@cornell.edu', function(err, user){
    if (err) res.send(500,'<pre>'+'error:stats.js:01'+'</pre>');
    res.send(200,'<pre>'+JSON.stringify(user,null, "  ")+'</pre>');
  })
  */
  
  /*//print all emails in db
  mongoDbApi.getAllEmailMsg(function(err, emailMsgs){
    console.log(emailMsgs.length);
    emailMsgs.forEach(function(e){
        if (e.subject=="[OAE] Videos" || 1==1){    
            console.log('> date: ', e.date );
            console.log('> subj: ', e.subject );
            console.log('> to: ', e.to );
            console.log('> cc: ', e.cc );
            console.log('> from: ', e.from );
            console.log('');
        }
    });
  })
  */
  
  /*// print all emails count
  mongoDbApi.getAllEmailMsg(function(err, emailMsgs){
    if (err) res.send(500,'<pre>'+'error:stats.js:02'+'</pre>');
    res.send(200,'<pre>'+JSON.stringify(emailMsgs.length,null, "  ")+'</pre>');
  })*/
  
  /*// print unique threads for user
  mongoDbApi.getUniqueThreads('hammadmlk@gmail.com', function(err, results){
    if (err) res.send(500,'<pre>'+'error:stats.js:03'+'</pre>');
    res.send(200,'<pre>'+JSON.stringify(results,null, "  ")+'</pre>');
  })*/
  
  /*// print avgResponseTimefor user
  mongoDbApi.getResponseTimes('hhm38@cornell.edu', function(err, results){
    if (err) res.send(500,'<pre>'+'error:stats.js:04'+'</pre>');
    res.send(200,'<pre>'+JSON.stringify(results,null, "  ")+'</pre>');
  })*/
  
  email= req.query.email;
  incoming= req.query.incoming==true ? true:false;
  console.log(email,incoming);
  
  // print incoming emails struc
  mongoDbApi.getEmailsGroupedByHour(email, incoming, function(err, results){
    if (err) {
      res.writeHead(500, {"Content-Type": "application/json"});
      res.write(JSON.stringify('error:stats.js:05:'+err));
      res.end();
      return
    }
    res.writeHead(200, {"Content-Type": "application/json"});
    res.write(JSON.stringify(results,null, "  "));
    res.end();
    
  })
  
  /*
  //var responseData = {status:'sucess'};
  //res.writeHead(200, {"Content-Type": "application/json"});
  //res.write(JSON.stringify(responseData));
  //res.end();
  */
  
}