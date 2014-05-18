//"use strict"

require(["globals", "utils", "player", "controller", "view"],
	function (GLOBAL, Utils, player, Controller, View) {
	//Ran after all requires (and their dependencies have loaded)

	var email = Utils.getCookie('email');
  email = email.replace("%40", "@");
  console.log(email)
  
	if (!Utils.validateEmail(email)) {
		//alert(email + ' - invalid cookies. Will redirect to home.');
		window.location.assign('/');
		return 0;
	}

	start(email);

	function start(email) {
		//return
		//email = email || 'hhm38@cornell.edu'
		//document.getElementById("infoPage").style.display = "none";
		document.getElementById("gamePage").style.display = "";
		Controller.getGameData(email, true, gameDataCB);
		Controller.getGameData(email, false, gameDataCB);
		Controller.getGameData(email, 'resTime', resTimeCB);

		function startGame() {

			var p = player;
			var g = GLOBAL;
			// game loop
			setInterval(function () {
				Controller.update(p);
				View.draw(p);
			}, 1000 / g.FPS);

		}

		//gamedata callback
		function resTimeCB(err, incoming, resJson) {
			if (err) {
				alert(err);
				return;
			}
			GLOBAL.LOADING--;

			var sum = resJson.reduce(function (a, b) {
					return a + b
				});
			var avg = sum / resJson.length;
			GLOBAL.RESTIME = avg;

			console.log(GLOBAL.RESTIME)
			if (GLOBAL.LOADING === 0) {
				startGame();
			}
		}

		//gamedata callback
		function gameDataCB(err, incoming, resJson) {
			if (err) {
				alert(err);
				return;
			}
			GLOBAL.LOADING--;
			if (incoming) {
				GLOBAL.INCOMINGEMAILDATA = resJson
			} else {
				GLOBAL.OUTGOINGEMAILDATA = resJson
			}
			if (GLOBAL.LOADING === 0) {
				startGame();
			}
		}

	};
});