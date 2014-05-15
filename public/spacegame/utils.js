define(function () {
	return {
		func1 : function () {
			alert('f1')
		},
		func2 : function () {
			alert('f2')
		},
		getJson : function (url, callback) {
			//open url with GET. Convert response to JSON n return it.
			//callback(err, json)
			xmlhttp = new XMLHttpRequest();
			xmlhttp.onreadystatechange = function () {
				if (xmlhttp.readyState == 0) {}
				if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
					//success
					var res = xmlhttp.responseText;
					var resJson = JSON.parse(res);
					callback(null, resJson);
				} else if (xmlhttp.readyState == 4) {
					//fail
					callback('error loading json ' + url);
				}
			}
			xmlhttp.open("GET", url, false);
			xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			xmlhttp.send();
		},
		validateEmail : function (email) {
			var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
			if (!emailReg.test(email) || email == '') {
				return false;
			} else {
				return true;
			}
		},
		getCookie : function (cname) {
			var name = cname + "=";
			var ca = document.cookie.split(';');
			for (var i = 0; i < ca.length; i++) {
				var c = ca[i].trim();
				if (c.indexOf(name) == 0)
					return c.substring(name.length, c.length);
			}
			return "";
		},
		setCookie : function (cname, cvalue, exmins) {
			var d = new Date();
			d.setTime(d.getTime() + (exmins * 60 * 1000));
			var expires = "expires=" + d.toGMTString();
			var domain = "path=/;"
				document.cookie = cname + "=" + cvalue + "; " + domain + expires;
		}
	}
});