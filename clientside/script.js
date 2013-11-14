//initial variables, pretty self explainatory
var sortBy = "top";
var subReddit = "front";
var ipAddr = "172.16.113.241:2222";

$(document).ready(function () {
	loadPosts();
	resize('subreddits');
});


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



function viewComments(elem){
	var elemId = $(elem).attr("id");
	$.get("http://"+ipAddr+"/",{req:"comments",sort:top, url:elemId},function(data){
		alert("pootis: " + data);
	});
	alert(elemId);
}



/*functions below help with creation of the content boxes
*they differentiate between imgur and self posts
*
*
*
*/

//function for making a content box
//currently makes generic box, nothing special ATM
function makeContentBox(theTitle, theUrl, theNumComments, theSubreddit, isNSFW, theUser, theTime, thePost){
	theUrl = checkUrl(theUrl);
	if(isFromImgur(theUrl)){
		makeImageBox(theTitle, theUrl, theNumComments, theSubreddit, isNSFW, theUser, theTime, thePost);
	}
	else{
		makeSelfBox(theTitle, theUrl, theNumComments, theSubreddit, isNSFW, theUser, theTime, thePost);
	}
}

//functuon to fix url if from imgur
function checkUrl(theUrl){
	if(theUrl.indexOf("gallery") > -1){
		return theUrl;
	}
	if(theUrl.length> 12){
		if(theUrl.substring(0,12)=="http://imgur"){
			theUrl = "http://i.imgur"+ theUrl.substring(12,theUrl.length)+ ".jpg";
		}
	}
	if(theUrl.length> 13){
		if(theUrl.substring(0,13)=="https://imgur"){
			theUrl = "http://i.imgur"+ theUrl.substring(13,theUrl.length)+".jpg";
		}
	}
	return theUrl;
}

//function for calcuating time ago posted
function timeAgo(redTime){
	var currentTime = new Date();
	var offset = Math.floor(currentTime.getTime()/1000)-redTime; //difference in real time - reddits time
	var retu = "";
	if(offset < 60) //seconds
		retu = "less than a minue ago";
	else if(offset < 60*60){ //minutes
		offset = Math.floor(offset/60);
		retu = "about " + offset;
			if(offset == 1)
				retu += " minute ago";
			else
				retu += "minutes ag0";
	} 
	else if(offset < 60*60*24){ //hours
		offset = Math.floor(offset/60/60);
		retu = offset;
			if(offset == 1)
				retu += " hour ago";
			else
				retu += " hours ago";
	}
	else if(offset < 60*60*24*30){ //days
		offset = Math.floor(offset/60/60/24);
		retu = offset;
			if(offset == 1)
				retu += " month ago";
			else
				retu += " months ago";
	}
	else{
		offset = Math.floor(offset/60/60/24/30);
		retu = "over " +offset;
			if(offset == 1){
				retu += " year ago";
			}
			else
				retu += " years ago";
	}
	return retu;
}

function isFromImgur(theUrl){
	if(theUrl.length >= 13)
		if(theUrl.substring(0,14) == "http://i.imgur")
			return true;
	return false;
}

function makeImageBox(theTitle, theUrl, theNumComments, theSubreddit, isNSFW, theUser, theTime, thePost)
{

	var picId = thePost + "img1";
	var classId = thePost + "img";
	var retu = "<div class=\"imgContentBox\">";//outtermost wrapper
	retu += "<div class =\"contentBoxLeft\">";//wrapper for left part of post
	retu += "<div class=\"titleBox\">";//wrapper for title, up and down
	retu += "<div class=\"upDown\">";//wrapper for up/down arrows
	retu += "<div class=\"upvote\"></div>";//closes upvote
	retu += "<div class=\"downvote\"></div></div>";//closes downvote and upDown
	retu += "<div class=\"title\"><div class=\"paragraphTitle\">"+theTitle + "</div>";//close titleParagraph
	retu += "<div class=\"paragraphSubmitted\">Submitted by " + theUser + " " + timeAgo(theTime);
	retu += "</div></div></div>";//closes title and titlebox
	retu += "<div class=\"imgOthers\">";
	retu += "<div id="+thePost+" class=\"comment\"onclick=viewComments(this)>";
		if(theNumComments == 1){
			retu+="1 total comment<br/>";
		}else{
			retu+=theNumComments + " total comments<br/>";
		}
	retu +="</div></div></div>";//closes others and contentBoxLeft
	retu += "<div class=\"imgBox\" id="+classId+"><img src="+theUrl+"  id="+picId+" onload=resizeImg(\""+picId+"\",\""+classId+"\") ></img></div></div>";//closes imgbox and contentBox)
	document.getElementById("left").innerHTML+= retu;

	$.getJSON("http://"+ipAddr+"/",{req:"topComment", id:thePost}, function(data) {
		addTopComment(data, thePost);
	});
}

function addTopComment(data, thePost){
	document.getElementById(thePost).innerHTML+=data.comment;
}

function resizeImg(theId, parentId){
	var myImage = new Image();
	myImage.src = $("#"+theId).attr("src");
	var imgWidth = myImage.width;
	var imgHeight = myImage.height;
	var newWidth = Math.floor(300*imgWidth/imgHeight);
	var myParent = document.getElementById(parentId);
	myParent.style.width=newWidth;
	myParent.style.maxWidth= "50%";


}

function makeSelfBox(theTitle, theUrl, theNumComments, theSubreddit, isNSFW, theUser, theTime, thePost)
{
	var retu = "<div class=\"selfContentBox\">";//outtermost wrapper
	retu += "<div class =\"contentBoxLeft\">";//wrapper for left part of post
	retu += "<div class=\"titleBox\">";//wrapper for title, up and down
	retu += "<div class=\"upDown\">";//wrapper for up/down arrows
	retu += "<div class=\"upvote\"></div>";//closes upvote
	retu += "<div class=\"downvote\"></div></div>";//closes downvote and upDown
	retu += "<div class=\"title\"><div class=\"paragraphTitle\">"+theTitle + "</div>";//close titleParagraph
	retu += "<div class=\"paragraphSubmitted\">Submitted by " + theUser + " " + timeAgo(theTime);
	retu += "</div></div></div>";//closes title and titlebox
	retu += "<div class=\"selfOthers\">";
	retu += "<div id="+thePost+" class=\"comment\"onclick=viewComments(this)>";
		if(theNumComments == 1){
			retu+="1 total comment<br/>";
		}else{
			retu+=theNumComments + " total comments<br/>";
		}
	retu +="</div></div></div>";//closes others and contentBoxLeft
	//var topComment = $.getJSON("http://"+ipAddr+"/",{req:"selfText", id:thePost});
	retu += "<div class=\"selfBox\">Here would go text for the self post</div></div>";//closes imgbox and contentBox
	
	document.getElementById("left").innerHTML +=retu;

}

//function that will grab the posts from the python server
//sends subReddit, sortBy to ipAddr
function loadPosts(){
	//var addr = ipAddr + "/posts";
	$.getJSON("http://"+ipAddr+"/",{req:"posts", sort:sortBy, sub:subReddit, limit:15}, function(data){
		loadLeft(data);
	});
}

//function that will parse JSON data
//then it creates the content boxes
function loadLeft(data){
	document.getElementById("left").innerHTML=" ";
	for(var i = 0; i < data.length; i++){
		var theTitle=data[i].title;
		var theUrl = data[i].url;
		var theNumComments = data[i].num_comments;
		var isNSFW = data[i].nsfw;
		var theUser = data[i].user;
		var theSubreddit = data[i].subreddit;
		var theTime = data[i].time;
		var thePost = data[i].id;
		makeContentBox(theTitle, theUrl, theNumComments,theSubreddit, isNSFW, theUser,  theTime, thePost);
	}
	document.getElementById("left").innerHTML+="<button type=\"button\" onclick = loadPosts(); >click to load posts</button>";
}

/*Put all login functions down here
*
*
*
*
*
*/




