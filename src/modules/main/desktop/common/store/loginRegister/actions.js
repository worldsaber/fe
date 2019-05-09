import md5 from 'blueimp-md5';
import { cookie } from 'storage';

import { EventBus } from 'kernel/js/eventBus.js';

import commonEvent from 'config/eventConfig/commonEvent';
import { pagePath } from 'config/pageConfig';

import { fbLogin } from 'base/js/fbLogin.js';

import { getCreativeId, getReferrerSource } from 'utils/channel';
import { isSupportSms } from 'config/msgConfig';

import * as mutationTypes from '../changePsd/mutationTypes';
import { getErrorInfo } from '../changePsd/commonFun';

import '../../../mockData/loginRegister/login?debug';
import '../../../mockData/loginRegister/register?debug';
import '../../../mockData/loginRegister/changePassword?debug';

const defaultError = 'No internet connection, try again.';
const supportSms = isSupportSms();

export default {
	/*
	login
	params: phone & password
	return: token
	 */
	login({
		commit,
		state
	}, params) {
		// commit(mutationTypes.UPDATE_ACCOUNT, params.phone);
		// commit(mutationTypes.UPDATE_REQUSET_STATE, true);
		commit(mutationTypes.HNADLE_ERROR, null);

		// 起始页，重置临时token状态
		// state.tokenUnaviable && commit(mutationTypes.UPDATE_TOKEN_STATUS, false);

		return new Promise((resolve, reject) => {
			fetch('/patron/accessToken', {
				method: 'POST',
				body: {
					username: params.phone,
					password: md5(params.password)
				}
			}).then(res => {
				commit(mutationTypes.UPDATE_REQUSET_STATE, false);
				return res.json();
			}).then(data => {
				const code = data.bizCode;

				const errorType = getErrorInfo(code);

				if (code === 10000) {
					commit(mutationTypes.UPDATE_NEXT_PAGE, '');

					cookie('phone', params.phone || '', {
						path: '/',
						expires: 365
					});

					// 更新登录状态
					window.loginStatus = true;

					// 广播登陆全局消息
					EventBus.$emit(commonEvent.UPDATE_LOGIN_STATUS);

					resolve(data);
				} else {
					commit(mutationTypes.UPDATE_NEXT_PAGE, 'login');

					const errorMsg = data.message || defaultError;
					// <span class="m-text-highlight">Find out more.</span>
					if (code === 11602 || code === 11605) {
						commit(mutationTypes.HNADLE_ERROR, {
							type: 'info',
							msg: `${data.message || ''}` || defaultError,
							isPhoneError: errorType === 'phone',
							isPsdError: errorType === 'psd'
						});
					} else {
						commit(mutationTypes.HNADLE_ERROR, {
							type: 'error',
							msg: errorMsg,
							isPhoneError: errorType === 'phone',
							isPsdError: errorType === 'psd'
						});
					}
					reject(data);
				}
			}).catch(err => {
				commit(mutationTypes.UPDATE_NEXT_PAGE, 'login');
				commit(mutationTypes.UPDATE_REQUSET_STATE, false);

				commit(mutationTypes.HNADLE_ERROR, {
					type: '',
					msg: err.message || defaultError
				});
				reject(err);
			});
		});
	},
	/*
	third party login
	 */
	thirdPartyLogin({
		commit,
		dispatch,
		state
	}, params) {
		// commit(mutationTypes.HNADLE_ERROR, null);

		fbLogin().then(res => {
			const fbToken = res && res.fbToken || '';

			if (fbToken) {
				return new Promise((resolve, reject) => {
					fetch('/patron/account/thirdParty', {
						method: 'POST',
						body: {
							thirdPartyToken: fbToken
						}
					}).then(res =>
						// commit(mutationTypes.UPDATE_REQUSET_STATE, false);
						res.json()).then(ret => {
							const code = ret.bizCode,
								originData = ret.data || {};

							if (code !== 19999) {
							// 从 cookies中删除fbToken
								cookie('fbToken', null, {
									path: '/'
								});
							}

							if (code === 10000) {
								//  登录成功
								cookie('phone', originData.phone || '', {
									path: '/',
									expires: 365
								});

								location.href = pagePath.home;
								return;
							}

							// 未绑定手机号码
							if (code === 11608 && originData.token) {
								cookie('lgToken', originData.token || '', {
									path: '/',
									expires: 1
								});

							// token在phone过期，重新获取code
							// if (state.moduleName === 'phone') {
								dispatch('verifyPhone', params || null);
							// 	return;
							// }

							// token在code页过期， 重新获取code
							// if (state.moduleName === 'code') {
							// 	dispatch('getCode', Object.assign({
							// 		bizType: 'THIRD_PARTY_BIND',
							// 		token: originData.token,
							// 		phone: state.account,
							// 		isThirdParty: true
							// 	}));
							// }
							}
						})
					.catch(err => { // eslint-disable-line
						commit(mutationTypes.UPDATE_REQUSET_STATE, false);

						// 从 cookies中删除fbToken
						cookie('fbToken', null, {
							path: '/'
						});
					});
				});
			}

			commit(mutationTypes.UPDATE_REQUSET_STATE, false);
			commit(mutationTypes.HNADLE_ERROR, {
				type: 'fb_error',
				msg: 'An error occurred while connecting to Facebook'
			});
		}, err => {
			if (err && err.fbLogin === false) {
				commit(mutationTypes.UPDATE_REQUSET_STATE, false);
				commit(mutationTypes.HNADLE_ERROR, {
					type: 'fb_error',
					msg: 'An error occurred while connecting to Facebook'
				});
			}
		});
	},

	/*
	register
	params: phone & password
	return: token
	 */
	register({
		commit,
		state
	}, params) {
		params.password && (params.password = md5(params.password));

		// commit(mutationTypes.UPDATE_ACCOUNT, params.phone);
		// commit(mutationTypes.UPDATE_REQUSET_STATE, true);
		commit(mutationTypes.HNADLE_ERROR, null);

		// 起始页，重置临时token状态
		// state.tokenUnaviable && commit(mutationTypes.UPDATE_TOKEN_STATUS, false);

		return new Promise((resolve, reject) => {
			fetch('/patron/account', {
				method: 'POST',
				body: params
			}).then(res => {
				commit(mutationTypes.UPDATE_REQUSET_STATE, false);
				return res.json();
			}).then(data => {
				const code = data.bizCode,
					originData = data.data;

				const errorType = getErrorInfo(code);

				commit(mutationTypes.SAVE_TOKEN, originData);

				if (code === 10000 || code === 11703 || code === 11705) {
					commit(mutationTypes.SAVE_SMS_INFO, originData);

					if (code === 10000 || code === 11705) {
						// code短信数量未超过上限，可以继续获取code
						commit(mutationTypes.UPDATE_NEXT_PAGE, 'code');
					}

					if (code === 11703) {
						// code短信数量超过上限，只能通过上行短信注册
						commit(mutationTypes.UPDATE_NEXT_PAGE, 'sms');
					}

					if (code === 11705) {
						commit(mutationTypes.HNADLE_ERROR, {
							type: 'content',
							msg: data.message || defaultError,
							moduleName: 'login',
						});
						commit(mutationTypes.SAVE_SMS_INFO, null);
					}

					// 更新手机号码
					commit(mutationTypes.UPDATE_ACCOUNT, params.phone);

					resolve(data);
				} else {
					commit(mutationTypes.UPDATE_NEXT_PAGE, 'login');

					const errorMsg = data.message || defaultError;
					// <span class="m-text-highlight">Find out more.</span>
					if (code === 11602 || code === 11605) {
						commit(mutationTypes.HNADLE_ERROR, {
							type: 'info',
							msg: errorMsg,
							isPhoneError: errorType === 'phone',
							isPsdError: errorType === 'psd'
						});
					} else {
						commit(mutationTypes.HNADLE_ERROR, {
							type: 'error',
							msg: errorMsg,
							isPhoneError: errorType === 'phone',
							isPsdError: errorType === 'psd'
						});
					}

					reject(data);
				}
			}).catch(err => {
				commit(mutationTypes.UPDATE_NEXT_PAGE, 'login');
				commit(mutationTypes.UPDATE_REQUSET_STATE, false);

				commit(mutationTypes.HNADLE_ERROR, {
					type: '',
					msg: err.message || defaultError
				});

				reject(err);
			});
		});
	},

	/*
	verify code
	param: token phoneVerifyCode
	 */
	verfiyCode({
		commit,
		state,
		dispatch
	}, params) {
		// commit(mutationTypes.UPDATE_REQUSET_STATE, true);

		commit(mutationTypes.HNADLE_ERROR, null);

		return new Promise((resolve, reject) => {
			fetch(`/patron/account/${state.account}/complete`, {
				method: 'PUT',
				body: {
					token: state.token,
					phoneVerifyCode: params.code
				}
			}).then(res => {
				commit(mutationTypes.UPDATE_REQUSET_STATE, false);
				return res.json();
			}).then(data => {
				const code = data.bizCode;

				if (code === 10000) {
					cookie('phone', state.account || '', {
						path: '/',
						expires: 365
					});

					dispatch('getSucCfg').then(() => {
						commit(mutationTypes.UPDATE_NEXT_PAGE, 'success');
						resolve(data);
					});
				} else {
					if (code === 11810) {
						// 回到注册首页
						commit(mutationTypes.HNADLE_ERROR, {
							type: 'dialog',
							moduleName: 'login',
							msg: 'Your session has timed out. Please try again.'
						});

						// token失效
						// commit(mutationTypes.UPDATE_TOKEN_STATUS, true);
					} else {
						commit(mutationTypes.UPDATE_NEXT_PAGE, 'code');
						commit(mutationTypes.HNADLE_ERROR, {
							type: 'error',
							msg: data.message || defaultError,
							isCodeError: [11700, 11701, 11702].includes(code) || false
						});
					}

					reject(data);
				}
			}).catch(err => {
				commit(mutationTypes.UPDATE_NEXT_PAGE, 'code');
				commit(mutationTypes.UPDATE_REQUSET_STATE, false);

				commit(mutationTypes.HNADLE_ERROR, {
					type: '',
					msg: err.message || defaultError
				});

				reject(err);
			});
		});
	},

	/*
	register or login by sending sms
	params: token
	 */
	verfiySms({
		commit,
		state,
		dispatch
	}, params) {
		// commit(mutationTypes.UPDATE_REQUSET_STATE, true);

		commit(mutationTypes.HNADLE_ERROR, null);

		return new Promise((resolve, reject) => {
			fetch(`/patron/account/${state.account}/completeBySms`, {
				method: 'PUT',
				body: {
					token: state.token
				}
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

					dispatch('getSucCfg').then(() => {
						commit(mutationTypes.UPDATE_NEXT_PAGE, 'success');
						resolve(data);
					});
				} else {
					const errorMsg = data.message || defaultError;
					if (code === 11800) {
						commit(mutationTypes.HNADLE_ERROR, {
							type: 'dialog',
							moduleName: 'sms',
							title: 'Certificate validation failure',
							msg: 'We have not received your SMS. Please try again or contact us.'
						});
					} else if (code === 11810) {
						// 回到注册首页
						commit(mutationTypes.HNADLE_ERROR, {
							type: 'dialog',
							moduleName: 'login',
							msg: 'Your session has timed out. Please try again.'
						});

						// token失效
						// commit(mutationTypes.UPDATE_TOKEN_STATUS, true);
					} else {
						commit(mutationTypes.UPDATE_NEXT_PAGE, 'sms');
						commit(mutationTypes.HNADLE_ERROR, {
							type: 'error',
							msg: errorMsg
						});
					}

					reject(data);
				}
			}).catch(err => {
				commit(mutationTypes.UPDATE_NEXT_PAGE, 'sms');
				commit(mutationTypes.UPDATE_REQUSET_STATE, false);

				commit(mutationTypes.HNADLE_ERROR, {
					type: '',
					msg: err.message || defaultError
				});

				reject(err);
			});
		});
	},

	/*
	第三方平台，通过上行短信注册，验证短信是否发送
	params: token
	 */
	verifyThirdPartySms({
		commit,
		state,
		dispatch
	}, params) {
		commit(mutationTypes.HNADLE_ERROR, null);

		return new Promise((resolve, reject) => {
			fetch('/patron/account/completeThirdPartyBySms', {
				method: 'PUT',
				body: {
					token: state.token
				}
			}).then(res => {
				commit(mutationTypes.UPDATE_REQUSET_STATE, false);
				return res.json();
			}).then(data => {
				const code = data.bizCode;

				if (code === 10000) {
					cookie('phone', params.phone || '', {
						path: '/',
						expires: 365
					});

					dispatch('getSucCfg').then(() => {
						commit(mutationTypes.UPDATE_NEXT_PAGE, 'success');
						resolve(data);
					});
				} else {
					const errorMsg = data.message || defaultError;
					if (code === 11800) {
						commit(mutationTypes.HNADLE_ERROR, {
							type: 'dialog',
							moduleName: 'sms',
							title: 'Certificate validation failure',
							msg: 'We have not received your SMS. Please try again or contact us.'
						});
					} else if (code === 11810) {
						// facebook登录回到手机号页面
						commit(mutationTypes.HNADLE_ERROR, {
							type: 'dialog',
							moduleName: 'phone',
							msg: 'Your session has timed out. Please try again.'
						});

						// token失效
						// commit(mutationTypes.UPDATE_TOKEN_STATUS, true);
					} else {
						commit(mutationTypes.UPDATE_NEXT_PAGE, 'sms');
						commit(mutationTypes.HNADLE_ERROR, {
							type: 'dialog',
							msg: errorMsg || defaultError
						});
					}

					reject();
				}
			}).catch(err => {
				commit(mutationTypes.UPDATE_NEXT_PAGE, 'sms');
				commit(mutationTypes.UPDATE_REQUSET_STATE, false);

				commit(mutationTypes.HNADLE_ERROR, {
					type: 'dialog',
					msg: err.message || defaultError
				});

				reject();
			});
		});
	},

	/*
	get code
	params: phone & bizType
	第三方平台： token
	 */
	getCode({
		commit,
		state,
		dispatch
	}, params) {
		const isThirdParty = params.isThirdParty || false;
		delete params.isThirdParty;

		commit(mutationTypes.HNADLE_ERROR, null);

		// // 第三方平台登录，token失效时，重新唤起第三方登录
		// if (isThirdParty && state.tokenUnaviable) {
		// 	dispatch('thirdPartyLogin');
		// 	return;
		// }

		// facebook获取验证码，补齐参数
		if (isThirdParty && !params.phone) {
			params = {
				bizType: 'THIRD_PARTY_BIND',
				token: state.token,
				phone: state.account,
				isThirdParty: true
			};
		}

		return new Promise((resolve, reject) => {
			fetch('/patron/verifyCode/sms', {
				method: 'POST',
				body: params
			}).then(res => {
				commit(mutationTypes.UPDATE_REQUSET_STATE, false);
				return res.json();
			}).then(data => {
				const originData = data.data || {},
					code = data.bizCode,
					remianSmsNum = +originData.remainMsgNum || 0,
					errorMsg = data.message || defaultError;

				commit(mutationTypes.SAVE_TOKEN, originData);

				// token之前失效，有新token，重置token的可用状态
				// state.tokenUnaviable && commit(mutationTypes.UPDATE_TOKEN_STATUS, false);

				if (isThirdParty) {
					cookie('lgToken', null, {
						path: '/'
					});
				}

				if (code === 10000) {
					commit(mutationTypes.SAVE_SMS_INFO, originData);
					commit(mutationTypes.UPDATE_NEXT_PAGE, 'code');

					if (!remianSmsNum) {
						// remianSmsNum == 0, 不能在继续发验证码，本次验证码有效
						if (isThirdParty) {
							commit(mutationTypes.HNADLE_ERROR, {
								type: supportSms ? 'replace' : 'content',
								moduleName: 'sms',
								msg: errorMsg
							});
						} else {
							commit(mutationTypes.HNADLE_ERROR, {
								type: 'dialog',
								moduleName: 'sms',
								msg: errorMsg
							});
						}
					}

					resolve(data);
				} else {
					if (code === 11705) {
						commit(mutationTypes.UPDATE_NEXT_PAGE, 'code');
						commit(mutationTypes.HNADLE_ERROR, {
							type: 'content',
							msg: errorMsg || defaultError,
							moduleName: isThirdParty ? 'phone' : 'login',
						});
						commit(mutationTypes.SAVE_SMS_INFO, {});
					} else if (code === 11703) {
						commit(mutationTypes.SAVE_SMS_INFO, originData);

						if (isThirdParty) {
							commit(mutationTypes.UPDATE_NEXT_PAGE, 'sms');
						} else {
							commit(mutationTypes.HNADLE_ERROR, {
								type: 'dialog',
								moduleName: 'sms',
								msg: errorMsg
							});
						}
					} else if (code === 11810) {
						if (isThirdParty) {
							// facebook登录，回到phone
							commit(mutationTypes.HNADLE_ERROR, {
								type: 'dialog',
								moduleName: 'phone',
								msg: 'Your session has timed out. Please try again.'
							});
						} else {
							// 回到注册首页
							commit(mutationTypes.HNADLE_ERROR, {
								type: 'dialog',
								moduleName: 'login',
								msg: 'Your session has timed out. Please try again.'
							});
						}

						// token失效
						// commit(mutationTypes.UPDATE_TOKEN_STATUS, true);
					} else {
						commit(mutationTypes.UPDATE_NEXT_PAGE, 'code');
						if (isThirdParty) {
							commit(mutationTypes.HNADLE_ERROR, {
								type: 'fb_error',
								msg: 'An error occurred while connecting to Facebook'
							});
						} else {
							commit(mutationTypes.HNADLE_ERROR, {
								type: 'error',
								msg: errorMsg
							});
						}
					}
					reject(data);
				}
			}).catch(err => {
				commit(mutationTypes.UPDATE_NEXT_PAGE, 'code');
				commit(mutationTypes.UPDATE_REQUSET_STATE, false);
				if (isThirdParty) {
					commit(mutationTypes.HNADLE_ERROR, {
						type: 'fb_error',
						msg: 'An error occurred while connecting to Facebook'
					});
				} else {
					commit(mutationTypes.HNADLE_ERROR, {
						type: '',
						msg: err.message || defaultError
					});
				}
				reject(err);
			});
		});
	},

	/*
	验证手机号码格式
	 */
	verifyPhone({
		commit,
		dispatch,
		state
	}, params) {
		commit(mutationTypes.HNADLE_ERROR, null);

		// 起始页，重置临时token状态
		// state.tokenUnaviable && commit(mutationTypes.UPDATE_TOKEN_STATUS, false);

		return new Promise((resolve, reject) => {
			fetch('/patron/phone/checkStatus', {
				method: 'GET',
				body: {
					phone: params && params.phone || state.account
				}
			})
			.then(res => res.json())
			.then(data => {
				const code = data.bizCode;

				// 未注册手机号码，去获取验证码
				if (code === 11601) {
					const lgToken = cookie('lgToken');

					if (!lgToken) {
						// 没有临时token，先facebook登录，然后继续获取验证码
						dispatch('thirdPartyLogin', params);
					} else {
						// phone校验通过，存在在store中
						const tmpPhone = params && params.phone || '';
						tmpPhone && commit(mutationTypes.UPDATE_ACCOUNT, tmpPhone);
						// get code in order to get token
						resolve(dispatch('getCode', Object.assign({
							bizType: 'THIRD_PARTY_BIND',
							token: lgToken,
							phone: tmpPhone || state.account,
							isThirdParty: true
						})));
					}

					return;
				}

				// 已注册的手机号
				if ([11600, 11602, 11605].includes(code)) {
					commit(mutationTypes.UPDATE_REQUSET_STATE, false);
					commit(mutationTypes.HNADLE_ERROR, {
						type: 'dialog',
						msg: 'The mobile number is already associated with an account. A mobile number can be associated with one account only. If you have any questions, please contact us for more information.',
						isPhoneError: true
					});
				} else {
					// 格式错误
					commit(mutationTypes.UPDATE_REQUSET_STATE, false);
					commit(mutationTypes.HNADLE_ERROR, {
						type: '',
						msg: data.message || defaultError,
						isPhoneError: true
					});
				}
			}).catch(err => {
				commit(mutationTypes.UPDATE_REQUSET_STATE, false);

				commit(mutationTypes.HNADLE_ERROR, {
					type: '',
					msg: err.message || defaultError
				});
			});
		});
	},

	/*
	第三方：验证code
	params：token
	 */
	verifyThirdPartyCode({
		commit,
		state,
		dispatch
	}, params) {
		commit(mutationTypes.HNADLE_ERROR, null);

		return new Promise((resolve, reject) => {
			fetch('/patron/account/completeThirdParty', {
				method: 'PUT',
				body: {
					token: state.token,
					phoneVerifyCode: params.code
				}
			})
			.then(res => {
				commit(mutationTypes.UPDATE_REQUSET_STATE, false);
				return res.json();
			})
			.then(data => {
				const code = data.bizCode;

				// token之前失效，有新token，重置token的可用状态
				// state.tokenUnaviable && commit(mutationTypes.UPDATE_TOKEN_STATUS, false);

				if (code === 10000) {
					cookie('phone', params.phone || '', {
						path: '/',
						expires: 365
					});

					dispatch('getSucCfg').then(() => {
						commit(mutationTypes.UPDATE_NEXT_PAGE, 'success');
						resolve(data);
					});
				} else {
					if (code === 11810) {
						// facebook登录，回到phone
						commit(mutationTypes.HNADLE_ERROR, {
							type: 'dialog',
							moduleName: 'phone',
							msg: 'Your session has timed out. Please try again.'
						});

						// token失效
						// commit(mutationTypes.UPDATE_TOKEN_STATUS, true);
					} else {
						commit(mutationTypes.UPDATE_NEXT_PAGE, 'code');
						commit(mutationTypes.HNADLE_ERROR, {
							type: 'error',
							msg: data.message || defaultError,
							isCodeError: [11700, 11701, 11702].includes(code) || false
						});
					}

					reject();
				}
			}).catch(err => {
				commit(mutationTypes.UPDATE_NEXT_PAGE, 'code');
				commit(mutationTypes.UPDATE_REQUSET_STATE, false);

				commit(mutationTypes.HNADLE_ERROR, {
					type: '',
					msg: err.message || defaultError
				});

				reject();
			});
		});
	},
	/*
	register success ad
	 */
	getPromotionAd({
		commit
	}) {
		commit(mutationTypes.HNADLE_ERROR, null);

		return new Promise((resolve, reject) => {
			const t = new Headers();
			t.append('Content-Type', 'application/json;charset=UTF-8');
			t.append('OperId', window.operId);

			const params = {
				adSpots: [
					{
						spotId: 'registerBanner',
						preserve: ''
					}
				]
			};

			fetch('/promotion/v1/sp/query', {
				method: 'POST',
				body: JSON.stringify(params),
				headers: t
			}).then(res => res.json())
			.then(ret => {
				const code = ret && ret.bizCode;

				if (code === 10000) {
					commit(mutationTypes.UPDATE_PROMOTION_AD, ret.data || {});
					resolve();
				}
			})
			.catch(err => { // eslint-disable-line
				resolve();
			});
		});
	},

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
				.then(res => {
					commit(mutationTypes.UPDATE_REQUSET_STATE, false);
					return res.json();
				})
				.then(ret => {
					const code = ret.bizCode;

					if (code !== 10000) {
						commit(mutationTypes.HNADLE_ERROR, {
							msg: ret.message || defaultError,
							isReferralError: [11670, 11671].includes(code)
						});
					} else if (!state.referralCode) {
						commit(mutationTypes.UPDATE_REFERRAL_CODE, referralCode);
					}
				})
				.catch(err => { // eslint-disable-line
					state.requesting && commit(mutationTypes.UPDATE_REQUSET_STATE, false);
				});
			});
		}
	},

	getSucCfg({
		commit
	}) {
		return new Promise((resolve, reject) => {
			fetch('/marketing/v1/activities/firstDeposit/registrationSuccInfo', {
				method: 'GET'
			})
			.then(res => res.json())
			.then(res => {
				const { bizCode } = res;

				let temp;

				if (bizCode === 10000 && (temp = res.data) && (temp = temp.info)) {   // eslint-disable-line
					commit(mutationTypes.UPDATE_SUC_CFG, temp);
				}
				resolve();
			}).catch(() => {
				resolve();
			});
		});
	}
};
