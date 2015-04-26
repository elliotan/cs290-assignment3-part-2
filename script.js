var settings = [];
var storage = null;
var favList = [];
var fetchedData = [];
var htmlList = [];

var fetchData = function() {
  var req = new XMLHttpRequest();
	if (!req) {
		throw 'Unable to create HttpRequest.';
	}
  	req.onreadystatechange = function () {
    	if (this.readyState === 4 ) { 
      	console.log(this.status);
      	console.log(JSON.parse(this.responseText));
    		fetchedData = JSON.parse(this.responseText);
    		for(var i = 0 ; i < fetchedData.length; i++) {
    			genHtml(fetchedData[i]);
    	  }
      }
	};
  var url = 'https://api.github.com/gists?';
  req.open('GET', url);
  req.send();
};


var genHtml = function(gist) {

  if (gist.description === null) {
    gist.description = '--No Description Available--';
  }

  if (gist.description === undefined) {
    gist.description = '--No Description Available--';
  }

  if (gist.description === '') {
    gist.description = '--No Description Available--';
  }

	var gistObj = { idNum: gist.id,
						  title: gist.description,
							url: gist.html_url };


	htmlList.push(gistObj);

  var gistList = document.getElementById('gistList');
  var favGistList = document.getElementById('favGistList');
  var language = document.getElementsByName('language');

	var selectFav = document.createElement("button");
  selectFav.id = gistObj.idNum + 'f';
	selectFav.innerHTML = "+";
	selectFav.setAttribute("gistId", gistObj.idNum);
	selectFav.onclick = function() {
		var gistId = this.getAttribute("gistId");
		var favThisGist = findById(gistId);
		favList.push(favThisGist);
    favGistList.appendChild(removeFav);
		var list3 = document.createElement('li');
    list3.id = gistObj.idNum + 'fav';
		list3.innerHTML = ("<b>" + favThisGist.title + "</b><br>" + favThisGist.url + "<br><br>");
		favGistList.appendChild(list3);
		//remove from gist list
    var removeThisGist = document.getElementById(gistObj.idNum + 'reg');
    var removeThisButton = document.getElementById(gistObj.idNum + 'f');
    gistList.removeChild(removeThisGist);
    gistList.removeChild(removeThisButton);
	};

	var removeFav = document.createElement("button");
  removeFav.id = gistObj.idNum + 'r';
	removeFav.innerHTML = "-";
	removeFav.setAttribute("gistId", gistObj.idNum);
	removeFav.onclick = function() {
		var gistId = this.getAttribute("gistId");
		var removeThisGist = findById(gistId);
		htmlList.push(removeThisGist);
    gistList.appendChild(selectFav);
		var list4 = document.createElement('li');
    list4.id = gistObj.idNum + 'reg';
		list4.innerHTML = ( + removeThisGist.title + removeThisGist.url);
		gistList.appendChild(list4);
		//remove from favorite gist list
    var removeThisButtonon = document.getElementById(gistObj.idNum + 'r');
    var toBeRemovedFav = document.getElementById(gistObj.idNum + 'fav');
    favGistList.removeChild(toBeRemovedFav);
    favGistList.removeChild(removeThisButtonon);
	};

	gistList.appendChild(selectFav);
	var list1 = document.createElement('li');
  list1.id = gistObj.idNum + 'reg';
	list1.innerHTML = (gistObj.title + "<br>" + gistObj.url + "<br><br>");
	gistList.appendChild(list1);

}

window.onload = function() {
  var settingsStr = localStorage.getItem('userSettings');
  if (settingsStr === null) {
    storage = {'userSettings:':[]};
    localStorage.setItem('userSettings', JSON.stringify(storage));
  }
  else {
    settings = JSON.parse(localStorage.getItem('userSettings'));
    var savedFav = document.getElementById('favGistList');
    for (var index = 0; index < settings.length; index++) {
      savedFav.appendChild(removeFav);
      var list5 = document.createElement('li');
      list5.id = settings[index].idNum + 'fav';
      list5.innerHTML = (settings[index].title + "<br>" + settings[index].url + "<br><br>");
      savedFav.appendChild(list5);
    }
  }
}


window.onbeforeunload = function() {
  for (var t = 0; t < favList.length; t++) {
    settings[t] = favList[t];
  }

  localStorage.setItem('userSettings', JSON.stringify(settings));
}

var findById = function(id) {
	for (var idx = 0; idx < htmlList.length; idx++) {
		if (htmlList[idx].idNum === id) {
			return htmlList[idx];
		}
	}
};


