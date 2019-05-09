(function() {
	try{
		if (!window.navigator.connection) {
			return;
		}

		var connection = window.navigator.connection;
		var netType = 'highbandwidth';

		// http://caniuse.com/#feat=netinfo
		// http://w3c.github.io/netinfo
		if (['cellular', '3', '4'].indexOf(connection.type) !== -1) {
			netType = 'lowbandwidth';
		}

		window.__net__ = netType;

		document.body.setAttribute('data-net', netType);
	} catch(err) {
		if (window.console && console.error) {
			console.error(err);
		}
	}
})();
