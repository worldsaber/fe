import cookie from 'packages/lib/utils/cookie.js';
import URL from 'packages/fe.url';

/* 解析推广链接中的渠道和素材id，并存入cookie */
export function parseChannel() {
	// from creativeId
	if (!location.search) {
		return cookie.get('from');
	}
	const { creativeId, from, referralCode } = URL.getPara(true);

	const expires = 1;
	if (referralCode) {
		cookie.set('referralCode', referralCode, { expires });
	}
	if (from) {
		cookie.set('from', from, { expires });
		if (/^pr/i.test(from)) {
			cookie.set('referralCode', from, { expires });
		}
	}
	if (creativeId) {
		cookie.set('creativeId', creativeId, { expires });
	}
	if (from && document.referrer) {
		cookie.set('referrerSource', document.referrer, { expires });
	}
	return from;
}

/* 获取代理推荐码 */
export function getReferralCode() {
	// const data = cookie.get('from');
	// if (data && /^pr/i.test(data)) {
	// 	/* 代理推荐码：pr开头的渠道码 */
	// 	return data;
	// }
	// return '';

	return cookie.get('referralCode') || '';
}

/* 获取素材id */
export function getCreativeId() {
	return cookie.get('creativeId') || '';
}

/* 获取反向链接 */
export function getReferrerSource() {
	return cookie.get('referrerSource') || '';
}
