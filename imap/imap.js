var Imap = require('imap');
var inspect = require('util').inspect;
var fs = require('fs'), fileStream;
var MailParser = require("mailparser").MailParser;
var async = require('async')
var mongoDbApi = require('../mongoDB/api.js')
   
exports.getEmails = function (xoauth2_token, userEmail){

    var imap = new Imap({
      xoauth2: xoauth2_token,
      host: 'imap.gmail.com',
      port: 993,
      tls: true
    });
    
    function printBoxes(){
        imap.getBoxes(function(err, boxes){
            if(err) throw err;
            console.log(boxes);
            
            var log = fs.createWriteStream('labels-'+userEmail+'.txt', {'flags': 'w'});
            
            seen = []
            json = JSON.stringify(boxes, function(key, val) {
               if (typeof val == "object") {
                    if (seen.indexOf(val) >= 0)
                        return
                    seen.push(val)
                }
                return val
            })

            log.write(json);
            
        })
    }
    
    
    function openInbox(cb) {
      imap.openBox('INBOX', true, cb);
    }

    imap.once('ready', function() {
        //
        //printBoxes();
        //
        openInbox(function(err, box) {
          if (err) throw err;
          
          var date30DaysBack = new Date().subtractDays(1).toDateString();
          imap.search([ 'ALL', ['SINCE', date30DaysBack] ], function(err, results) {
            if (err) throw err;
            var f = imap.fetch(results, { bodies: ['HEADER.FIELDS (FROM TO CC BCC SUBJECT REFERENCES INREPLYTO DATE )'] });
            f.on('message', function(msg, seqno) {
              //console.log('Message #%d', seqno);
              var prefix = '(#' + seqno + ') ';
              
              var mailparser = new MailParser();
              
              msg.on('body', function(stream, info) {
                //console.log(prefix + 'Body');
                stream.pipe(mailparser);
                //stream.pipe(fs.createWriteStream('msg-' + seqno + '-body.txt'));
              });
              
              async.parallel([
                  function(callback){
                      msg.once('attributes', function(attrs) {
                        //console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
                        callback(null, attrs);
                      });
                  },
                  function(callback){
                      mailparser.on("end", function(mail_object){
                          //console.log(JSON.stringify(mail_object.subject));
                          mail_object.from = toArr(mail_object.from)
                          mail_object.to = toArr(mail_object.to);
                          mail_object.cc = toArr(mail_object.cc);
                          mail_object.bcc = toArr(mail_object.bcc);
                          
                          //var log = fs.createWriteStream('msg-' + seqno + '-body.txt', {'flags': 'w'});
                          //log.write(JSON.stringify(mail_object));
                          
                          callback(null, mail_object);
                          //
                          function toArr(a){ //from addr+name to only addr
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
                          //
                      });
                  }
              ],
              // optional callback
              function(err, results){
                  if (err) throw err;
                  var attrs = results[0];
                  var info = results[1]; //mail_object
                  mongoDbApi.addUpdateEmailMsg(attrs, info, userEmail );
              });
              
              msg.once('end', function() {
                //console.log(prefix + 'Finished');
              });
            });
            f.once('error', function(err) {
              console.log('Fetch error: ' + err);
            });
            f.once('end', function() {
              console.log('Done fetching all messages!');
              imap.end();
            });
          });
        });
      
      //
    });

    imap.once('error', function(err) {
      console.log(err);
    });

    imap.once('end', function() {
      console.log('Connection ended');
    });

    imap.connect();
    
}