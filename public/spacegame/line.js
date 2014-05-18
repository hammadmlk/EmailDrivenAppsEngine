//A module definition.
// line function
// I.x, I.y always expected
define(["globals"], function (GLOBAL) {
	"use strict"
	return function (I) {
    
		I.active = true;
    
    if (typeof I.speed==='undefined'){
      I.speed = 0;
    }    
    if (typeof I.width==='undefined'){
      I.width = 3;
    }
    if (typeof I.height==='undefined'){
      I.height = 15;
    }
    if (typeof I.color==='undefined'){
      I.color = "#990";
    }
    if (typeof I.angle==='undefined'){
      I.angle = 0;
    }
    
    
    I.xVelocity = Math.sin(I.angle)*I.speed;
		I.yVelocity = -Math.cos(I.angle)*I.speed;


		I.inBounds = function () {
			return I.x >= 0 && I.x <= GLOBAL.CANVAS_WIDTH &&
			I.y >= 0 && I.y <= GLOBAL.CANVAS_HEIGHT;
		};

		I.draw = function () {
      //var temp = GLOBAL.CANVAS.fillStyle;
			//GLOBAL.CANVAS.fillStyle = this.color;
			//GLOBAL.CANVAS.fillRect(this.x, this.y, this.width, this.height);
      //GLOBAL.CANVAS.fillStyle = temp;
      GLOBAL.CANVAS.save();
      GLOBAL.CANVAS.lineWidth=this.width;
      GLOBAL.CANVAS.strokeStyle=this.color;
      GLOBAL.CANVAS.beginPath();
      GLOBAL.CANVAS.moveTo(this.x, this.y);
      GLOBAL.CANVAS.lineTo(this.x+Math.sin(I.angle)*I.height, this.y-Math.cos(I.angle)*I.height);
      GLOBAL.CANVAS.stroke();
      GLOBAL.CANVAS.restore();
      
      
		};

		I.update = function () {
			I.x += I.xVelocity;
			I.y += I.yVelocity;

			I.active = I.active && I.inBounds();
		};

		return I;
	}
})
