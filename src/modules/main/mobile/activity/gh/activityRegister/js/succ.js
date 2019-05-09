/* eslint-disable */
function mundoScript () {
	!(function (f, b, e, v, s) {
		const t = b.createElement(e);
		t.src = v;
		s = b.getElementsByTagName(e)[0];
		s.parentNode.insertBefore(t, s);
	})(window, document, 'script', '//www.mlinktracker.com/third/e2c4136464x2v2v214/OPTIONAL_INFORMATION');
}
/* eslint-enable */

// 统计成功调用
export default function () {
	const from = window.URL.getPara('from');
	const gReg = /^self_g/;
	const taboola = /^taboola_wap/;
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
	} else if (taboola.test(from)) {
		window._tfa = window._tfa || [];
		window._tfa.push({ notify: 'action', name: 'conversion-1' });
	} else if (window.gtag && gReg.test(from)) {
		window.gtag('event', 'conversion', { send_to: 'AW-808629928/3pFsCPOwpIABEKjtyoED' });
	} else if (from === 'mundo_wap_ng') {
		mundoScript();
	}
}
