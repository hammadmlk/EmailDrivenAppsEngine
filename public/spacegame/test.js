//obj in define returned

//define({
//    color: "black",
//    size: "unisize"
//});

//my/shirt.js now does setup work
//before returning its module definition.
define(function () {
	//Do setup work here

	return {
		color : "black",
		size : "unisize"
	}
});

//my/shirt.js now has some dependencies, a cart and inventory
//module in the same directory as shirt.js
define(["./cart", "./inventory"], function (cart, inventory) {
	//return an object to define the "my/shirt" module.
	return {
		color : "blue",
		size : "large",
		addToCart : function () {
			inventory.decrement(this);
			cart.add(this);
		}
	}
});

//A module definition inside foo/title.js.
define(["my/cart", "my/inventory"],
	function (cart, inventory) {
	//return a function to define "foo/title".
	//It gets or sets the window title.
	return function (title) {
		return title ? (window.title = title) :
		inventory.storeName + ' ' + cart.name;
	}
})
