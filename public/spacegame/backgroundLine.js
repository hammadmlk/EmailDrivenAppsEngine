//A module definition.
// line function

/*TODO: Bullet and BackgroundLine should extend line class. Currently bullet class is working as line*/

define(["globals", "./line"], function (GLOBAL, Line) {
	"use strict"
	return function () {
		
    var line =  Line({
                  speed : -0.2,
                  x : Math.random() * GLOBAL.CANVAS_WIDTH,
                  y : Math.random() * GLOBAL.CANVAS_HEIGHT,
                  width: 0.1 + Math.random()*0.4,
                  height: 5 + Math.random()*10,
                  color: 'grey'
                });        
    
		return line;
	}
})
