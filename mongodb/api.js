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
          console.log('The number of updated documents was %d', numberAffected);
          console.log('The raw response from Mongo was ', raw);
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
exports.addUpdateEmailMsg = function(attrs, info, user) {
    
    /* attrs
      { date: Thu Apr 03 2014 15:08:06 GMT-0400 (Eastern Daylight Time),
        flags: [],
        uid: 40131,
        modseq: '5220586',
        'x-gm-labels': [ '\\Important', 'SelfStudy' ],
        'x-gm-msgid': '1464391000410759949',
        'x-gm-thrid': '1464391000410759949' }
    */
    
    console.log(attrs['x-gm-labels'], user)
    //console.log(user)
    
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