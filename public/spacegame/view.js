define(["globals", "./gameInfoDisplay"], function (GLOBAL, GameInfoDisplay) {
	return {
		draw : function (player) {
			"use strict"
			GLOBAL.CANVAS.clearRect(0, 0, GLOBAL.CANVAS_WIDTH, GLOBAL.CANVAS_HEIGHT);
      
      //player
			player.draw();
			
      //bullets
      GLOBAL.PLAYERBULLETS.forEach(function (bullet) {
				bullet.draw();
			});
      
      //enemies
			GLOBAL.ENEMIES.forEach(function (enemy) {
				enemy.draw();
			});
      
      //bg lines
      GLOBAL.BACKGROUNDLINES.forEach(function (line) {
				line.draw();
			});
      
      //game info display
      GameInfoDisplay.draw();
      
		}
	}
})
