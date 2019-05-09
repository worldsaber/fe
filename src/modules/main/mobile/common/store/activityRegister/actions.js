import md5 from 'blueimp-md5';
import { cookie } from 'storage';

import { getCreativeId, getReferrerSource } from 'utils/channel';
import { protocol, domain, baseUrl } from 'config/pageConfig';

import * as mutationTypes from './mutationTypes';
import { getErrorInfo } from './commonFun';

// import '../../../mockData/activityRegister/index?debug';

const defaultError = 'No internet connection, try again.';

let tempParams;

const stakeMap = {
	ke: 500000,
	ng: 1000000,
	gh: 10000
};

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
		if (!params || !params.password || !params.phone || (!params.phoneVerifyCode && !state.ignoreVcode)) {
			console.log(`register params: ${JSON.stringify(params)}`);
			return;
		}

		if (!state.token && !state.ignoreVcode) {
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
			request.then(res => {
				commit(mutationTypes.UPDATE_REQUSET_STATE, false);
				return res.json();
			}).then(data => {
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

					dispatch('setReferralCode').then(() => {
						commit(mutationTypes.UPDATE_NEXT_PAGE, 'success');
						resolve(data);
					});
				} else {
					const errorMsg = data.message || defaultError;
					if ([11600, 11602, 11605].includes(code)) {
						const homePath = `${protocol}//${domain}${baseUrl}`,
							loginPath = `${homePath}independent_login?okUrl=${encodeURIComponent(homePath)}`;
						commit(mutationTypes.HNADLE_ERROR, {
							isPhoneError: errorType === 'phone',
							msg: `${errorMsg} Please try to <a href="${loginPath}" class="t-highlight">Log In</a>`
						});
					} else if (code === 11810) {
						commit(mutationTypes.HNADLE_ERROR, {
							type: window === top ? 'toast' : 'inline_toast',
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
					type: window === top ? 'toast' : 'inline_toast',
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
					type: 2
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
							type: window === top ? 'toast' : 'inline_toast',
							msg: errorMsg
						});
					}

					reject(data);
				}
			}).catch(err => {
				commit(mutationTypes.UPDATE_REQUSET_STATE, false);
				commit(mutationTypes.HNADLE_ERROR, {
					type: window === top ? 'toast' : 'inline_toast',
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
						const homePath = `${protocol}//${domain}${baseUrl}`,
							loginPath = `${homePath}independent_login?okUrl=${encodeURIComponent(homePath)}`;
						commit(mutationTypes.HNADLE_ERROR, {
							isPhoneError: errorType === 'phone',
							msg: `${errorMsg} Please try to <a href="${loginPath}" class="t-highlight">Log In</a>`
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
					} else if (code === 11705) {
						commit(mutationTypes.HNADLE_ERROR, {
							type: window === top ? 'toast' : 'inline_toast',
							msg: data.message || 'We can only send you a verification code 5 times within 24 hours.'
						});
					} else if (code === 11810) {
						commit(mutationTypes.HNADLE_ERROR, {
							type: window === top ? 'toast' : 'inline_toast',
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
							type: window === top ? 'toast' : 'inline_toast',
							msg: errorMsg
						});
					}
					reject(data);
				}
			}).catch(err => {
				commit(mutationTypes.UPDATE_REQUSET_STATE, false);
				commit(mutationTypes.HNADLE_ERROR, {
					type: window === top ? 'toast' : 'inline_toast',
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
				.catch(() => {
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
	},

	fetchMarketData({ state, commit }) {
		return new Promise((resolve, reject) => {
			fetch('/factsCenter/coinsActivityEvent', {
				method: 'GET'
			}).then(res => res.json()).then(res => {
				if (res.bizCode === 10000) {
					commit(mutationTypes.UPDATE_MARKET_DATA, res.data);
					resolve();
				} else {
					reject();
				}
			}).catch(e => {
				console.log(e);
				reject();
			});
		});
	},

	checkCoins({ state, commit, dispatch }) {
		fetch(`pocket/c1/activity/sportycoins/checkCoinsStatus?phoneNo=${cookie('phone')}`, {
			method: 'GET'
		}).then(res => res.json()).then(res => {
			if (res.bizCode === 10000) {
				if (res.data.status === 1) {
					dispatch('sendOrder');
				} else {
					commit(mutationTypes.UPDATE_BET_STATUS, 'fail');
					document.querySelector('#pageLoading').style.display = 'none';
				}
			}
		}).catch(e => {
			console.log(e);
			commit(mutationTypes.UPDATE_BET_STATUS, 'fail');
			document.querySelector('#pageLoading').style.display = 'none';
		});
	},

	sendOrder({ state, commit }) {
		const t = new Headers();
		t.append('Content-Type', 'application/json;charset=UTF-8');
		t.append('OperId', window.operId);

		const params = {
			bizType: 1,
			orderType: 1,
			actualPayAmount: 0,
			currency: window.currency,
			ticket: {
				selections: [{
					banker: false,
					eventId: state.eventId,
					id: `uof:3/sr:sport:1/${state.marketId}/${state.id}`,
					odds: state.odds
				}],
				bets: [{
					selectedSystems: [1],
					stake: {
						value: stakeMap[window.country]
					}
				}]
			},
			paymentType: 1 // 表示用sportyCoins付账
		};
		fetch('/orders/order', {
			method: 'POST',
			headers: t,
			body: JSON.stringify(params)
		})
			.then(res => res.json())
			.then(res => {
				console.log('sendOrderData', res);
				if (res.bizCode === 10000) {
					commit(mutationTypes.UPDATE_BET_STATUS, 'success');
					commit(mutationTypes.UPDATE_ORDER_ID, res.data.orderId);
				} else if (res.bizCode === 5000) {
					commit(mutationTypes.UPDATE_BET_STATUS, 'pending');
				} else {
					commit(mutationTypes.UPDATE_BET_STATUS, 'fail');
				}
				document.querySelector('#pageLoading').style.display = 'none';
			})
			.catch(res => {
				console.log(res);
				commit(mutationTypes.UPDATE_BET_STATUS, 'fail');
				document.querySelector('#pageLoading').style.display = 'none';
			});
	},
};
