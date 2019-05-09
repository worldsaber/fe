// const pluses = /\+/g;
const defaults = {
	// expires
	// path
	// domain
	// secure
};

function encode(s) {
	return cookie.raw ? s : encodeURIComponent(s);
}

function decode(s) {
	return cookie.raw ? s : decodeURIComponent(s);
}

function stringifyCookieValue(value) {
	return encode(cookie.json ? JSON.stringify(value) : String(value));
}

function parseCookieValue(val) {
	let s = val;
	if (s.indexOf('"') === 0) {
		// This is a quoted cookie as according to RFC2068, unescape...
		s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
	}

	try {
		// Replace server-side written pluses with spaces.
		// If we can't decode the cookie, ignore it, it's unusable.
		// If we can't parse the cookie, ignore it, it's unusable.
		// s = decodeURIComponent(s.replace(pluses, ' '));
		s = decodeURIComponent(s);
		return cookie.json ? JSON.parse(s) : s;
	} catch (e) {
		console.error(e);
	}
}

function read(s, converter) {
	const value = cookie.raw ? s : parseCookieValue(s);
	return typeof converter === 'function' ? converter(value) : value;
}

function cookie(key, value, options) {
	// Write
	if (arguments.length > 1 && typeof value !== 'function') {
		const opt = Object.assign({}, defaults, options);
		if (typeof opt.expires === 'number') {
			const days = opt.expires;
			const t = opt.expires = new Date();
			t.setMilliseconds(t.getMilliseconds() + (days * 864e+5));
		}
		if (value === null) {
			cookie(key, '', Object.assign({}, opt, {
				expires: -1
			}));
			return !cookie(key);
		}
		const cc = [
			encode(key), '=', stringifyCookieValue(value),
			opt.expires ? '; expires=' + opt.expires.toUTCString() : '',
			opt.path ? '; path=' + opt.path : '',
			opt.domain ? '; domain=' + opt.domain : '',
			opt.secure ? '; secure' : ''
		].join('');
		document.cookie = cc;
		return cc;
	}
	// Read
	let result = key ? undefined : {};
		// To prevent the for loop in the first place assign an empty array
	const cookies = document.cookie ? document.cookie.split('; ') : [];
	let	i = 0;
	const l = cookies.length;
	for (; i < l; i++) {
		const parts = cookies[i].split('=');
		const name = decode(parts.shift());
		let cc = parts.join('=');
		if (key === name) {
			// If second argument (value) is a function it's a converter...
			result = read(cc, value);
			break;
		}
		if (!key) {
			cc = read(cc);
			if (cc !== undefined) {
				result[name] = cc;
			}
		}
	}
	return result;
}
cookie.defaults = defaults;
cookie.raw = false;
cookie.json = false;
window.cookie = cookie;
export default cookie;
