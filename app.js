var express = require('express');
var cookieParser = require('cookie-parser');
var routes = require('./routes/routes.js');
var mongoose = require('mongoose');
var proto = require('./prototypes.js')

var app = express();
app.use(cookieParser('=(*hj1!yat*vz=w6vlu1te9e&k4cp_3(w1$*!tf5ei$58&(sk5'));


// connect to Mongo when the app initializes
mongoose.connect('mongodb://localhost/testDB');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
    console.log('\n---DB Connected---');
});

app.get('/', routes.home);
app.get('/login', routes.login);
app.get('/oauth2callback', routes.oauth2callback);
app.get('/getEmails', routes.getEmails);

app.listen(5001);

console.log('* Started *');