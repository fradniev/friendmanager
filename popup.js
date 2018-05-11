window.fbAsyncInit = function() {
    FB.init({
        appId            : '2004504333099634',
        cookie     : true,  // enable cookies to allow the server to access 
        oauth: true,
        xfbml            : true,
        version          : 'v2.12'
    });
};
(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/all.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
$(document).ready(function(){
	$("#signin").text("Sign in");
	$("#signin").click(function(event) {
		console.log("clicked");
		var bgPage = chrome.extension.getBackgroundPage();
		bgPage.authenticateWithFacebook().then(function(access){
			getAllPosts(access).then(function(all){
				console.log("continue");
				getAllLikesinPosts(all);
			}).catch(error=>{
				alert(error);
			});
		}).catch(error=>{
			alert(error);
		});
	});
	var FriendList;
	var allPosts=[];
	var month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
	var getAllPosts= function(accessToken){
		return new Promise( function(resolve,reject){
			var today = new Date();
			var dd = today.getDate();
			var mm = today.getMonth(); //January is 0!
			var yyyy = today.getFullYear();
			var actualDate=dd+" "+month[mm]+" "+yyyy;
			if (mm-10<0) {
			  mm=11-10+mm;
			  yyyy=yyyy-1;
			}else{
				mm=mm-10;
			}
			var sinceDate=dd+" "+month[mm]+" "+yyyy;
			FB.api("/me/feed",{ 
				access_token: accessToken.accessToken,
				fields: "id,reactions,comments",
				since: sinceDate,
				until: actualDate
			},
			function (response) {
				if (!response || response.error) {
					console.log(response);
					reject(response.error);
				} else {
					allPosts.push(response.data);
					resolve(allPosts);
				}
			}
		)}
	)};
	function storeAllPosts(page){
	  if(page && page.paging && page.paging.next) {
	      graph.get(page.paging.next, function(err, res) {
	        if (res!=null) {
	          console.log("Recived.")
	          allPosts.push(res.data);
	          storeAllPosts(res);
	        }
	        else{
	          console.log("Error connecting. Trying again.");
	          storeAllPosts(page);
	        }
	      });
	    }
	  else{
	    showAllPosts(allPosts);
	    return true;
	  }
	}
	var i=0;
	var listOfNamesByLikes={};
	var listOfNamesByComments={};
	var list=[];
	function getAllLikesinPosts(all){
	  for (var i = 0; i < all.length; i++) {
	    if (all[i].length!=0) {
	      for (var j = 0; j < all[i].length; j++) {
	        if (all[i][j].reactions!=null) {
	          for (var k = 0; k < all[i][j].reactions.data.length; k++) {
	            if (typeof listOfNamesByLikes[all[i][j].reactions.data[k].id]=='undefined') {
	              listOfNamesByLikes[all[i][j].reactions.data[k].id]=all[i][j].reactions.data[k].name;
	            }
	          }
	          if (all[i][j].comments!=null) {
	            for(var k = 0; k < all[i][j].comments.data.length; k++){
	              if (typeof listOfNamesByComments[all[i][j].comments.data[k].from.id]=='undefined') {
	                listOfNamesByComments[all[i][j].comments.data[k].from.id]=all[i][j].comments.data[k].from.name;
	              }
	            }
	          }
	        }
	      }
	    }
	    if (i==(all.length-1)) {
	    	showList();
	    }
	  }
	}
	function showList(){
	    chrome.runtime.sendMessage({
	    	'myPopupIsOpen': true,
	    	'listOfNamesByComments':listOfNamesByComments,
	    	'listOfNamesByLikes':listOfNamesByLikes
	    });
	}
});