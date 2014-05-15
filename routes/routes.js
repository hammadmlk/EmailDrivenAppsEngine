/* 
 * Specify how to handle each route request
 * example usage: 
        var express = require('express');
        var routes = require('./routes/index.js');
        var app = express();
        app.get('/', routes.home);   <<== this is where this
                                          file comes in play
        app.listen(5001);
*/

//Required modules
var request = require('request');
var async = require('async');
var oauth2 = require('../oauth2/oauth2.js');
var imap = require('../imap/imap.js');
var mongoDbApi = require('../mongodb/api.js');
var stats = require('./stats.js');
var constants = require('../constants.js');

/*
    @HomePage Route
*/
exports.home = function(req, res){
  res.send(200,'Home Page');
  
  //print all users in db
  mongoDbApi.getAllUsers(function(err, users){
    if (err){
      console.log('err:')
      return
    }
    for (var u in users) {
        console.log( users[u]);
        console.log('\n      --next user--')
    }
    console.log('\n\n----end----\n\n')
  });
  /*
  //print all emails in db
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
}


/*
    @Stats Route
*/
exports.stats = function(req, res){
  stats(req, res);
}

/*
    @Login Route
    Redirects to oauth permission url to get user concent.
    When consent is granted, user is redirected to the url given
    in REDIRECT_URI.
*/
exports.login = function (req, res) {
	var email = req.query.email || '';
	var role = req.query.role || '';
	var url;
	if (email)
		url = oauth2.genPermissionUrl(constants.REDIRECT_URI, email.toLowerCase());
	else
		url = oauth2.genPermissionUrl(constants.REDIRECT_URI);

	var cookieVal = {
		email : email,
		role : role
	};

	res.cookie('emailNrole', cookieVal, {
		signed : true,
		maxAge : 3600000
	})
	res.redirect(url);
}

/*
    @oAuth2 Callback Route
    This url is called when user successfully authenticates oauth access.
    The auth_code is returned as a GET parameter
    This function does the following: 
        1. get auth tokens (access + refresh) based on auth_code 
        2. get user_info from googleapis userinfo
        3. adds userInfo to db
        4. redirects to /getEmails with cookies set (email + access_token)
*/
exports.oauth2callback = function(req, res){
    var auth_code= req.query.code;
    var emailNrole = req.signedCookies.emailNrole || '';
    
    async.waterfall([
        // getAuthTokens
        function(callback){
            console.log('1...');
            oauth2.getAuthTokens(auth_code, constants.REDIRECT_URI, callback);
        },
        //handleTokens. Request user info
        function(tokens, callback){
            "use strict"
            console.log('2...');
            var accessToken = tokens.access_token;
            var refreshToken = tokens.refresh_token;
            
            var userInfoURL = 'https://www.googleapis.com/oauth2/v1/userinfo?access_token=' + accessToken;
            
            request(userInfoURL, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    //body is userInfo
                    callback(null, JSON.parse(body), tokens);
                }
                else{
                    callback('Error:routes.js:handleTokens:request.userinfo')
                }
            })
        }, // add userInfo to db
        function(userInfo, tokens, callback){
            console.log('3...');
            
            if (userInfo.email == emailNrole.email && emailNrole.role){
              console.log('EMAIL MATCH. ASSIGNING ROLE ---<<< ')
              userInfo.role = emailNrole.role
            }
            
            console.log(userInfo);
            
            mongoDbApi.addUpdateUser(userInfo, tokens)
            
            var cookieVal = {
                email: userInfo.email,
                access_token:tokens.access_token
                };
            
            callback(null, cookieVal );
        }
    ], //callback   
      function (err, cookieVal) {
        if (err !== null){
            //error
            var errMsg = 'Ops!!! Something broke.\n   ' 
            res.send(500, errMsg+err);
        }else{
            //success
            res.cookie('emailNToken', cookieVal, { signed: true, maxAge: 3600000})
            //res.send(cookieVal);
            res.redirect('/getEmails');
        }
    });  
    
}


/*
    @getEmails Route
    Makes xoauth2_token based on email and access_token in cookies
    Calls imap.getEmails(...)
    
    //todo: automatically refresh access_token if expired
*/
exports.getEmails = function(req, res){
  var emailNToken = req.signedCookies.emailNToken;
  
  if (typeof emailNToken === 'undefined')
    return res.send('No cookies set');
  
  var email = emailNToken.email;
  var access_token = emailNToken.access_token;
  
  var xoauth2_token = oauth2.buildXoauth2Token(email, access_token)
  
  imap.getEmails(xoauth2_token, email, function () {
  	mongoDbApi.setUserLoadingStatus(email, 1);  
  });
  
  var cookieVal = 1;
  res.cookie('loading', '1');
  res.cookie('email', email)
  
  res.redirect('/');
}

/*
    Remove all emails
*/
exports.removeEmails = function(req, res){
    mongoDbApi.removeAllEmailMsg();
    console.log('removeEmails');
    res.send('remove func called');
}