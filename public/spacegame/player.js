
//A module definition requires globals
//use:
define(["globals", "./bullet"], function (GLOBAL, Bullet) {
	"use strict"
  
  var width = 70;
  var height= 63;
  
  
	return {
		color : "#00A",
		width : width,
		height : height,
    x : GLOBAL.CANVAS_WIDTH / 2 - width/2,
		y : GLOBAL.CANVAS_HEIGHT - height,
    angle : 0,
    
    up : function(speed){
      this.x += Math.sin(this.angle)*speed;
      this.y -= Math.cos(this.angle)*speed;
      //console.log('up', this.x, this.y, this.angle);
      GLOBAL.SOUND.play("thrust");

    },
    down : function(speed){
      this.x -= Math.sin(this.angle)*speed;
      this.y += Math.cos(this.angle)*speed;
      //console.log('down', this.x, this.y, this.angle);
    },
    left : function(change){
      this.angle -= change;
      //console.log('left', this.x, this.y, this.angle);
    },
    right : function(change){
      this.angle += change;
      //console.log('right', this.x, this.y, this.angle);
    },
    
    
		sprite : GLOBAL.SPRITE("player_ship"), //todo:
		draw : function () {
			this.sprite.draw(GLOBAL.CANVAS, this.x, this.y, this.width, this.height, this.angle);
		},
    drawx : function () {
      var temp = GLOBAL.CANVAS.fillStyle;
			GLOBAL.CANVAS.fillStyle = this.color;
			GLOBAL.CANVAS.fillRect(this.x, this.y, this.width, this.height);
      GLOBAL.CANVAS.fillStyle = temp;
		},
		shoot : function () {
			if (GLOBAL.OUTGOINGEMAILDATA[GLOBAL.GAMEHOUR].length > 0) { // bullet available
        console.log(GLOBAL.OUTGOINGEMAILDATA[GLOBAL.GAMEHOUR].pop());
        
				GLOBAL.SOUND.play("shoot");
        
				var bulletPosition = this.midpoint();
				GLOBAL.PLAYERBULLETS.push(Bullet({
						angle: this.angle,
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
		}
	};
});
