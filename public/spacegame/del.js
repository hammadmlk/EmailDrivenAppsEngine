

function start() {

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


