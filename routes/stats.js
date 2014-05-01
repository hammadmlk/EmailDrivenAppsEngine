/*
Code for the query page. Called by routes.js
@requires: mongoDbApi

 */
var mongoDbApi = require('../mongodb/api.js');
module.exports = function (req, res) {

	var id = req.query.id;

	if (!id) {
		res.send(500, 'error:stats.js:no id provided')
		return
	}

	if (id == 'getUser') {
		//print user with email
		var email = req.query.email;
		if (!email) {
			res.send(500, 'error:stats.js:getUser:no email provided')
			return
		}
		mongoDbApi.getUser(email, function (err, user) {
			if (err)
				res.send(500, 'error:stats.js:getUser:01');
      res.send(200, JSON.stringify(user, null, "  "));
		})
		return;
	}

	/*
	// print all emails in db
	mongoDbApi.getAllEmailMsg(function (err, emailMsgs) {
	console.log(emailMsgs.length);
	emailMsgs.forEach(function (e) {
	if (e.subject == "[OAE] Videos" || 1 == 1) {
	console.log('> date: ', e.date);
	console.log('> subj: ', e.subject);
	console.log('> to: ', e.to);
	console.log('> cc: ', e.cc);
	console.log('> from: ', e.from);
	console.log('');
	}
	});
	})
	 */

	/*
	// print all emails count
	mongoDbApi.getAllEmailMsg(function (err, emailMsgs) {
	if (err)
	res.send(500, '<pre>' + 'error:stats.js:02' + '</pre > ');
	res.send(200, ' < pre > ' + JSON.stringify(emailMsgs.length, null, "  ") + ' <  / pre > ');
	})
	 */
	/*
	// print unique threads for user
	mongoDbApi.getUniqueThreads(' hammadmlk @ gmail.com ', function (err, results) {
	if (err)
	res.send(500, ' < pre > ' + ' error : stats.js : 03 ' + ' <  / pre > ');
	res.send(200, ' < pre > ' + JSON.stringify(results, null, "  ") + ' <  / pre > ');
	})
	 */

	if (id == "getAvgResponseTime") {
		// print avgResponseTimefor user
    var email = req.query.email;
		if (!email) {
			res.send(500, 'error:stats.js:getAvgResponseTime:no email provided')
			return
		}
    
		mongoDbApi.getResponseTimes(email, function (err, results) {
			if (err)
				res.send(500,' error : stats.js : 04 ');
			res.send(200, JSON.stringify(results, null, "  "));
		})
	}
	if (id == "getSpaceGameData") {
		email = req.query.email;
		incoming = req.query.incoming == true ? true : false;
		//console.log(email, incoming);

		// print incoming emails struc
		mongoDbApi.getEmailsGroupedByHour(email, incoming, function (err, results) {
			if (err) {
				res.writeHead(500, {
					"Content-Type" : "application/json"
				});
				res.write(JSON.stringify(' error : stats.js : 05 : ' + err));
				res.end();
				return
			}
			res.writeHead(200, {
				"Content-Type" : "application/json"
			});
			res.write(JSON.stringify(results, null, "  "));
			res.end();

		})
		return
	}
	/*
	//var responseData = {status:' sucess '};
	//res.writeHead(200, {"Content-Type": "application/json"});
	//res.write(JSON.stringify(responseData));
	//res.end();
	 */

}
