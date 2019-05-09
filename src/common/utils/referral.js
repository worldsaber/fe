import cookie from 'packages/lib/utils/cookie.js';
import qs from 'querystring';

/* 解析推广链接中的推荐码和素材id */
export function parseCreativeSource() {
	// referralCode   creativeId
	if (!location.search) return;

	const { creativeId, referralCode } = qs.parse(location.search.replace('?', ''));
	if (referralCode) {
		const expires = 1;
		cookie.set('referralCode', referralCode, { expires });
		cookie.set('creativeId', creativeId, { expires });
		if (document.referrer) {
			cookie.set('referrerSource', document.referrer, { expires });
		}
	}
}

export function getReferralCode() {
	return cookie.get('referralCode') || '';
}

export function getCreativeId() {
	return cookie.get('creativeId') || '';
}

export function getReferrerSource() {
	return cookie.get('referrerSource') || '';
}
