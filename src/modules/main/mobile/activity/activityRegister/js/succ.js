/* eslint-disable */
function mundoScript () {
	!(function (f, b, e, v, s) {
		const t = b.createElement(e);
		t.src = v;
		s = b.getElementsByTagName(e)[0];
		s.parentNode.insertBefore(t, s);
	})(window, document, 'script', '//www.mlinktracker.com/third/e2c41364e4x2u2x214/OPTIONAL_INFORMATION');
}
/**
 * from = adult_wap_*
 */
// const trackGoals = {
// 	'adult_wap': 	'https://rpc-php.trafficfactory.biz/goals/.8474SNX88i-oPwGflO4ujWnhezmBLUJmdkzn_i2APFXyLQpqs4vRCfV_Vllz-ZUtWJx1/c12ec71c2f01c56db734706f3ff6fe20c3b33e451b55151e77f96bf8803a0c8e',
// 	'adult_wap_ke': 'https://rpc-php.trafficfactory.biz/goals/.8474SNX88i-oPwGflO4ujWnhezmBLUJmdkzn_i2APFXyLQpqs4vRCfV_Vllz-ZUtWJx1/c12ec71c2f01c56db734706f3ff6fe20c3b33e451b55151e77f96bf8803a0c8e',
// 	'adult_wap_ng': 'https://rpc-php.trafficfactory.biz/goals/.523035YUbBCeU_JOO47wlbJDIarFXwMZI95sbnU4TWDP00vX_NA0OdsQ6GdGUe2rg35G/84069bf4b50f8beb3164e07a659d35f350f84310705eb1ff11d1d3156ecd638d',
// 	'adult_wap_gh': 'https://rpc-php.trafficfactory.biz/goals/.5432FEkbUd8gaO5sEkJZASTuyaUY4XaFfs1TnlNtRyhAlbHzNxZUYj3tAX1xlBYCug1Y/78ef325bd0c90cbe919551d689e4c71ab6fc053cb92f1c2f8224e25e3d3c08f7',
// }
function trafficScript() {
	const img = new Image(0, 0);
	const time = +new Date(); //
	let url = 'https://rpc-php.trafficfactory.biz/goals/.8474SNX88i-oPwGflO4ujWnhezmBLUJmdkzn_i2APFXyLQpqs4vRCfV_Vllz-ZUtWJx1/c12ec71c2f01c56db734706f3ff6fe20c3b33e451b55151e77f96bf8803a0c8e';
	url = `${url}?t=${time}`;
	img.src = url;
}

function sizmekScript() {
	(function () {
		var w = window,
			d = document;
		var s = d.createElement('script');
		s.setAttribute('async', 'true');
		s.setAttribute('type', 'text/javascript');
		s.setAttribute('src', '//c1.rfihub.net/js/tc.min.js');
		var f = d.getElementsByTagName('script')[0];
		f.parentNode.insertBefore(s, f);
		if (typeof w['_rfi'] !== 'function') {
			w['_rfi'] = function () {
				w['_rfi'].commands = w['_rfi'].commands || [];
				w['_rfi'].commands.push(arguments);
			};
		}
		_rfi('setArgs', 'ver', '9');
		_rfi('setArgs', 'rb', '35886');
		_rfi('setArgs', 'ca', '20802388');
		_rfi('setArgs', '_o', '35886');
		_rfi('setArgs', '_t', '20802388');
		// _rfi('setArgs', '_orderid', '[order id]');
		_rfi('track');
	})();
}

/* eslint-enable */

// 统计成功调用
export default function () {
	const from = window.URL.getPara('from');
	const gReg = /^self_g/;
	// fb注册成功回调
	if (window.fbq) {
		window.fbq('track', 'CompleteRegistration');
	}
	// twinpine统计注册成功回调
	if (window.postback) {
		window.postback();
	}
	if (from === 'eskimi_wap') {
		let r = Math.random();
		r *= 10000000000000000000;
		document.write('<img src="//dsp.eskimi.com/pixel/cookie?ord=' + r + '" style="display:none" />');
	} else if (from === 'taboola_wap') {
		window._tfa = window._tfa || [];
		window._tfa.push({ notify: 'action', name: 'conversion' });
	} else if (window.gtag && gReg.test(from)) {
		window.gtag('event', 'conversion', { send_to: 'AW-808629928/3pFsCPOwpIABEKjtyoED' });
	} else if (from === 'mundo_wap') {
		mundoScript();
	} else if (/adult.*/i.test(from)) {
		trafficScript();
	} else if (/sizmek.*/i.test(from)) {
		sizmekScript();
	}
}
