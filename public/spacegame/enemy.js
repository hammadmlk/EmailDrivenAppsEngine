//A module definition.
// enemy function

define(["globals"], function (GLOBAL) {
	return function (I) {
		I = I || {};
    
    if (typeof I.color==='undefined'){
      I.color = "grey";
    }
    if (typeof I.width==='undefined'){
      I.width = 75;
    }
    if (typeof I.height==='undefined'){
      I.height = 40;
    }
    if (typeof I.scale !== 'undefined'){
      I.width = I.width * I.scale;
      I.height = I.height * I.scale;
    }
    
    I.active = true;
		I.age = Math.floor(Math.random() * 128);


		I.x = GLOBAL.CANVAS_WIDTH / 4 + Math.random() * GLOBAL.CANVAS_WIDTH / 2;
		I.y = -I.height;
		I.xVelocity = 0;
	  I.yVelocity = 1;


		I.inBounds = function () {
			return I.x >= 0 && I.x <= GLOBAL.CANVAS_WIDTH &&
        I.y >= -I.height && I.y <= GLOBAL.CANVAS_HEIGHT+I.height;
		};

		I.sprite = GLOBAL.SPRITE("enemy_"+I.color);

		I.draw = function () {
      //this.sprite.fill(GLOBAL.CANVAS, this.x, this.y, this.width, this.height, '',this.color)
			this.sprite.draw(GLOBAL.CANVAS, this.x, this.y);
		};

		I.update = function () {
			I.x += I.xVelocity;
			I.y += I.yVelocity;

			I.xVelocity = /*0;*/ Math.random() * 0.5 * Math.sin(I.age * Math.PI / 64);

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
