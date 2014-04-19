define(["globals", "enemy"], function (GLOBAL, Enemy) {
	return {
		draw : function (player) {
			"use strict"
			GLOBAL.CANVAS.clearRect(0, 0, GLOBAL.CANVAS_WIDTH, GLOBAL.CANVAS_HEIGHT);

			player.draw();
			GLOBAL.PLAYERBULLETS.forEach(function (bullet) {
				bullet.draw();
			});
			GLOBAL.ENEMIES.forEach(function (enemy) {
				enemy.draw();
			});

			GLOBAL.CANVAS.font = "30px Arial";
			GLOBAL.CANVAS.fillText("This HOUR: " + GLOBAL.GAMEHOUR, 10, 50);
			/*GLOBAL.CANVAS.font = "20px Arial";
			GLOBAL.CANVAS.fillText("   Bullets Remaining: " + GLOBAL.emailsPerHourSent, 10, 75);
			GLOBAL.CANVAS.font = "13px Arial";
			GLOBAL.CANVAS.fillText("      Enemy Number: " + GLOBAL.enemyNumber, GLOBAL.CANVAS_WIDTH - 150, 50);
			 */
		}
	}
})
