/*
    Gets emails from imap server and stores them in db.    
*/

var Imap = require('imap');
var inspect = require('util').inspect;
var fs = require('fs'), fileStream;
var MailParser = require("mailparser").MailParser;
var async = require('async')
var mongoDbApi = require('../mongodb/api.js')

var GLOBALS={};
GLOBALS.daysOfEmail = 29;   // last x days of email to fetch

/*
  Get all emails and put them in db. When complete call main_callback   
*/
exports.getEmails = function (xoauth2_token, userEmail, main_callback){

    var imap = new Imap({
      xoauth2: xoauth2_token,
      host: 'imap.gmail.com',
      port: 993,
      tls: true
    });
    
    imap.once('error', function(err) {
      console.log(err, userEmail);
    });

    imap.once('end', function() {
      console.log('Connection ended:'+userEmail);
      main_callback(userEmail)
    });
    
    imap.once('ready', function() {
        console.log('Connection Ready:'+userEmail);
        //get boxes and call fetch mails for each box
        async.waterfall([
            //get all boxes, make array, pass array to next func
            function(callback){
                imap.getBoxes(function(err, boxes){
                    if(err) throw err;
                    var boxesArr = makeBoxesArray([], "", boxes);
                    callback(null, boxesArr);
                })
            },
            //call openInbox for each box
            function(boxesArr, callback){
                async.mapSeries(boxesArr, openInbox, function(err, results){
                    // results is now an array of result for each box
                    callback(null, results);
                });
            }
        ], function (err, result) {
           // result sent by last callback
           console.log(result)
           imap.end();
        });
    });

    //called by async.map with box name and cb(err, transformed)
    function openInbox(box, cb) {
        imap.openBox(box, true, openInboxCallback);
        
        function openInboxCallback(err, box){
            openInboxCallbackCode(err, box, imap, userEmail, cb);
        }
    }

    imap.connect();
    
}

/*
    Gets emails from the box of the userEmail with imap connection.
    Calls cb when done
    Adds emails to database
*/
function openInboxCallbackCode(err, box, imap, userEmail, cb) {
  if (err) {
    console.log("error when calling openInbox: "+ err);
    return
  }
  var dateXDaysBack = new Date().subtractDays(GLOBALS.daysOfEmail).toDateString();
  imap.search([ 'ALL', ['SINCE', dateXDaysBack] ], function(err, results) {
    if (err) {
      console.log("error when calling imap.search: "+ err);
      return
    }
    try{
        var f = imap.fetch(results, { bodies: ['HEADER.FIELDS (FROM TO CC BCC SUBJECT REFERENCES INREPLYTO DATE )'] });
    
        f.once('error', function(err) {
          throw new Error('Fetch error: ' + err);          
        });
        f.once('end', function() {
          //console.log('Done fetching all messages!', box.name);
          cb(null, 'done:'+box.name+":"+userEmail);
        });
        f.on('message', function(msg, seqno) {
          try{
              var mailparser = new MailParser();
              mailparser.on('error', function(err){
                throw new Error('mailparse error: ' + err);
              })
              msg.on('body', function(stream, info) {
                stream.pipe(mailparser);
              });
              // Get attrs and mail_object
              async.parallel([
                  function(callback){
                      msg.once('attributes', function(attrs) {
                        callback(null, attrs);
                      });
                  },
                  function(callback){
                      mailparser.on("end", function(mail_object){
                          mail_object.from = makeFieldsArray(mail_object.from)
                          mail_object.to = makeFieldsArray(mail_object.to);
                          mail_object.cc = makeFieldsArray(mail_object.cc);
                          mail_object.bcc = makeFieldsArray(mail_object.bcc);
                          callback(null, mail_object);
                      });
                  }
              ],
              // results has attrs and mail_object
              function(err, results){
                  if (err) throw err;
                  var attrs = results[0];
                  var info = results[1]; //mail_object
                  mongoDbApi.addUpdateEmailMsg(attrs, info, userEmail, box.name );
              });
              
              msg.once('end', function() {
                //console.log(prefix + 'Finished');
              });
          }catch(err){
            console.log("error in f.on message: ",err);
          }
        });
    }catch(err){
        //console.log("error in fetch: ", err , box.name);
        cb(null, 'error:'+box.name+":"+userEmail);
    }        
  });
};

/*
    Takes object array made my mailparser 
    and returns a simple array of email addr string
    input:
        [{addr: "h@h.cc" , name: "name here"}, {addr: "h2@h.cc" , name: "name"}]
    output:
        ["h@h.cc", "h2@h.cc"]
*/
function makeFieldsArray(a){ 
    if (a instanceof Array){
      var newa = [];
      a.forEach(function(entry) {
        if ('address' in entry){
           newa.push(entry.address)
        }
      });
      return newa;
    }
}

/* 
    Takes the boxes object made by imap.getBoxes(...) and makes an
    array of folder names. 
*/
function makeBoxesArray(arr, delimiter, boxes){ 
    if (boxes === null || typeof boxes === 'undefined') return arr;
    for(var key in boxes) {
       //(key, boxes[key])
       if(boxes[key].attribs.contains('\\Noselect')){
            var new_delimiter = delimiter+key+boxes[key].delimiter;
            arr = makeBoxesArray(arr, new_delimiter, boxes[key].children);
       }
       else{
            arr.push(delimiter+key);
       }
    }   
    return arr;0
}
