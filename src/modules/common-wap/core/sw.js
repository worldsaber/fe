(function () {
	// 注册
	function registerServiceWorker () {
		if (navigator.serviceWorker) {
			navigator.serviceWorker.register(__cdnBasePath__ + 'sw.js?20180330', { // eslint-disable-line
				scope: __baseUrl__ // eslint-disable-line
			})
			.then(e => console.log('Service worker registered to ' + e.scope))
			.catch(e => console.warn('Registration failed with ' + e));
		}
	}
	// 注销serverWorker
	function unRegisterServerWorker () {
		navigator.serviceWorker && navigator.serviceWorker
		.getRegistrations && navigator.serviceWorker
		.getRegistrations().then(registrations => {
			registrations.forEach(registration => {
				registration.unregister();
			});
		});
	}
	// 是否是debug模式
	const isDebug = /debug/.test(location.href);
	// 是否是uc
	const ucVersion = +(navigator.userAgent.match(/UCBrowser\/(\d+)\./i) || [])[1] || 0;
	// 主版本号码
	const mainVersion = +(navigator.userAgent.match(/Chrome\/(\d+)\./i) || [])[1] || 0;
	// 版本号码
	const version = (navigator.userAgent.match(/Chrome\/([\d|\.]+)/i) || [])[1] || '';
	// 特殊版本检测-这个版本能检测到serverWorker，但是功能不正确
	const ver = !!version.match(/^44\.0\.2403/);
	// qq x急速内核版本
	const xQQVersion = +(navigator.userAgent.match(/TBS\/(\d+)/i) || [])[1] || 0;
	const is = !!isDebug || !!window.indexedDB && !ver &&
	(ucVersion > 11 ||
	(xQQVersion >= 43124 && mainVersion >= 53) ||
	(window.chrome && mainVersion > 49));
	// 通过window.regSW控制是否注册serverWorker
	// window.regSW = false;
	if (is && window.regSW) {
		registerServiceWorker();
	} else {
		unRegisterServerWorker();
	}
})();
