
define(function () {
	"use strict"
	//Do setup work here

	var canvas_width = (window.innerWidth).clamp(250, 700);
	//todo: clamp prototype should run first.
	var canvas_height = window.innerHeight-5;
	var canvasElement = $("<canvas width='" + canvas_width +
			"' height='" + canvas_height + "'></canvas>");
	var canvas = canvasElement.get(0).getContext("2d");
	canvasElement.appendTo('body');

	return {
		CANVAS_WIDTH : canvas_width,
		CANVAS_HEIGHT : canvas_height,
		FPS : 60,
		CANVAS : canvas,
		SOUND : Sound, //TODO: this should be imported
		SPRITE : Sprite,
		PLAYERBULLETS : [],
    ENEMIES: [],
    KEYDOWN: keydown,
    LOADING:2,
    OUTGOINGEMAILDATA:[],
    INCOMINGEMAILDATA:[],
    GAMEHOUR:0,
    HOURLENGTH:1, //how long (in seconds) is one hour in game time
    HOURITR:0 //hour iteration number
	}
});
