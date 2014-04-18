/*SpaceGame Main */

function setup(callback) {}

var GLOBAL = {};
GLOBAL.incoming = []
GLOBAL.outgoing = []

GLOBAL.loading = false; ;
GLOBAL.loadingJson = 2;

function start() {
	return

	var playerBullets = [];
	enemies = [];

	// game loop
	setInterval(function () {
		update();
		draw();
	}, 1000 / GLOBAL.FPS);

	//newEnemyInterval = setInterval(pushEnemy, GLOBAL.hourInGameTime/GLOBAL.emailsPerHourRecieved[GLOBAL.hourOfDay]);
	function pushEnemy() {
		enemies.push(Enemy());
		console.log("newEmemy" + GLOBAL.enemyNumber++);
	}

	//change hour
	var newEnemyInterval;
	/*(function() {
	GLOBAL.hourOfDay = ++GLOBAL.hourOfDay%24;
	console.log("Hour: "+ GLOBAL.hourOfDay);
	clearInterval(newEnemyInterval);
	GLOBAL.enemyNumber = 0;
	//make new enemy
	newEnemyInterval = setInterval(pushEnemy, GLOBAL.hourInGameTime/GLOBAL.emailsPerHourRecieved[GLOBAL.hourOfDay]);
	}, GLOBAL.hourInGameTime);*/



}

getEmails('hhm38@cornell.edu', 1); //incoming
getEmails('hhm38@cornell.edu', 0);

//
function getEmails(email, incoming) {
	xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function () {
		if (xmlhttp.readyState == 0) {
			GLOBAL.loading = true;
		}
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			//success
			GLOBAL.loading = false;
			GLOBAL.loadingJson--;

			var ans = xmlhttp.responseText;
			ans = JSON.parse(ans);

			if (incoming) {
				GLOBAL.incoming = ans;
			} else {
				GLOBAL.outgoing = ans;
			}

			if (GLOBAL.loadingJson == 0) {
				start();
			}
		} else if (xmlhttp.readyState == 4) {
			//fail
			alert('Ops!! Problem contacting the server. Try again maybe? -- Refresh Page')
			GLOBAL.loading = false;
		}
	}
	var url = window.location.href;
	url = url.split("/");
	url = url[0] + "//" + url[2];
	xmlhttp.open("GET", url + '/stats.json?email=' + email + '&incoming=' + incoming, false);
	xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xmlhttp.send();
};
