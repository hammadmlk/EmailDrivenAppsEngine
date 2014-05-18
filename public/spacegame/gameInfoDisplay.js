
//A module definition requires globals
//use:
define(["globals", "./utils"], function (GLOBAL, Utils) {
	"use strict"
  
  var firstSplashInfo = {counter: 1.5 * GLOBAL.FPS, message: "This Wave: " + Utils.UTCHourToLocalHour(GLOBAL.GAMEHOUR)};
  
  
	return {
    _splashInfo: firstSplashInfo,//{counter: 0, message: ""},
		draw : function () {
      if(this._splashInfo.counter>0){
          var temp = GLOBAL.CANVAS.fillStyle;
          GLOBAL.CANVAS.fillStyle = "#990";
          GLOBAL.CANVAS.font = "50px Arial";
          var txt = this._splashInfo.message;
          var width = GLOBAL.CANVAS.measureText(txt).width;
          var height = 50;
          GLOBAL.CANVAS.fillText(txt, GLOBAL.CANVAS_WIDTH / 2 - width/2, GLOBAL.CANVAS_HEIGHT / 2 - height/2);
          //GLOBAL.CANVAS.fillText("This HOUR: " + edttime + " EDT", 10, 50);
          GLOBAL.CANVAS.fillStyle = temp;
      };
   
      //this should not be here?? 
      //if no exist, create empty array  so .length in next code block is valid.
      if(GLOBAL.OUTGOINGEMAILDATA[GLOBAL.GAMEHOUR]==undefined){
        GLOBAL.OUTGOINGEMAILDATA[GLOBAL.GAMEHOUR]=[];
        console.log('empty')
      }
      var temp = GLOBAL.CANVAS.fillStyle;
      GLOBAL.CANVAS.fillStyle = "#990";
      GLOBAL.CANVAS.font = "20px Arial";
			GLOBAL.CANVAS.fillText("   Bullets Remaining: " + GLOBAL.OUTGOINGEMAILDATA[GLOBAL.GAMEHOUR].length, 10, GLOBAL.CANVAS_HEIGHT - 30);
      GLOBAL.CANVAS.font = "13px Arial";
			GLOBAL.CANVAS.fillText("      Enemy Number: " + GLOBAL.HOURENEMYNUMBER, GLOBAL.CANVAS_WIDTH - 150, 50);
      GLOBAL.CANVAS.fillStyle = temp;
		},
    update: function() {
      if(this._splashInfo.counter>0){
        this._splashInfo.counter--;
      }
      if(Math.random()<0.05)
        console.log(this._splashInfo)
    },
    hourSplash: function() {
      var duration= 1.5; //in seconds
      var counter = duration * GLOBAL.FPS;
      var message = "Next Wave: " + Utils.UTCHourToLocalHour(GLOBAL.GAMEHOUR);
      this._splashInfo = {counter: counter, message: message};
    }
	};
});
