
//A module definition requires globals
//use:
define(["globals", "./bullet"], function (GLOBAL, Bullet) {
	"use strict"
	return {
		color : "#00A",
		x : GLOBAL.CANVAS_WIDTH / 2 - 10,
		y : GLOBAL.CANVAS_HEIGHT - 30,
		width : 32,
		height : 30,
		drawx : function () {
			GLOBAL.CANVAS.fillStyle = this.color;
			GLOBAL.CANVAS.fillRect(this.x, this.y, this.width, this.height);
		},
		shoot : function () {
			if (1 == 1 || GLOBAL.emailsPerHourSent[GLOBAL.hourOfDay] > 0) { // bullet available
				//GLOBAL.emailsPerHourSent[GLOBAL.hourOfDay]--;

				GLOBAL.SOUND.play("shoot");

				var bulletPosition = this.midpoint();

				GLOBAL.PLAYERBULLETS.push(Bullet({
						speed : 10,
						x : bulletPosition.x,
						y : bulletPosition.y
					}));
			} else { // no bullet
				GLOBAL.SOUND.play("cocking") //TODO: change to nobullet sound
			}
		},
		midpoint : function () {
			return {
				x : this.x + this.width / 2,
				y : this.y + this.height / 2
			}
		},
		explode : function () {
			this.active = false;
			// Extra Credit: Add an explosion graphic and then end the game
		},
		sprite : GLOBAL.SPRITE("player"), //todo:
		draw : function () {
			this.sprite.draw(GLOBAL.CANVAS, this.x, this.y);
		}
	};
});
