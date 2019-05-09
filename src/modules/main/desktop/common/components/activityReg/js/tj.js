// 统计相关的代码

const from = URL.getPara('from');
function fbcode () {
	!(function(f, b, e, v, n, t, s) {
		if (f.fbq) return;
		n = f.fbq = function() {
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
function googleCode () {
	!(function(f, b, e, v, s) {
		const t = b.createElement(e);
		t.async = !0;
		t.src = v;
		s = b.getElementsByTagName(e)[0];
		s.parentNode.insertBefore(t, s);
	})(window, document, 'script', '//www.googleadservices.com/pagead/conversion.js');
}

function twinpineCode () {
	(function(t, w, i, n, p, ine, ne, tw, or, k) {
		p = w.getElementsByTagName('head')[0];
		ine = w.createElement('script'); ine.async = 1;
		ine.src = i.replace(',', ne) + ne + n;
		p.appendChild(ine);
	})(window, document, '//static.,network.com/', '-postback.js', '', '', 'twinpine');
}

function taboolaCode () {
	!(function(f, b, e, v, s) {
		const t = b.createElement(e);
		t.async = !0;
		t.src = v;
		s = b.getElementsByTagName(e)[0];
		s.parentNode.insertBefore(t, s);
	})(window, document, 'script', '//cdn.taboola.com/libtrc/easegaminglimited-sc/tfa.js');
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

const fbkey = {
	self_fb_wap: '339701989854323',
	self_fb_wap_50f: '339701989854323',
	madhouse_fb_wap: '187806871968779',
	gatherone_fb_wap: '1901227656585671',
	// noah_fb_wap: '219840768590117',
	papaya_fb_wap: '219840768590117'
};

if (from) {
	if (fbkey[from]) {
		fbcode();
		window.fbq('init', fbkey[from]);
		window.fbq('track', 'PageView');
		// 完成注册时候调用
		// window.fbq('track', 'CompleteRegistration');
	} else if (from === 'noah_g_wap' || from === 'noah_g_wap_50f') {
		window.google_conversion_id = 960671023;
		window.google_conversion_label = 'zfNWCLaVknwQr9qKygM';
		window.google_remarketing_only = false;
		googleCode();
	} else if (from === 'twinpine_wap') {
		twinpineCode();
		// 完成注册时候调用
		// postback();
	} else if (from === 'taboola_wap') {
		taboolaCode();
	}
}
