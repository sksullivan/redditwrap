//initial variables, pretty self explainatory
var sortBy = "top";
var subReddit = "frontpage";
var ipAddr = "172.16.241.188:2222";


/*functions to help with sidebar management go below
*
*/


//resizes elements on our sidebar
function resize(elem1){
	var elems = new Array("sort","submit","subscribe","sidebar", "switch","subreddits");
	for(var i = 0; i < elems.length; i++){
		var it = document.getElementById(elems[i])
		if (elems[i] == elem1){ 
			it.style.minHeight = "200px";
			it.style.backgroundColor= "#f3f3f3";
			it.style.height= "55%";
			it.className= it.className.replace( /(?:^|\s)min(?!\S)/g, 'max');
			loadSide(elem1);
		}
		else{
			it.style.minHeight = "50px";
			it.style.backgroundColor= "#e9e9e9";
			it.style.height= "5%";
			it.className= it.className.replace( /(?:^|\s)max(?!\S)/g, 'min');
			hideSide(elems[i]);
		}
	}
}

//loads selected sidebar info
function loadSide(elem1){
	var title;
	switch (elem1)
	{
		case "sort":
			document.getElementById("sort").innerHTML = "asdf";
			loadSort();
			break;
		case "submit":
			loadSubmit();
			break;
		case "subscribe":
			loadSubscribe();
			break;
		case "sidebar":
			loadSidebar();
			break;
		case "switch":
			loadSwitch();
			break;
		case "subreddits":
			loadSubreddits();
			break;
	}
}

function loadSort(){
	var elem1 = document.getElementById("sort");
	var sortContent = "<div id=\"focus\">Sort by "+sortBy+"</div>";
	sortContent += "<div id=\"s1\" onclick = sortByHot();>hot</div>";
	sortContent += "<div id=\"s1\" onclick = sortByNew();>new</div>";
	sortContent += "<div id=\"s1\" onclick = sortByRising();>rising</div>";
	sortContent += "<div id=\"s1\" onclick = sortByCont();>controversial</div>";
	sortContent += "<div id=\"s1\" onclick = sortByTop();>top</div>";
	sortContent += "<div id=\"s1\" onclick = sortByGild();>gilded</div>";
	elem1.innerHTML = sortContent;
}

function sortByHot(){
	sortBy = "hot";
	loadSort();
}
function sortByNew(){
	sortBy = "new";
	loadSort();
}
function sortByTop(){
	sortBy = "top";
	loadSort();
}
function sortByRising(){
	sortBy = "rising";
	loadSort();
}
function sortByCont(){
	sortBy = "controversial";
	loadSort();
}
function sortByGild(){
	sortBy = "gilded";
	loadSort();
}

function loadSubmit(){
	var elem1 = document.getElementById("submit");
	elem1.innerHTML = "<div id=\"focus\">Submit a link or post</div>";
}

function loadSubscribe(){
	var elem1 = document.getElementById("subscribe");
	elem1.innerHTML = "Subscribe";
}

function loadSidebar(){
	var elem1 = document.getElementById("sidebar");
	elem1.innerHTML = "Sidebar";
}

function loadSwitch(){
	var elem1 = document.getElementById("switch");
	elem1.innerHTML = "Switch user";
}

function loadSubreddits(){
	var elem1 = document.getElementById("subreddits");
	var subredditContent = "<div id=\"focus\">Subreddits</div>";
	for(var i = 0; i < 20; i++){
		subredditContent += "<div id=\"sr\" onclick =\"loadLeft()\"><img src=\"a.png\" ";
		subredditContent += "</a></div>";
	}
	elem1.innerHTML = subredditContent;
}


//function to hide sidebars that are unused
function hideSide(elem1){
	var title;
	switch (elem1)
	{
		case "sort":
		title = "Sort by "+ sortBy;
		break;
		case "submit":
		title = "Submit a link or post";
		break;
		case "subscribe":
		title = "Subscribe";
		break;
		case "sidebar":
		title = "Sidebar";
		break;
		case "switch":
		title = "Users";
		break;
		case "subreddits":
		title = "Subreddits";
		break;
	}
	document.getElementById(elem1).innerHTML = title;
}



/*functions to help display in the main window
*everything below here should deal with the left side of the page
*
*
*
*/

//function for making a content box
//currently makes generic box, nothing special ATM
function makeContentBox(){
	var retu;
	retu = "<div class=\"contentBox\">";
	retu += "<div class =\"contentBoxLeft\">";
	retu += "<div class=\"titleBox\">";
	retu += "<div class=\"upvote\"></div>";
	retu += "<div class=\"downvote\"></div></div>";
	retu += "<div class=\"others\"></div></div>";
	retu += "<div class=\"imgBox\"></div></div>";
	return retu;
}

//function that will grab the posts from the python server
//sends subReddit, sortBy to ipAddr
function loadPosts(){
	$.getJSON
}


function loadLeft(){
	var title = "Welcome to reddit! <br/>";;
	for(var i = 0; i < 25; i++){
		title += makeContentBox();
	}
	document.getElementById("left").innerHTML = title;

}


function loadSelfPost(){

}

function loadImagePost(){

}

function loadLinkPost(){

}
