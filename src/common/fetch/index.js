import 'whatwg-fetch';
import * as utils from 'utils';
import { encryption, decryption } from './crypto';
import { NETWORK_ERR, RES_NULL_ERR } from './status';

const originFetch = window.fetch;
// 全局参数
let globalParams = {};
// 全局header
let globalHeaders = {};

const cndBasePath = __baseUrl__; // eslint-disable-line

// 所有url地址加前缀
const globalUrlStart = `/api${cndBasePath}`;

const protocolReg = /^https?:\/\//;

// 以协议开始
const startS = /^\//;

export function setGlobalParams (params) {
	globalParams = Object.assign({}, globalParams, params);
}

export function setGlobalHeaders (params) {
	globalHeaders = Object.assign({}, globalHeaders, params);
}

// 解密body
function decBody(res, url) {
	return decryption(url, res)
	// 重新创建新的响应
	.then(data => {
		if (data instanceof Response) {
			return data;
		}
		return new Response(data || '', {
			status: res.status,
			statusText: res.statusText,
			headers: new Headers(res.headers),
			url: res.url
		});
	});
}

const lockUrl = {};
// 后到优先策略：取消前一个未完成的ajax请求，然后发送新的ajax请求
const s1 = /^@.+/;
// 节约型策略：即共享类型，由同类型的第一个请求发送ajax，（在第一个ajax返回之前的）后续的同类型共享ajax返回结果
const s2 = /^\!.+/;
window.lockUrl = lockUrl;
function lockDetial (promise, lockKey) {
	let p = promise;
	const del = () => {
		// 只有第一个请求有效的情况包括 ！和普通字符串的情况
		if (!s1.test(lockKey)) {
			if (lockUrl[lockKey] && lockUrl[lockKey][0] === promise) {
				delete lockUrl[lockKey];
			}
		} else if (!promise.abort && s1.test(lockKey)) {
			delete lockUrl[lockKey];
		}
	};
	// 没有锁的情况下，直接返回
	if (!lockKey) {
		return promise;
	}
	if (lockKey) {
		if (s1.test(lockKey)) {
			// 新增加一步
			p = promise.then(data => {
				del();
				let res = data;
				if (promise.abort) {
					res = new Response(JSON.stringify({
						abort: true
					}));
				}
				return res;
			}, data => {
				del();
				let res = data;
				if (promise.abort) {
					res = new Response(JSON.stringify({
						abort: true
					}));
				}
				return res;
			});
		} else {
			const pp = lockUrl[lockKey][0];
			p = pp.then(res => {
				del();
				if (res instanceof Response) {
					return res.clone();
				}
				return res;
			}, res => {
				del();
				if (res instanceof Response) {
					return Promise.reject(res.clone());
				}
				return Promise.reject(res);
			});
		}
	}
	return p;
}
/**
 * 重写fetch方法
 * 重写的主要目的是为了能注入参数
 *  @lockKey策略
 * 	@ 后到优先策略：取消前一个未完成的ajax请求，然后发送新的ajax请求
 *	! 节约型策略：即共享类型，由同类型的第一个请求发送ajax，（在第一个ajax返回之前的）后续的同类型共享ajax返回结果
 *	其他非空字符串先到优先策略：同类型的ajax在第一个没有完成之前，取消后续的请求。这是最常用的一种并发策略。
*/
export default function fetch (input, options, lockKey) {
	const opt = options || {};
	let url;
	let credentials;
	let headers;
	let method;
	let mode;
	let body;
	let noApiPrefix = false;
	if (input instanceof Request) {
		url = input.url;
		credentials = input.credentials;
		if (!opt.headers) {
			headers = new Headers(input.headers || {});
		}
		method = input.method;
		mode = input.mode;
	} else {
		url = String(input);
	}
	if (url.indexOf('#') === 0) {
		url = url.slice(1);
		noApiPrefix = true;
	}
	// 第三方调用请求直接返回
	if (/^(https:)?\/\//.test(url) && !/^(https:)?\/\/www\.sportybet\.com/.test(url)) {
		return originFetch.apply(this, arguments); // eslint-disable-line
	}

	credentials = opt.credentials || credentials || 'same-origin';
	if (opt.headers || !headers) {
		headers = new Headers(opt.headers || {});
	}
	method = opt.method || method || 'GET';
	mode = opt.mode || mode || 'same-origin';

	if (method === 'GET') {
		if (opt.body) {
			opt.body._t = Date.now() || +new Date();
		} else {
			opt.body = {
				_t: Date.now() || +new Date()
			};
		}
	}
	body = opt.body;

	// 设置默认content-Type
	if (!headers.get('Content-Type')) {
		headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	}
	// 认为OperId是公参，如果用户没有手动传递则直接传递
	if (!headers.get('OperId')) {
		headers.append('OperId', window.operId);
	}

	// 设置header
	const headerKeys = Object.keys(globalHeaders);
	for (const key of headerKeys) {
		headers.append(key, globalHeaders[key]);
	}

	if (globalParams && !utils.isEmptyObject(globalParams)) {
		if (body) {
			// 让body可以是一个{}的object
			if (utils.isPlainObject(body)) {
				body = Object.assign({}, body, globalParams);
			} else if (typeof body === 'string') {
				body = `${body}&${utils.params(globalParams)}`;
			} else {
				// 其他情况全部添加到url上
				url = url.addPara(globalParams);
			}
		} else {
			body = Object.assign({}, globalParams);
		}
	}
	if (body) {
		// 让body可以是一个{}的object
		if (utils.isPlainObject(body)) {
			body = utils.params(body);
		}
		// 如果是get或post
		if (method === 'HEAD' || method === 'GET') {
			// 除了string的其他类型的body全部抛弃，stirng类型得直接添加到url后面
			if (typeof body === 'string') {
				url = URL.addPara(url, body);
			}
			body = null;
		}
	}
	// 去掉请求协议
	url = url.replace(protocolReg, '//');
	if (startS.test(url)) {
		url = url.slice(1);
	}

	if (globalUrlStart) {
		url = noApiPrefix ? `/${url}` : `${globalUrlStart}${url}`;
	}
	// 直接abort后续请求，在第一个请求没回来之前
	if (lockKey && !s1.test(lockKey) && !s2.test(lockKey) && lockUrl[lockKey] && lockUrl[lockKey].length) {
		// 后续请求全部返回打断
		return new Promise((res, rej) => {
			res(new Response(JSON.stringify({
				abort: true
			})));
		});
	}
	// 先去看请求是否需要加密，如果需要就加密
	const promise = encryption(url, {
		headers,
		method,
		mode,
		credentials,
		body
	})
	.then(({ url, opt }) => originFetch(url, opt))
	// 不管成功失败先去解析数据
	.then(res => {
		// 服务器异常不进行解密
		if (res.status === 500) {
			return res;
		}
		return decBody(res, url);
	}, res => decBody(res, url));
	if (lockKey) {
		if (!lockUrl[lockKey]) {
			lockUrl[lockKey] = [promise];
		} else {
			if (s1.test(lockKey)) {
				const all = lockUrl[lockKey];
				all.forEach(one => (one.abort = true));
			}
			lockUrl[lockKey].push(promise);
		}
	}

	return lockDetial(promise, lockKey)
	.then(res => {
		// qq浏览器的fetch返回的response中没有ok属性，手动判断下
		// 401为没有登录，单独处理一下
		const ok = res.ok || (res.status >= 200 && res.status < 300 || res.status === 401);
		if (!ok) {
			return Promise.reject({
				err: 1,
				message: 'Sorry, something went wrong. Please try again later.'
			});
		}
		if (res.status === 401) {
			window.loginStatus = false; // 登录凭证失效，标记登录状态false
			// 可以改完 Promise.reject({login: false}); 保留现状是兼容现有代码写法
			return new Response(JSON.stringify({
				login: false
			}));
		}
		return res;
		// return res.status === 401 ? new Response(JSON.stringify({ login: false })) : res;
	}, res => Promise.reject(NETWORK_ERR))
	.then(res => res.clone().text()
	.then(data => {
		if (data == null || data === '' || (typeof data === 'string' && data.indexOf('<!DOCTYPE') >= 0)) {
			return Promise.reject(RES_NULL_ERR);
		}
		return res;
	}), err => {
		if (err.stack) {
			console.error(err.stack);
		}
		// 脚本错误
		if (err.stack) {
			err.message = 'Sorry, something went wrong. Please try again later.';
		}
		if (err.err || err.message) {
			if (err.err && !err.message) {
				err.message = err.err;
			}
			return Promise.reject(err);
		}
		return Promise.reject({
			err: 3,
			message: 'No internet connection, try again.'
		});
	});
}

window.fetch = fetch;
// setGlobalParams({
// 	cjx: 111
// })
// const t = new Headers();
// t.append('Content-Type', 'text/plain');
// fetch('/test?c=2', {
// 	body: `b=2&c=3`,
// 	method: 'POST',
// 	headers: t,
// 	// credentials: 'omit'
// })
// .then(null, function (response) {
// 	console.dir(response);
// });
