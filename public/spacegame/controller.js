define(["globals", "enemy"], function (GLOBAL, Enemy) {
	return {
		update : function (player) {
			if (GLOBAL.KEYDOWN.isSpace()) {
				player.shoot();
			}

			if (GLOBAL.KEYDOWN.left) {
				player.x -= 10;
			}

			if (GLOBAL.KEYDOWN.right) {
				player.x += 10;
			}

			player.x = player.x.clamp(0, GLOBAL.CANVAS_WIDTH - player.width);

			GLOBAL.PLAYERBULLETS.forEach(function (bullet) {
				bullet.update();
			});

			GLOBAL.PLAYERBULLETS = GLOBAL.PLAYERBULLETS.filter(function (bullet) {
					return bullet.active;
				});

			GLOBAL.ENEMIES.forEach(function (enemy) {
				enemy.update();
			});

			GLOBAL.ENEMIES = GLOBAL.ENEMIES.filter(function (enemy) {
					return enemy.active;
				});

			this._handleCollisions(GLOBAL, player, this._collides);

			//todo:remove
			if (this._shouldCreateEnemy()) {
        console.log(GLOBAL.GAMEHOUR)
				GLOBAL.ENEMIES.push(Enemy());
			}
		},
		_shouldCreateEnemy : function () {
			var hour = GLOBAL.GAMEHOUR;
			var inemaildata = GLOBAL.INCOMINGEMAILDATA;
			var totalhourloops = GLOBAL.FPS * GLOBAL.HOURLENGTH;
			var numenemies = (inemaildata[hour]) ? inemaildata[hour].length : 0;
			GLOBAL.HOURITR++
			//console.log(numenemies);
			if (GLOBAL.HOURITR > totalhourloops) {
				//console.log(hour, 'hour')
				//console.log(inemaildata[hour], 'hour len')
				if (GLOBAL.HOURITR > totalhourloops + 2 * GLOBAL.FPS 
                        /*&& GLOBAL.ENEMIES.length === 0*/) {
					GLOBAL.HOURITR = 0;
          GLOBAL.GAMEHOUR++;
				
				}
				if (GLOBAL.GAMEHOUR > 24)
					alert('end of time');

				return 0
			}
			if (numenemies === 0) {
				return 0
			}
      
      //Todo: fails when numenemies > totalhourloops
			if (GLOBAL.HOURITR % Math.round(totalhourloops / numenemies) === 0) {
				//console.log(GLOBAL.HOURITR, totalhourloops, numenemies)
				return 1
			}

			return 0;
			//return Math.random() < 0.1
		},
		_collides : function (a, b) {
			"use strict"
			return a.x < b.x + b.width &&
			a.x + a.width > b.x &&
			a.y < b.y + b.height &&
			a.y + a.height > b.y;
		},
		_handleCollisions : function (GLOBAL, player, _collides) {
			"use strict"
			GLOBAL.PLAYERBULLETS.forEach(function (bullet) {
				GLOBAL.ENEMIES.forEach(function (enemy) {
					if (_collides(bullet, enemy)) {
						enemy.explode();
						bullet.active = false;
					}
				});
			});

			GLOBAL.ENEMIES.forEach(function (enemy) {
				if (_collides(enemy, player)) {
					enemy.explode();
					player.explode();
				}
			});
		},
		getGameData : function (email, incoming, callback) {
			/*getGameData function
			use getEmailData('h@hh.com', true) //gets incoming email data
			use getEmailData('h@hh.com', false) //gets outgoing email data
			 */

			xmlhttp = new XMLHttpRequest();
			xmlhttp.onreadystatechange = function () {
				if (xmlhttp.readyState == 0) {}
				if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
					//success
					var res = xmlhttp.responseText;
					var resJson = JSON.parse(res);
					callback(null, incoming, resJson);
				} else if (xmlhttp.readyState == 4) {
					//fail
					callback('error loading GameDate');
				}
			}
			incoming = (incoming) ? 1 : 0;
			var url = window.location.href;
			url = url.split("/");
			url = url[0] + "//" + url[2];
			xmlhttp.open("GET", url + '/stats.json?email=' + email + '&incoming=' + incoming, false);
			xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			xmlhttp.send();
		}
	}
});
