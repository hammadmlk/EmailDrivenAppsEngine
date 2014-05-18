//A module definition.
// bullet function

define(["globals", "./line"], function (GLOBAL, Line) {
	"use strict"
	return function (I) {
  
    var bullet = Line(I);
    
    bullet.explode = function () {
			this.active = false;
			// Extra Credit: Add an explosion graphic
		};
  
		return I;
	}
})
