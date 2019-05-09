import Base64 from 'base64';
import { LS } from 'storage';
import { CryptoJS, rsa, hexToBase64 } from '../crypto/index';

const baseUrl = __baseUrl__; // eslint-disable-line

window.CryptoJS = CryptoJS;
// 需要加密的url
// 1表示直接用aes加密, aes秘钥通过后台获取
// 2表示先用 生成一个aes秘钥，在把aes秘钥上传到服务器，后期用aes秘钥加密数据
let cryptoURL = {
	[`/api${baseUrl}patron/account`]: 1,
	[`/api${baseUrl}patron/accessToken`]: 1,
	[`/api${baseUrl}patron/account/create`]: 1,
	[`/api${baseUrl}orders/order`]: 2,
	[`/api${baseUrl}pocket/v1/bankTrades/bankTrade/deposit`]: 2,
	[`/api${baseUrl}pocket/v1/bankTrades/bankTrade/withdraw`]: 2,
	[`/api${baseUrl}promotion/v1/gifts/redeem`]: 2,
	[`/api${baseUrl}realSportsGame/cashOut`]: 2
};
// 加载即去获取cipher-- 单aes加密用
// 单aes加密流程，先向后台请求一个aes机密的 秘钥，然后通过秘钥加密数据发给后台，秘钥一直保存，后期数据返回解密也通过这个秘钥
const getAesCipher = (function() {
	let result = -1;
	const get = function () {
		return fetch('/patron/cipher', {
			method: 'POST'
		})
		.then(res => res.json())
		.then(({ bizCode, data }) => {
			if (bizCode === 10000) {
				const key = CryptoJS.enc.Base64.parse(data.password);
				result = {
					ursId: data.ursId,
					key
				};
				return result;
			}
			result = -1;
			return Promise.reject('fetch res error');
		}, () => {
			result = -1;
			return Promise.reject('fetch res error');
		});
	};
	let fet;
	return () => {
		if (result === -1) {
			fet = get();
			return fet;
		} else if (result) {
			return Promise.resolve(result);
		}
		return fet;
	};
})();

// 自己创建一个aes cipher 并发送给后台后面加密,都用这个cipher 当请求地址是2的时候走这个流程
const createAesCipher = (function() {
	const get = function () {
		// 生成一个aes加密的key
		const key = CryptoJS.lib.WordArray.random(16);
		const body = hexToBase64(rsa.encrypt(`password=${encodeURIComponent(key.toString(CryptoJS.enc.Base64))}`));
		return fetch('/base/cipher', {
			method: 'POST',
			headers: new Headers({ 'Content-type': 'text/plain' }),
			// 将key转成base64，并用aes加密后的hex转成base64，传递给后台
			body
		})
		.then(res => res.json())
		.then(({ bizCode, data }) => {
			if (bizCode === 10000) {
				const result = {
					transId: data.transId,
					key
				};
				if (window.sessionStorage) {
					try {
						// 秘钥保存在本地，防止中间盗窃,秘钥一个小时内有效，超过从新生成
						LS.set(`${window.country || ''}_transId`, JSON.stringify({
							transId: data.transId,
							key: encodeURIComponent(key.toString(CryptoJS.enc.Base64)),
							date: +new Date() + (60 * 1000 * 60)
						}));
					} catch (e) {
						console.error(e);
					}
				}
				return result;
			}
			return Promise.reject('fetch res error');
		}, () => Promise.reject('fetch res error'));
	};
	return () => {
		let result = -1;
		try {
			result = LS.get(`${window.country || ''}_transId`);
			if (result) {
				result = JSON.parse(result);
				if (result.key && result.transId && result.date) {
					const cur = +new Date();
					// 秘钥依然有效
					if (result.date > cur) {
						result.key = CryptoJS.enc.Base64.parse(decodeURIComponent(result.key));
					} else {
						result = -1;
					}
				} else {
					result = -1;
				}
			} else {
				result = -1;
			}
		} catch (e) {
			result = -1;
		}
		// 缓存获取秘钥，秘钥有效则直接返回
		if (result && result !== -1) {
			return Promise.resolve(result);
		}
		return get();
	};
})();

// 根据aesKey加密 body，并加入需要 header
function encryptionByAes (url, opt, aesKey, headers) {
	if (!opt.body) {
		return Promise.resolve({ url, opt });
	}
	const iv = CryptoJS.lib.WordArray.random(16);
	let key;
	for (key in headers) {
		if (Object.prototype.hasOwnProperty.call(headers, key)) {
			opt.headers.append(key, headers[key]);
		}
	}
	const encrypted = CryptoJS.AES.encrypt(opt.body, aesKey, {
		iv,
		mode: CryptoJS.mode.CBC,
		padding: CryptoJS.pad.Pkcs7
	});
	opt.body = iv.clone().concat(encrypted.ciphertext).toString(CryptoJS.enc.Base64);
	if (opt.headers.get('Content-Type').indexOf('application/x-www-form-urlencoded') > -1) {
		opt.headers.set('Content-Type', 'text/plain');
	}
	return { opt, url };
}

// 解密aes加密的数据
function decryptionByAes (key, data) {
	try {
		const d = Base64.atob(data);
		const res = Base64.btoa(d.slice(16));
		const iv = CryptoJS.enc.Base64.parse(Base64.btoa(d.slice(0, 16)));
		// 返回数据带偏移量，直接移除偏移量
		const decrypted = CryptoJS.AES.decrypt(res, key, {
			iv,
			mode: CryptoJS.mode.CBC,
			padding: CryptoJS.pad.Pkcs7
		});
		window.__debug__ && console.log('decrypt data:' + decrypted.toString(CryptoJS.enc.Utf8));
		return decrypted.toString(CryptoJS.enc.Utf8);
	} catch (e) {
		console.error(e);
	}
	return '';
}

// 针对body进行加密
// 如果url符合规范就进行加密
export function encryption(url, opt) {
	url = url.replace(`${window.location.protocol}//${window.location.host}`, '');
	const r = cryptoURL[url];
	if (!r) {
		return Promise.resolve({ url, opt });
	} else if (r === 1) {
		// 通过后台获取一个aes的加密秘钥
		return getAesCipher()
		.then(({ ursId, key }) => encryptionByAes(url, opt, key, { ursId }));
	} else if (r === 2) {
		// 自己生成一个aes的秘钥通过 rsa上传到服务器，后期通过这个aes秘钥加密数据
		return createAesCipher()
		.then(({ key, transId }) => encryptionByAes(url, opt, key, { transId }));
	}
	console.warn('未找到合适的加密方案');
	return Promise.resolve({ url, opt });
}

// 解密返回的数据
export function decryption(url, bodyData) {
	if (!bodyData || !url) {
		return Promise.resolve(bodyData);
	}
	url = url.replace(`${window.location.protocol}//${window.location.host}`, '');
	const r = cryptoURL[url];
	// 没找到，则不管直接返回res
	if (!r) {
		return Promise.resolve(bodyData);
	}
	// 将数据转成text解码
	return bodyData.text()
	.then(bodyData => {
		if (r === 1) {
			return getAesCipher()
			// 解密数据
			.then(({ key }) => decryptionByAes(key, bodyData));
		} else if (r === 2) {
			return createAesCipher()
			// 解密数据
			.then(({ key }) => decryptionByAes(key, bodyData));
		}
		console.warn('未找到合适的加密方案');
		return Promise.resolve(bodyData);
	});
}

export function setCryptoURL (params) {
	cryptoURL = Object.assign({}, cryptoURL, params);
}
