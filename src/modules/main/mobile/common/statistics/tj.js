// 统计相关的代码

const from = URL.getPara('from');

function fbcode() {
	!(function (f, b, e, v, n, t, s) {
		if (f.fbq) return;
		n = f.fbq = function () {
			n.callMethod ? n.callMethod(...arguments) : n.queue.push(arguments);
		};
		if (!f._fbq) f._fbq = n;
		n.push = n;
		n.loaded = !0;
		n.version = '2.0';
		n.queue = [];
		t = b.createElement(e);
		t.async = !0;
		t.src = v;
		s = b.getElementsByTagName(e)[0];
		s.parentNode.insertBefore(t, s);
	})(window, document, 'script', '//connect.facebook.net/en_US/fbevents.js');
}

function googleCode() {
	!(function (f, b, e, v, s) {
		const t = b.createElement(e);
		t.src = v;
		s = b.getElementsByTagName(e)[0];
		s.parentNode.insertBefore(t, s);
	})(window, document, 'script', '//www.googletagmanager.com/gtag/js?id=AW-829955674');
}

function twinpineCode() {
	(function (t, w, i, n, p, ine, ne, tw, or, k) {
		p = w.getElementsByTagName('head')[0];
		ine = w.createElement('script');
		ine.async = 1;
		ine.src = i.replace(',', ne) + ne + n;
		p.appendChild(ine);
	})(window, document, '//static.,network.com/', '-postback.js', '', '', 'twinpine');
}

function taboolaCode (country) {
	const urlMap = {
		'ke': '//cdn.taboola.com/libtrc/unip/1131536/tfa.js',
		'ng': '//cdn.taboola.com/libtrc/unip/1135473/tfa.js',
		'gh': '//cdn.taboola.com/libtrc/unip/1155377/tfa.js'
	};
	const url = urlMap[country];
	if (!url) {
		console.error('please config tboolaCode\'s script url');
	}

	window._tfa = window._tfa || [];
	window._tfa.push({
		notify: 'event',
		name: 'page_view'
	});
	!function (t, f, a, x) {
		if (!document.getElementById(x)) {
			t.async = 1;
			t.src = a;
			t.id = x;
			f.parentNode.insertBefore(t, f);
		}
	}(document.createElement('script'), document.getElementsByTagName('script')[0], url, 'tb_tfa_script');
}
function sizmekCode() {
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
		_rfi('setArgs', 'ca', '20802387');
		_rfi('setArgs', '_o', '35886');
		_rfi('setArgs', '_t', '20802387');
		_rfi('track');
	})();
}

/**
 *
	from == ‘self_fb_wap’or ‘self_fb_wap_50f’
		self Facebook pixel: 339701989854323
	from == ‘madhouse_fb_wap’
		Madhouse Facebook pixel: 187806871968779
	from == ‘gatherone_fb_wap’
		Gatherone Facebook pixel: 120068708810822
	from == ‘noah_fb_wap’
		Noah Facebook pixel: 219840768590117
	from == ‘noah_g_wap’or ‘noah_g_wap_50f’
		Noah Google tracking
	from == ‘eskimi_wap’
		Eskimi tracking
	from == ‘twinpine_wap’
		Twinpine tracking
	from == ‘taboola_wap’
		Taboola tracking
	from == ‘youappi_wap’
		YouAPPI tracking
 */

/**
 *  fb渠道匹配的内容是已 self_fb开始，其他的都算
 * 	self_fb_wap: '339701989854323',
 *	self_fb_wap_50f: '339701989854323',
 */
const fbReg = /^self_fb/;
const gReg = /^self_g/;
const gatheroneFb = /^gatherone_fb/;

const country = window.country;

const fbkey = {
	madhouse_fb_wap: '187806871968779',
	// gatherone_fb_wap: '1901227656585671',
	// noah_fb_wap: '219840768590117',
	// papaya_fb_wap: '219840768590117',
	papaya_fb_wap: '343563139481861'
};

if (from) {
	if (fbkey[from]) {
		fbcode();
		window.fbq('init', fbkey[from]);
		window.fbq('track', 'PageView');
		// 完成注册时候调用
		// window.fbq('track', 'CompleteRegistration');
	} else if (fbReg.test(from)) {
		fbcode();
		window.fbq('init', 339701989854323);
		window.fbq('track', 'PageView');
	} else if (gatheroneFb.test(from)) {
		fbcode();
		window.fbq('init', 1901227656585671);
		window.fbq('track', 'PageView');
	} else if (gReg.test(from)) {
		// googleCode();
		window.setTimeout(() => {
			window.gtag('config', 'AW-808629928');
		}, 0);
		// window.gtag('config', 'AW-808629928');
	} else if (from === 'twinpine_wap') {
		twinpineCode();
		// 完成注册时候调用
		// postback();
	} else if (/taboola_wap.*/.test(from)) {
		taboolaCode(country);
	} else if (/sizmek.*/i.test(from)) {
		sizmekCode();
	}
}
