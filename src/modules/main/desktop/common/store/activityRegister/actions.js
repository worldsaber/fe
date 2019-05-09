import md5 from 'blueimp-md5';
import { cookie } from 'storage';

import { getCreativeId, getReferrerSource } from 'utils/channel';
import { protocol, domain, baseUrl } from 'config/pageConfig';

import * as mutationTypes from './mutationTypes';
import { getErrorInfo } from './commonFun';

// import '../../../mockData/activityRegister/index?debug';

const defaultError = 'No internet connection, try again.';

let tempParams;

export default {
	/*
	register
	params: phone & password & code
	return: token
	 */
	register({
		commit,
		state,
		dispatch
	}, params) {
		if (!params || !params.password || !params.phone || !params.phoneVerifyCode) {
			window.__debug__ && console.log(`register params: ${JSON.stringify(params)}`);
			return;
		}

		if (!state.token) {
			commit(mutationTypes.HNADLE_ERROR, {
				msg: 'Incorrect code. Please try again.',
				isCodeError: true
			});
			return;
		}

		tempParams = params;

		commit(mutationTypes.HNADLE_ERROR, null);
		commit(mutationTypes.UPDATE_REQUSET_STATE, true);

		params.password = md5(params.password);

		return new Promise((resolve, reject) => {
			fetch('/patron/account/create', {
				method: 'POST',
				body: Object.assign(params, {
					token: state.token || null,
					type: 1
				})
			}).then(res => {
				commit(mutationTypes.UPDATE_REQUSET_STATE, false);
				return res.json();
			}).then(data => {
				const code = data.bizCode,
					originData = data.data;

				const errorType = getErrorInfo(code);
				(!errorType || errorType !== 'phone') && commit(mutationTypes.UPDATE_ACCOUNT, params.phone);

				commit(mutationTypes.SAVE_TOKEN, originData);

				if (code === 10000) {
					// 写入cookie
					cookie('phone', state.account || '', {
						path: '/',
						expires: 365
					});

					dispatch('setReferralCode').then(() => {
						commit(mutationTypes.UPDATE_NEXT_PAGE, 'success');
						resolve(data);
					});
				} else {
					const errorMsg = data.message || defaultError;
					if ([11600, 11602, 11605].includes(code)) {
						commit(mutationTypes.HNADLE_ERROR, {
							isPhoneError: errorType === 'phone',
							msg: `${errorMsg} Please try to <a href="${protocol}//${domain}${baseUrl}" class="t-highlight">Log In</a>`
						});
					} else if (code === 11810) {
						commit(mutationTypes.HNADLE_ERROR, {
							type: window === top ? 'dialog' : 'inline',
							msg: 'Please check your internet connection and try again.'
						});
					} else if (code === 19999) {
						commit(mutationTypes.HNADLE_ERROR, {
							type: window === top ? 'toast' : 'inline_toast',
							msg: 'Sorry，something went wrong. Please try again later.'
						});
					} else {
						commit(mutationTypes.HNADLE_ERROR, {
							msg: errorMsg,
							isPhoneError: errorType === 'phone',
							isPsdError: errorType === 'psd',
							isCodeError: errorType === 'code'
						});
					}
					reject(data);
				}
			}).catch(err => {
				commit(mutationTypes.UPDATE_REQUSET_STATE, false);

				commit(mutationTypes.HNADLE_ERROR, {
					type: window === top ? 'dialog' : 'inline',
					msg: err.message || defaultError
				});

				reject(err);
			});
		});
	},

	/*
	register by sending sms
	params: token
	 */
	verfiySms({
		commit,
		state,
		dispatch
	}) {
		commit(mutationTypes.HNADLE_ERROR, null);
		commit(mutationTypes.UPDATE_REQUSET_STATE, true);

		return new Promise((resolve, reject) => {
			fetch('/patron/account/create', {
				method: 'POST',
				body: Object.assign(tempParams, {
					token: state.token || null,
					type: 2,
					phoneVerifyCode: null
				})
			}).then(res => {
				commit(mutationTypes.UPDATE_REQUSET_STATE, false);
				return res.json();
			}).then(data => {
				commit(mutationTypes.SAVE_TOKEN, data.data);

				const code = data.bizCode;
				if (code === 10000) {
					cookie('phone', state.account || '', {
						path: '/',
						expires: 365
					});

					dispatch('setReferralCode').then(() => {
						commit(mutationTypes.UPDATE_NEXT_PAGE, 'success');
						resolve(data);
					});
				} else {
					const errorMsg = data.message || defaultError;
					if (code === 11800) {
						commit(mutationTypes.HNADLE_ERROR, {
							type: 'inline',
							msg: errorMsg
						});
					} else if (code === 11810) {
						// 回到注册首页
						commit(mutationTypes.HNADLE_ERROR, {
							type: window === top ? 'dialog' : 'inline',
							moduleName: 'index',
							msg: 'Please check your internet connection and try again.'
						});
					} else {
						commit(mutationTypes.HNADLE_ERROR, {
							type: window === top ? 'dialog' : 'inline_toast',
							msg: errorMsg
						});
					}

					reject(data);
				}
			}).catch(err => {
				commit(mutationTypes.UPDATE_REQUSET_STATE, false);
				commit(mutationTypes.HNADLE_ERROR, {
					type: window === top ? 'dialog' : 'inline_toast',
					msg: err.message || defaultError
				});

				reject(err);
			});
		});
	},

	/*
	get code
	params: phone & bizType
	 */
	getCode({
		commit,
		state
	}, params) {
		commit(mutationTypes.HNADLE_ERROR, null);
		commit(mutationTypes.UPDATE_REQUSET_STATE, true);

		tempParams = params;

		return new Promise((resolve, reject) => {
			fetch('/patron/verifyCode/sms', {
				method: 'POST',
				body: {
					bizType: 'REGISTER',
					phone: params.phone
				}
			}).then(res => {
				commit(mutationTypes.UPDATE_REQUSET_STATE, false);
				return res.json();
			}).then(data => {
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
					if ([11600, 11602, 11605].includes(code)) {
						commit(mutationTypes.HNADLE_ERROR, {
							isPhoneError: errorType === 'phone',
							msg: `${errorMsg} Please try to <a href="${protocol}//${domain}${baseUrl}" class="t-highlight">Log In</a>`
						});
					} else if (code === 11703) {
						commit(mutationTypes.SAVE_SMS_INFO, originData);
						if (!params.password) {
							commit(mutationTypes.HNADLE_ERROR, {
								type: 'psdEmpty'
							});
						} else {
							commit(mutationTypes.UPDATE_NEXT_PAGE, 'sms');
						}
					} else if (code === 11810) {
						commit(mutationTypes.HNADLE_ERROR, {
							type: window === top ? 'dialog' : 'inline',
							msg: 'Please check your internet connection and try again.'
						});
					} else if (errorType) {
						commit(mutationTypes.HNADLE_ERROR, {
							msg: errorMsg,
							isPhoneError: errorType === 'phone',
							isCodeError: errorType === 'code'
						});
					} else {
						commit(mutationTypes.HNADLE_ERROR, {
							type: window === top ? 'dialog' : 'inline',
							msg: errorMsg
						});
					}

					reject(data);
				}
			}).catch(err => {
				commit(mutationTypes.UPDATE_REQUSET_STATE, false);
				commit(mutationTypes.HNADLE_ERROR, {
					type: window === top ? 'dialog' : 'inline',
					msg: err.message || defaultError
				});
				reject(err);
			});
		});
	},

	/*
	register success ad
	 */
	// getPromotionAd({
	// 	commit
	// }) {
	// 	commit(mutationTypes.HNADLE_ERROR, null);
	//
	// 	return new Promise((resolve, reject) => {
	// 		const t = new Headers();
	// 		t.append('Content-Type', 'application/json;charset=UTF-8');
	// 		t.append('OperId', window.operId);
	//
	// 		const params = {
	// 			adSpots: [
	// 				{
	// 					spotId: 'registerBanner',
	// 					preserve: ''
	// 				}
	// 			]
	// 		};
	//
	// 		fetch('/promotion/v1/sp/query', {
	// 			method: 'POST',
	// 			body: JSON.stringify(params),
	// 			headers: t
	// 		}).then(res => res.json())
	// 		.then(ret => {
	// 			const code = ret && ret.bizCode;
	//
	// 			if (code === 10000) {
	// 				commit(mutationTypes.UPDATE_PROMOTION_AD, ret.data || {});
	// 				resolve();
	// 			}
	// 		}).catch(err => {
	// 			resolve();
	// 		});
	// 	});
	// },

	/*
	设置邀请码
	 */
	setReferralCode({
		commit,
		state
	}, params) {
		const referralCode = params && params.code || state.referralCode;

		if (referralCode) {
			commit(mutationTypes.HNADLE_ERROR, null);

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
					// const code = ret.bizCode;
                    //
					// if (code !== 10000) {
					// 	commit(mutationTypes.HNADLE_ERROR, {
					// 		msg: ret.message || defaultError,
					// 		isReferralError: [11670, 11671].includes(code)
					// 	});
					// } else if (!state.referralCode) {
					// 	commit(mutationTypes.UPDATE_REFERRAL_CODE, referralCode);
					// }
					resolve();
				})
				.catch(err => { // eslint-disable-line
					resolve();
				});
			});
		}
	}
};
