//A module definition.
// bullet function

define(["globals"], function (GLOBAL) {
	"use strict"
	return function (I) {
		I.active = true;

		I.xVelocity = 0;
		I.yVelocity = -I.speed;
		I.width = 3;
		I.height = 15;
		I.color = "#990";

		I.inBounds = function () {
			return I.x >= 0 && I.x <= GLOBAL.CANVAS_WIDTH &&
			I.y >= 0 && I.y <= GLOBAL.CANVAS_HEIGHT;
		};

		I.draw = function () {
      var temp = GLOBAL.CANVAS.fillStyle;
			GLOBAL.CANVAS.fillStyle = this.color;
			GLOBAL.CANVAS.fillRect(this.x, this.y, this.width, this.height);
      GLOBAL.CANVAS.fillStyle = temp;
		};

		I.update = function () {
			I.x += I.xVelocity;
			I.y += I.yVelocity;

			I.active = I.active && I.inBounds();
		};

		I.explode = function () {
			this.active = false;
			// Extra Credit: Add an explosion graphic
		};

		return I;
	}
})
