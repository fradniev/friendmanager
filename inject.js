(function() {
	$(document).ready(function(){
		var FriendList;
		var listOfNamesByComments;
		var listOfNamesByLikes;
		// Load the SDK asynchronously
		function goThroughList(){
			console.log(listOfNamesByComments);
			console.log(listOfNamesByLikes);
			console.log($('.FriendButton'));
			var promises=[];
			var friendsFromPage=$('.FriendButton').parent().parent().parent().parent().parent();
			$.when.apply($, friendsFromPage.map(function(item) {
				return new Promise((resolve, reject) => {
					FriendList=$(this).children('a').attr('href');
					console.log(FriendList);
					console.log("goThroughList");
					console.log($(this).find('.FriendRequestAdd').attr('aria-label'));
					Object.entries(listOfNamesByLikes).forEach(
						([key, value]) => function(){
							console.log("object:")
							console.log(key, value);
							console.log("name:")
							console.log($(this).find('.uiProfileBlockContent').find('.fsl').find('a').text());
							console.log("if:")
							console.log($(this).find('.uiProfileBlockContent').find('.fsl').find('a').text() == value);
						}
					);
					Object.entries(listOfNamesByComments).forEach(
						([key, value]) => function(){
							console.log("object:")
							console.log(key, value);
							console.log("name:")
							console.log($(this).find('.uiProfileBlockContent').find('.fsl').find('a').text());
							console.log("if:")
							console.log($(this).find('.uiProfileBlockContent').find('.fsl').find('a').text() == value);
						}
					);
					resolve(true);
				});
			})).then(()=> {
				alert("Finish");
			}).catch(error=>{
				alert(error);
			});
		}
		function scrolltobottom(){
			if (!$("#pagelet_timeline_medley_tv")[0]) {
				setTimeout(function () {
					$("html, body").animate({ scrollTop: $(document).height() }, 10);
					scrolltobottom();
				}, 100);
			}else{
				goThroughList();
			}
		}
		//scrolltobottom();
		chrome.runtime.onMessage.addListener(
		 function(request, sender, sendResponse) {
		 	console.log(request)
		    if (request.send == "sended"){
		    	listOfNamesByComments=request.listOfNamesByComments;
		    	listOfNamesByLikes=request.listOfNamesByLikes;
		 		scrolltobottom();
		    }
		});	
	});
})();