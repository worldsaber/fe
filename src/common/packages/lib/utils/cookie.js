/**
 * Cookie 操作库
 */
module.exports = {
	get: function getCookie(key) {
		var reg = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)');
		var result = reg.exec(document.cookie);

		return result ? decodeURIComponent(result[1]) : '';
	},
	set: function setCookie(key, value, options) {
		options = Object.assign({
			path: '/',
			expires: 36500
		}, options);

		if (value === null) {
			options.expires = -1;
		}

		// 获取有效期
		if (typeof options.expires === 'number') {
			var days = options.expires;

			var expires = new Date();
			expires.setDate(expires.getDate() + days);

			options.expires = expires;
		}

		// 设置 Cookie
		document.cookie = [
			encodeURIComponent(key), '=',
			options.raw ? String(value) : encodeURIComponent(String(value)),
			options.expires ? '; expires=' + options.expires.toUTCString() : '',
			options.path ? '; path=' + options.path : '',
			options.domain ? '; domain=' + options.domain : '',
			options.secure ? '; secure' : ''
		].join('');

		return document.cookie;
	}
};
