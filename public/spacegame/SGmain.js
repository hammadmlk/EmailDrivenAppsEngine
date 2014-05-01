"use strict"

require(["globals", "utils", "player", "controller", "view"],
	function (GLOBAL, Utils, player, Controller, View) {
	//Ran after all requires (and their dependencies have loaded)


	///////

	document.getElementById("emailbtn").onclick = function () {
		var email = document.getElementById("email").value;
    console.log('email', email)
		var url = "/stats.json?id=getUser&email=" + email;
		Utils.getJson(url, function (err, json) {
			if (err) {
				alert(err);
			} else {

				if (json == '') {
					alert('email not in db')
					// click to fetch emails from db.
				} else {
					//email in db. Start game or update data.
					window.start(email)
				}
			}
		})
	};

	////////
	window.onclick = function (email) {
    //window.start(email);
  }
	window.start = function (email) {
		//return
    email = email || 'hhm38@cornell.edu'
		document.getElementById("infoPage").style.display = "none";
		window.onclick = 0;
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
