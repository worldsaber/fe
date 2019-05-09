window.fbAsyncInit = function() {
	FB.init({
		appId: '746045042245360',
		autoLogAppEvents: true,
		xfbml: true,
		version: 'v2.11'
	});
	FB.AppEvents.logPageView();
};

(function(d, s, id) {
	let js,
		fjs = d.getElementsByTagName(s)[0];
	if (d.getElementById(id)) {
		return;
	}
	js = d.createElement(s);
	js.id = id;
	js.src = 'https://connect.facebook.net/en_US/sdk.js';
	fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

// 简单使用举例
// window.FB.ui({
// 	method: 'share',
// 	display: 'popup',
// 	href: 'http://www.sportybet.com/ke/m/sport/football/',
// 	quote: 'Hey check out the bet I just placed on Sportybet!'
// }, response => {
// 	console.log('cancel share!');
// });
