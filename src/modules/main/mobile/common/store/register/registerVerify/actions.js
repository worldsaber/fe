import md5 from 'blueimp-md5';
import { cookie } from 'storage';

import { getCreativeId, getReferrerSource } from 'utils/channel';
import { protocol, domain, baseUrl } from 'config/pageConfig';

import * as mutationTypes from './mutationTypes';
import { getErrorInfo } from './commonFun';

const defaultError = 'No internet connection, try again.';

let tempParams;

export default {
	/*
	register
	params: phone & password & code
	return: token
	 */
	register({ commit, state, dispatch }, params) {
		if (!state.token && !state.ignoreVcode) {
			const errInfo = {
				type: 'codeError',
				msg: 'Incorrect code. Please try again.'
			};
			return Promise.reject(errInfo);
		}

		tempParams = params;

		params.password = md5(params.password);

		return new Promise((resolve, reject) => {
			let request;
			if (state.ignoreVcode) {
				request = fetch('/patron/account', {
					method: 'POST',
					body: params
				});
			} else {
				request = fetch('/patron/account/create', {
					method: 'POST',
					body: Object.assign(params, {
						token: state.token || null,
						type: 1
					})
				});
			}
			request.then(res => res.json()).then(data => {
				const code = data.bizCode,
					originData = data.data;

				const errorType = getErrorInfo(code);
				(!errorType || errorType !== 'phone') && commit(mutationTypes.UPDATE_ACCOUNT, params.phone);

				commit(mutationTypes.SAVE_TOKEN, originData);

				if (code === 10000 || code === 11610) {
					// 写入cookie
					cookie('phone', state.account || '', {
						path: '/',
						expires: 365
					});
					resolve(data);
				} else {
					const errorMsg = data.message || defaultError;
					let errInfo = {};
					if ([11600, 11602, 11605].includes(code)) {
						const homePath = `${protocol}//${domain}${baseUrl}`,
							loginPath = `${homePath}independent_login?okUrl=${encodeURIComponent(homePath)}`;

						errInfo = {
							type: 'phoneError',
							msg: `${errorMsg} Please try to <a href="${loginPath}" class="t-highlight">Log In</a>`
						};
					} else if (code === 11810) {
						errInfo = {
							type: window === top ? 'toast' : 'inline_toast',
							msg: 'Please check your internet connection and try again.'
						};
					} else if (code === 19999) {
						errInfo = {
							type: window === top ? 'toast' : 'inline_toast',
							msg: 'Sorry，something went wrong. Please try again later.'
						};
					} else if (errorType === 'phone') {
						errInfo = {
							type: 'phoneError',
							msg: errorMsg
						};
					} else if (errorType === 'psd') {
						errInfo = {
							type: 'passwordError',
							msg: errorMsg
						};
					} else if (errorType === 'code') {
						errInfo = {
							type: 'codeError',
							msg: errorMsg
						};
					}
					reject(errInfo);
				}
			}).catch(err => {
				const errInfo = {
					type: window === top ? 'toast' : 'inline_toast',
					msg: err.message || defaultError
				};
				reject(errInfo);
			});
		});
	},

	/*
	register by sending sms
	params: token
	 */
	verfiySms({ commit, state, dispatch }) {
		// commit(mutationTypes.HNADLE_ERROR, null);

		return new Promise((resolve, reject) => {
			fetch('/patron/account/create', {
				method: 'POST',
				body: Object.assign(tempParams, {
					token: state.token || null,
					type: 2
				})
			}).then(res => res.json()).then(data => {
				commit(mutationTypes.SAVE_TOKEN, data.data);

				const code = data.bizCode;
				if (code === 10000) {
					cookie('phone', state.account || '', {
						path: '/',
						expires: 365
					});
					resolve(data);
				} else {
					let errInfo = {};
					const errorMsg = data.message || defaultError;
					if (code === 11800) {
						errInfo = {
							type: 'inline',
							msg: errorMsg
						};
					} else if (code === 11810) {
						// 回到注册首页
						// commit(mutationTypes.HNADLE_ERROR, {
						// 	type: window === top ? 'dialog' : 'inline',
						// 	moduleName: 'index',
						// 	msg: 'Please check your internet connection and try again.'
						// });
						errInfo = {
							type: window === top ? 'dialog' : 'inline',
							moduleName: 'index',
							msg: 'Please check your internet connection and try again.'
						};
					} else {
						errInfo = {
							type: window === top ? 'toast' : 'inline_toast',
							msg: errorMsg
						};
					}

					reject(errInfo);
				}
			}).catch(err => {
				const errInfo = {
					type: window === top ? 'toast' : 'inline_toast',
					msg: err.message || defaultError
				};
				reject(errInfo);
			});
		});
	},

	/*
	get code
	params: phone & bizType
	 */
	getCode({ commit, state }, params) {
		tempParams = params;

		return new Promise((resolve, reject) => {
			fetch('/patron/verifyCode/sms', {
				method: 'POST',
				body: {
					bizType: 'REGISTER',
					phone: params.phone
				}
			}).then(res => res.json()).then(data => {
				const originData = data.data || {},
					code = data.bizCode,
					errorMsg = data.message || defaultError;

				const errorType = getErrorInfo(code);
				(!errorType || errorType !== 'phone') && commit(mutationTypes.UPDATE_ACCOUNT, params.phone);

				commit(mutationTypes.SAVE_TOKEN, originData);

				if (code === 10000) {
					commit(mutationTypes.SAVE_SMS_INFO, originData);
					resolve(data);
				} else {
					let errInfo = {};
					if ([11600, 11602, 11605].includes(code)) {
						const homePath = `${protocol}//${domain}${baseUrl}`,
							loginPath = `${homePath}independent_login?okUrl=${encodeURIComponent(homePath)}`;
						errInfo = {
							type: 'phoneError',
							msg: `${errorMsg} Please try to <a href="${loginPath}" class="t-highlight">Log In</a>`
						};
					} else if (code === 11703) {
						commit(mutationTypes.SAVE_SMS_INFO, originData);
						if (!params.password) {
							errInfo = {
								type: 'psdEmpty'
							};
						} else {
							errInfo = {
								type: 'smsExceeded',
								msg: errorMsg
							};
						}
					} else if (code === 11810) {
						// Invalid token
						errInfo = {
							// type: window === top ? 'toast' : 'inline_toast',
							type: 'invalidToken',
							msg: 'Your session has timed out. Please try again.'
						};
					} else if (errorType) {
						if (errorType === 'phone') {
							errInfo = {
								type: 'phoneError',
								msg: errorMsg
							};
						} else if (errorType === 'code') {
							errInfo = {
								type: 'codeError',
								msg: errorMsg
							};
						}
					} else {
						errInfo = {
							type: window === top ? 'toast' : 'inline_toast',
							msg: errorMsg
						};
					}
					reject(errInfo);
				}
			}).catch(err => {
				const errInfo = {
					type: window === top ? 'toast' : 'inline_toast',
					msg: err.message || defaultError
				};
				return reject(errInfo);
			});
		});
	},

	/*
	设置邀请码
	 */
	setReferralCode({ commit, state }, params) {
		const referralCode = (params && params.code) || state.referralCode;

		if (referralCode) {
			return new Promise((resolve, reject) => {
				fetch('/patron/account/inviteCode', {
					method: 'POST',
					body: {
						inviteCode: referralCode,
						creativeId: getCreativeId(),
						source: getReferrerSource()
					}
				})
				.then(res => res.json())
				.then(ret => {
					resolve();
				})
				.catch(err => { // eslint-disable-line
					resolve();
				});
			});
		}
	},

	// 检测注册是否需要验证码
	detectIgnoreVcode({
		state,
		commit
	}) {
		fetch('/patron/account/create/ignoreVcode', {
			method: 'GET'
		}).then(res => res.json()).then(res => {
			if (res.bizCode === 10000) {
				commit(mutationTypes.UPDATE_IGNORE_VCODE, res.data);
			}
		});
	}
};
