define(function () {
	return {
		func1 : function () {
			alert('f1')
		},
		func2 : function () {
			alert('f2')
		},
    getJson: function(url, callback){
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
					callback('error loading json '+url);
				}
			}
			xmlhttp.open("GET", url, false);
			xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			xmlhttp.send();
    }
	}
});