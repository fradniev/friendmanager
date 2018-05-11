chrome.runtime.onMessage.addListener(function(message, sender) {
    	if(!message.myPopupIsOpen) return;

		chrome.tabs.query(
		    { currentWindow: true, active: true },
		    function (tabArray) {
		    	console.log(tabArray);
		    	console.log(tabArray["0"].id);
			    chrome.tabs.executeScript(tabArray["0"].id, { file: "jquery.js" }, function() {
				    chrome.tabs.executeScript(tabArray["0"].id, { file: "inject.js" }, function(){
						chrome.tabs.sendMessage(tabArray["0"].id,{send: "sended",listOfNamesByLikes: message.listOfNamesByLikes,listOfNamesByComments:message.listOfNamesByComments});
				    });
				});
		    }
		);
	});

authenticateWithFacebook = () => {
  return new Promise((resolve, reject) => {
	const TYPE = 'token';
	const URI = chrome.identity.getRedirectURL();
	const SCOPE = "user_posts";
	const AUTH_URL = `https://www.facebook.com/v2.12/dialog/oauth?client_id=2004504333099634&redirect_uri=${URI}&response_type=${TYPE}&scope=${SCOPE}&auth_type=rerequest`;
	chrome.identity.launchWebAuthFlow({
		url: AUTH_URL,
		interactive: true,
	}, function(redirectURL) {

		// in my extension I have used mootools method: parseQueryString. The following code is just an example ;)
		var params = redirectURL.split('#');
		params=params[1];
		var accessToken = params.split('&')[0];
		accessToken = accessToken.split('=')[1];

		var secondsToExpiration = params.split('&')[1];
		secondsToExpiration = secondsToExpiration.split('=')[1];
		var tokenExpiration = Date.now() + secondsToExpiration * 1000;
		if (redirectURL == null) {
			reject(chrome.runtime.lastError.message)
		} else if (redirectURL.indexOf("?error") !== -1) {
			reject(redirectURL.split('?error')[1]);
		} else {
			resolve({
			  accessToken: accessToken,
			  tokenExpiration: tokenExpiration
			});
		}
	});
  });
}
	