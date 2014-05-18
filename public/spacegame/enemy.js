//A module definition.
// enemy function

define(["globals"], function (GLOBAL) {
	return function (I) {
		I = I || {};
    
    if (typeof I.color==='undefined'){
      I.color = "grey";
    }
    if (typeof I.width==='undefined'){
      I.width = 47;
    }
    if (typeof I.height==='undefined'){
      I.height = 25;
    }
    if (typeof I.scale !== 'undefined'){
      I.width = I.width * I.scale;
      I.height = I.height * I.scale;
    }
    
    I.active = true;
		I.age = Math.floor(Math.random() * 128);
    
    //== Set x, y velocity     
    if(GLOBAL.GAMEMODE=='leftrightonly'){
      I.x = GLOBAL.CANVAS_WIDTH / 4 + Math.random() * GLOBAL.CANVAS_WIDTH / 2;
      I.y = -I.height;
      I.xVelocity = 0;
      I.yVelocity = 1;
      I.angle = 0;
    }else{
      //start pos of enemy
      I.x = Math.random() * GLOBAL.CANVAS_WIDTH ;
      I.y = Math.random() * GLOBAL.CANVAS_HEIGHT;
      if (Math.random() < 0.5) {
        if (Math.random() < 0.5) { I.x = -I.width } else {I.x = GLOBAL.CANVAS_WIDTH+I.width;}
      } else { 
        if (Math.random() < 0.5) {	I.y = -I.height } else { I.y = GLOBAL.CANVAS_HEIGHT+I.height; }
      }
      
      //angle
      var cy = GLOBAL.CANVAS_HEIGHT/2;
      var cx = GLOBAL.CANVAS_WIDTH/2;
      I.angle = Math.PI/2 + Math.atan2(cy - I.y, cx - I.x);// - atan2(GLOBAL.CANVAS_HEIGHT/2, GLOBAL.CANVAS_WIDTH/2);
      I.angle = I.angle + (Math.random()*Math.PI/2-Math.PI/4);
      
      //velocity based on angle
      I.xVelocity = Math.sin(I.angle);
      I.yVelocity = -Math.cos(I.angle);
    }
    //======

		I.inBounds = function () {
			return I.x >= -I.width && I.x <= GLOBAL.CANVAS_WIDTH+I.width &&
        I.y >= -I.height && I.y <= GLOBAL.CANVAS_HEIGHT+I.height;
		};

		I.sprite = GLOBAL.SPRITE("enemy_"+I.color);

		I.draw = function () {
      //this.sprite.fill(GLOBAL.CANVAS, this.x, this.y, this.width, this.height, '',this.color)
			//this.sprite.fill(GLOBAL.CANVAS, this.x, this.y, this.width, this.height, '');
      //this.sprite.draw(GLOBAL.CANVAS, this.x, this.y);
      this.sprite.draw(GLOBAL.CANVAS, this.x, this.y, this.width, this.height, this.angle);
    
		};

		I.update = function () {
			I.x += I.xVelocity;
			I.y += I.yVelocity;
      
      if(GLOBAL.GAMEMODE=='leftrightonly'){
        I.xVelocity = /*0;*/ Math.random() * 0.5 * Math.sin(I.age * Math.PI / 64);
      }
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
