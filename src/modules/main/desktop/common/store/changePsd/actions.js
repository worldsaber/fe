import md5 from 'blueimp-md5';
import { cookie } from 'storage';

import { isSupportSms } from 'config/msgConfig';

import * as mutationTypes from './mutationTypes';
import { getErrorInfo } from './commonFun';

import '../../../mockData/loginRegister/changePassword?debug';
import '../../../mockData/loginRegister/login?debug';
import '../../../mockData/loginRegister/register?debug';

const defaultError = 'No internet connection, try again.';
const supportSms = isSupportSms();

export default {
	/*
	verify phone
	params: phone
	return: token
	 */
	verifyPhone({
		commit,
		dispatch,
		state
	}, params) {
		// commit(mutationTypes.UPDATE_REQUSET_STATE, true);
		// update errorInfo
		commit(mutationTypes.HNADLE_ERROR, null);

		// 起始页，重置临时token状态
		// state.tokenUnaviable && commit(mutationTypes.UPDATE_TOKEN_STATUS, false);

		return new Promise((resolve, reject) => {
			fetch('/patron/phone/checkStatus', {
				method: 'GET',
				body: params
			}).then(res =>
				// commit(mutationTypes.UPDATE_REQUSET_STATE, false);
				res.json()).then(data => {
					const code = data.bizCode;

				// 已注册的手机号
					if (code === 11600) {
					// update moduleName
					// commit(mutationTypes.UPDATE_NEXT_PAGE, 'code');

					// update phone
						commit(mutationTypes.UPDATE_ACCOUNT, params.phone);

					// get code in order to get token
						resolve(dispatch('getCode', Object.assign(
						params,
							{
								bizType: 'PASSWORD_RESET',
								needValidate: true
							}
					)));
					} else {
						commit(mutationTypes.UPDATE_NEXT_PAGE, 'phone');
						commit(mutationTypes.UPDATE_REQUSET_STATE, false);

						const errorType = getErrorInfo(code);

						if (code === 11602 || code === 11605) {
							// <span class="m-text-highlight">Find out more.</span>
							commit(mutationTypes.HNADLE_ERROR, {
								type: 'info',
								msg: `${data.message}` || defaultError,
								isPhoneError: errorType === 'phone'
							});
						} else {
							commit(mutationTypes.HNADLE_ERROR, {
								type: '',
								msg: data.message || defaultError,
								isPhoneError: errorType === 'phone'
							});
						}
						reject(data);
					}
				}).catch(err => {
					commit(mutationTypes.UPDATE_NEXT_PAGE, 'phone');
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
	verify reset code
	params: token & phoneVerificationCode
	return: token
	 */
	verifyResetCode({
		commit,
		state
	}, params) {
		// commit(mutationTypes.UPDATE_REQUSET_STATE, true);
		// update errorInfo
		commit(mutationTypes.HNADLE_ERROR, null);

		return new Promise((resolve, reject) => {
			fetch('/patron/password/completeReset', {
				method: 'PUT',
				body: {
					token: state.token,
					phoneVerifyCode: params.code
				}
			}).then(res => {
				commit(mutationTypes.UPDATE_REQUSET_STATE, false);
				return res.json();
			}).then(data => {
				commit(mutationTypes.SAVE_TOKEN, data.data);

				// token之前失效，有新token，重置token的可用状态
				// state.tokenUnaviable && commit(mutationTypes.UPDATE_TOKEN_STATUS, false);

				const code = data.bizCode;
				if (code === 10000) {
					commit(mutationTypes.UPDATE_NEXT_PAGE, 'password');
					resolve(data);
				} else {
					if (code === 11810) {
						// 回到修改密码首页
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
							type: '',
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
	reset password
	params: token & password
	return: token
	 */
	resetPassword({
		commit,
		state
	}, params) {
		// commit(mutationTypes.UPDATE_REQUSET_STATE, true);
		// update errorInfo
		commit(mutationTypes.HNADLE_ERROR, null);

		return new Promise((resolve, reject) => {
			fetch('/patron/password/reset', {
				method: 'PUT',
				body: {
					token: state.token,
					password: md5(params.password)
				}
			}).then(res => {
				commit(mutationTypes.UPDATE_REQUSET_STATE, false);
				return res.json();
			}).then(data => {
				const code = data.bizCode;

				if (code === 10000) {
					commit(mutationTypes.UPDATE_NEXT_PAGE, 'login');
					resolve(data);
				} else {
					if (code === 11810) {
						// 回到修改密码首页
						commit(mutationTypes.HNADLE_ERROR, {
							type: 'dialog',
							moduleName: 'phone',
							msg: 'Your session has timed out. Please try again.'
						});

						// token失效
						// commit(mutationTypes.UPDATE_TOKEN_STATUS, true);
					} else {
						commit(mutationTypes.UPDATE_NEXT_PAGE, 'password');
						commit(mutationTypes.HNADLE_ERROR, {
							type: '',
							msg: data.message || defaultError
						});
					}

					reject(data);
				}
			}).catch(err => {
				commit(mutationTypes.UPDATE_NEXT_PAGE, 'password');
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
	get code
	params: phone & bizType
	 */
	getCode({
		commit,
		state
	}, params) {
		// commit(mutationTypes.UPDATE_REQUSET_STATE, true);
		const needValidate = params.needValidate || false;

		delete params.needValidate;

		// update errorInfo
		commit(mutationTypes.HNADLE_ERROR, null);

		return new Promise((resolve, reject) => {
			fetch('/patron/verifyCode/sms', {
				method: 'POST',
				body: params
			}).then(res => {
				commit(mutationTypes.UPDATE_REQUSET_STATE, false);
				return res.json();
			}).then(data => {
				const code = data.bizCode,
					originData = data.data || {},
					remianSmsNum = +originData.remainMsgNum || 0;

				commit(mutationTypes.SAVE_TOKEN, originData);

				// token之前失效，有新token，重置token的可用状态
				// state.tokenUnaviable && commit(mutationTypes.UPDATE_TOKEN_STATUS, false);

				if (code === 10000) {
					commit(mutationTypes.SAVE_SMS_INFO, originData);
					commit(mutationTypes.UPDATE_NEXT_PAGE, 'code');

					if (!remianSmsNum) {
						// remianSmsNum == 0, 只能发送短信
						commit(mutationTypes.HNADLE_ERROR, {
							type: supportSms ? 'replace' : 'content',
							moduleName: 'sms',
							msg: ''
						});
					}

					resolve(data);
				} else {
					const errorMsg = data.message || defaultError;

					if (code === 11705) {
						commit(mutationTypes.UPDATE_NEXT_PAGE, 'code');
						commit(mutationTypes.HNADLE_ERROR, {
							type: 'content',
							msg: errorMsg
						});
						commit(mutationTypes.SAVE_SMS_INFO, null);
					} else if (code === 11703) {
						commit(mutationTypes.SAVE_SMS_INFO, originData);

						if (needValidate) {
							commit(mutationTypes.UPDATE_NEXT_PAGE, 'sms');
						} else {
							commit(mutationTypes.HNADLE_ERROR, {
								type: 'replace',
								moduleName: 'sms',
								msg: ''
							});
						}
					} else {
						if (needValidate) {
							commit(mutationTypes.UPDATE_NEXT_PAGE, 'phone');
						} else {
							commit(mutationTypes.UPDATE_NEXT_PAGE, 'code');
						}

						commit(mutationTypes.HNADLE_ERROR, {
							type: 'error',
							msg: errorMsg
						});
					}
					reject(data);
				}
			}).catch(err => {
				if (needValidate) {
					commit(mutationTypes.UPDATE_NEXT_PAGE, 'phone');
				} else {
					commit(mutationTypes.UPDATE_NEXT_PAGE, 'code');
				}

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
	change password by sending sms
	params: token
	 */
	verfiySms({
		commit,
		state
	}, params) {
		// commit(mutationTypes.UPDATE_REQUSET_STATE, true);
		// update errorInfo
		commit(mutationTypes.HNADLE_ERROR, null);

		return new Promise((resolve, reject) => {
			fetch('/patron/password/completeResetBySms', {
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
					commit(mutationTypes.UPDATE_NEXT_PAGE, 'password');

					resolve(data);
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
						// 回到修改密码首页
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
	login
	params: username（phone） password
	 */
	login({
		commit
	}, params) {
		// commit(mutationTypes.UPDATE_REQUSET_STATE, true);

		// update errorInfo
		commit(mutationTypes.HNADLE_ERROR, null);

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
					// 登录成功跳转到首页
					commit(mutationTypes.UPDATE_NEXT_PAGE, '');
					cookie('phone', params.phone || '', {
						path: '/',
						expires: 365
					});
					resolve(data);
				} else {
					commit(mutationTypes.UPDATE_NEXT_PAGE, 'login');

					const errorMsg = data.message || defaultError;
					// <span class="m-text-highlight">Find out more.</span>
					if (code === 11602 || code === 11605) {
						commit(mutationTypes.HNADLE_ERROR, {
							type: 'dialog',
							msg: `${data.message}` || defaultError,
						});
					} else {
						commit(mutationTypes.HNADLE_ERROR, {
							type: 'error',
							msg: errorMsg,
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
	}
};
