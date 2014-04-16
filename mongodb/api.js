var UserInfo = require('./userInfoModel.js');
var EmailMsg = require('./emailMsgModel.js');


// Adds the user if it does not exist. Else update it. 
exports.addUpdateUser = function(info, tokens) {
        
    var userInfo = {
        id: info.id || '',
        email: info.email,
        name: info.name || '',
        given_name: info.given_name || '',
        family_name: info.family_name || '',
        link: info.link || '',
        picture: info.picture || '',
        gender: info.gender || '',
        hd: info.hd || '',
        verified_email: info.verified_email || false,
        refresh_token: tokens.refresh_token || '',
        access_token: tokens.access_token || ''
    };
    
    UserInfo.update(
        { email: info.email }, //conditions
        userInfo, //update val
        { safe: true, upsert: true  }, //options
        function (err, numberAffected, raw) { //callback
          if (err) return console.log('Error:api.js:addUser:update');
          //console.log('The number of updated documents was %d', numberAffected);
          //console.log('The raw response from Mongo was ', raw);
        }
    );       
}

//returns obj with all userInfo docs
exports.getAllUsers = function(callback){
    UserInfo.find(function (err, users) {
      if (err){
        console.error(err);
        callback('api.js:cantGetAllUsers')
      }
      else{
        callback(null, users)
      }
    });
}

// Adds email msg if it does not exist. Else update it. 
exports.addUpdateEmailMsg = function(attrs, info, user, boxname) {
    
    /* attrs
      { date: Thu Apr 03 2014 15:08:06 GMT-0400 (Eastern Daylight Time),
        flags: [],
        uid: 40131,
        modseq: '5220586',
        'x-gm-labels': [ '\\Important', 'SelfStudy' ],
        'x-gm-msgid': '1464391000410759949',
        'x-gm-thrid': '1464391000410759949' }
    */
    
    var isSpam = false;
    if(boxname ==="[Gmail]/Spam" || boxname ==="Spam" ||
       boxname ==="\\Junk"){
        isSpam = true
    }
    
    var emailMsg = {
        //id: Number,
        id: [attrs['x-gm-msgid'], user],
        user: user,
        from: info.from || [],
        to: info.to || [],
        cc: info.cc || [],
        bcc: info.bcc || [],
        subject: info.subject || '',
        date: info.date || '',
        labels: attrs['x-gm-labels'] || [],
        //flags: [String],
        spam: isSpam,
        msgid: attrs['x-gm-msgid'],
        thrid: attrs['x-gm-thrid']
    };
    
    EmailMsg.update(
        { id: [attrs['x-gm-msgid'], user] }, //conditions
        emailMsg, //update val
        { safe: true, upsert: true  }, //options
        function (err, numberAffected, raw) { //callback
          if (err) { console.log('Error:api.js:addUpdateEmailMsg:update');
            console.log(err); return
          }
          //console.log('The number of updated documents was %d', numberAffected);
          //console.log('The raw response from Mongo was ', raw);
        }
    );       
}

//returns obj with all emailMsg docs
exports.getAllEmailMsg = function(callback){
    EmailMsg.find(function (err, emailMsgs) {
      if (err){
        console.error(err);
        callback('api.js:cantGetAllEmailMsg')
      }
      else{
        callback(null, emailMsgs)
      }
    });
}

exports.removeAllEmailMsg = function (){
    try{
        EmailMsg.collection.remove(function(err){
            if(err) throw err;
        });
    }catch(err){
        console.log(err);
    }
}

// Return the user matching username
exports.getUser = function(email, callback){
  UserInfo
    .find({ email: email })
    //.where('name.last').equals('Ghost')
    //.where('age').gt(17).lt(66)
    //.where('likes').in(['vaporizing', 'talking'])
    //.limit(10)
    //.sort('-occupation')
    //.select('name email')
    .exec(callback);
  
}

// Return unique threads of a user
exports.getUniqueThreads = function(email, callback){
  console.log("\n\n\nGet UniqueThreads:\n\n") 
  
  var o = {};
  o.map = function () { emit(this.thrid, 1) }
  o.reduce = function (key, values) { return values.length }
  o.query = {user:email}
  
  EmailMsg.mapReduce(o, function (err, results) {
    callback(err, results)
  })
  
}


// Return response times of user
exports.getResponseTimes = function(email, callback){
  console.log("\n\n\nGet Average Response Time:\n\n") 
  //mongodb mapReduce doc at http://docs.mongodb.org/manual/core/map-reduce/
  
  
  var o = {};
  o.scope = {email:email};
  o.query = {user:email} //query filter   
  o.map = function () { //map func each msg
                emit(this.thrid, {val: [1], date: [this.date], 
                    msgid: [this.msgid], from: [this.from] }) 
            }  
  o.reduce = function (thrid, values) { //reduce func 
                var ans = {val: [], date: [], msgid: [], from:[] }
                values.forEach(function(entry){
                    for(var i=0; i<entry.val.length; i++){
                        ans.val.push(entry.val[i]);
                        ans.date.push(entry.date[i]);
                        ans.msgid.push(entry.msgid[i]);
                        ans.from.push(entry.from[i]);
                    }
                })
                return ans
            }  
  o.finalize = function (thrid, reducedValue) { 
                    //return reducedValue //for debug   
                    /*
                    Takes the reducedValue after mapReduce for a thread id (key) finishes.
                    Sorts the messages on date.
                    Computes response time of each response.
                    returns the array of response times.
                    Input:
                        { // reduced val object
                            "_id": "the thread id or key",
                            "value": { "val": [], "date": [], "msgid": [], "from": [[]] }
                        }
                    output: array of response time in seconds [int]
                    */
                    
                    
                    /* Before we sort we need to change object of 
                       arrays to array of objects
                             [{val: , date: , msgid, from}]
                       then sort it on date
                    */
                    var reducedValueSorted=[];
                    for(var i=0; i<reducedValue.val.length; i++){
                        reducedValueSorted.push({
                                  val: reducedValue.val[i], 
                                  date: reducedValue.date[i], 
                                  msgid: reducedValue.msgid[i], 
                                  from: reducedValue.from[i]
                                });
                    }
                    reducedValueSorted.sort(compareFunc);
                    
                    
                    //compute response time of each response
                    var resTime = responseTime(reducedValueSorted)
                    return resTime;
                    
                    //compare function
                    function compareFunc(a, b) {
                      if (a.date<b.date) return -1;
                      if (a.date>b.date) return 1;
                      return 0; // a must be equal to b
                    }
                    
                    /* Response time function  
                        @returns array of response time(in seconds) of each response
                        input:
                            Array of objects [{val, date, msgid, from[]},...]
                        Logic: For each response, if there is a incoming message 
                               before it, calc response time from prev msg.
                    */
                    function responseTime(val){
                        var resTime = []; //response times
                        
                        if(val.length<2)return resTime //0 or 1 email in thread
                        
                        var replyPending=0; //un-replied incoming email
                        if(email!==val[0].from[0]) {replyPending=1;} //1st was incoming
                        
                        //push time diff of each response
                        for(var i = 1; i<val.length; i++){
                            if (val[i].from[0] === email && replyPending ===1){
                                //time diff
                                resTime.push((val[i].date-val[i-1].date)/1000);
                                replyPending = 0;
                            }
                            if(email!==val[i].from[0]) {replyPending=1}
                        }
                        return resTime;
                    }
               }
  
  //result is an array of {_id:thrid, value:[resTimes, ...]}
  EmailMsg.mapReduce(o, function (err, results) {
    //callback(err, results); return results //for debug
    var times=[];
    
    //make one array with all times
    for(var i=0; i<results.length; i++ ){
        for(var j=0; j<results[i].value.length; j++){
            times.push(results[i].value[j]);
        }   
    }
    
    //var sum = times.reduce(function(previousValue, currentValue, index, array){
    //    return previousValue + currentValue;
    //});
    
    //results = times;//{t:sum/times.length}
    callback(err, times)
  })
  
}


/*
  EmailMsg.count({user:email}, function(err, results) {
    console.log('Count results %j', results);
    //callback(err, results)
  });
  console.log("\n\n\n\n\n\n")
*/





