//A module definition.
// enemy function

define(["globals"], function (GLOBAL) {
	return function (I) {
		I = I || {};

		I.active = true;
		I.age = Math.floor(Math.random() * 128);

		I.color = "#A2B";

		I.x = GLOBAL.CANVAS_WIDTH / 4 + Math.random() * GLOBAL.CANVAS_WIDTH / 2;
		I.y = 0;
		I.xVelocity = 0
			I.yVelocity = 2;

		I.width = 32;
		I.height = 32;

		I.inBounds = function () {
			return I.x >= 0 && I.x <= GLOBAL.CANVAS_WIDTH &&
			I.y >= 0 && I.y <= GLOBAL.CANVAS_HEIGHT;
		};

		I.sprite = GLOBAL.SPRITE("enemy");

		I.draw = function () {
			this.sprite.draw(GLOBAL.CANVAS, this.x, this.y);
		};

		I.update = function () {
			I.x += I.xVelocity;
			I.y += I.yVelocity;

			I.xVelocity = 0; //3 * Math.sin(I.age * Math.PI / 64);

			I.age++; //why is it here?

			I.active = I.active && I.inBounds();
		};

		I.explode = function () {
			GLOBAL.SOUND.play("explosion");

			this.active = false;
			// Extra Credit: Add an explosion graphic
		};

		return I;
	};
})
