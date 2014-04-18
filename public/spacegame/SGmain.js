"use strict"

require(["globals", "utils", "player", "controller", "view"],
	function (GLOBAL, utils, player, Controller, View) {
	//Ran after all requires (and their dependencies have loaded)

	window.onclick = function () {
		window.onclick = 0;
		Controller.getGameData('hammadmlk@gmail.com', true, gameDataCB);
		Controller.getGameData('hammadmlk@gmail.com', false, gameDataCB);

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
