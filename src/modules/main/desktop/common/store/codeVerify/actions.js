import * as mutationTypes from './mutationTypes';

import '../../../mockData/loginRegister/changePassword?debug';
import '../../../mockData/loginRegister/login?debug';
import '../../../mockData/loginRegister/register?debug';

const defaultError = 'No internet connection, try again.';

export default {
	/*
	verify reset code
	params: token & phoneVerificationCode
	return: token
	 */
	verifyCode({
		commit,
		state
	}, params) {
		commit(mutationTypes.UPDATE_REQUSET_STATE, true);
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

				const code = data.bizCode;
				if (code === 10000) {
					commit(mutationTypes.UPDATE_MODULE_NAME, 'sucsess');
				} else {
					if (code === 11810) {
						// 过期回到首页
						commit(mutationTypes.HNADLE_ERROR, {
							type: 'dialog',
							isTimeout: true,
							msg: 'Your session has timed out. Please try again.'
						});
					} else {
						commit(mutationTypes.HNADLE_ERROR, {
							type: '',
							msg: data.message || defaultError,
							isCodeError: [11700, 11701, 11702].includes(code) || false
						});
					}

					reject(data);
				}
			}).catch(err => {
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
		commit(mutationTypes.UPDATE_REQUSET_STATE, true);
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
					originData = data.data || {};

				commit(mutationTypes.SAVE_TOKEN, originData);

				if (code === 10000) {
					commit(mutationTypes.SAVE_SMS_INFO, originData);
					commit(mutationTypes.UPDATE_MODULE_NAME, 'code');

					resolve(data);
				} else {
					const errorMsg = data.message || defaultError;

					if (code === 11703 || code === 11705) {
						commit(mutationTypes.SAVE_SMS_INFO, originData);

						if (!state.moduleName) {
							commit(mutationTypes.UPDATE_MODULE_NAME, 'sms');
						} else {
							commit(mutationTypes.HNADLE_ERROR, {
								type: 'dialog',
								moduleName: 'sms',
								msg: errorMsg
							});
						}
					} else {
						commit(mutationTypes.HNADLE_ERROR, {
							type: 'error',
							msg: errorMsg
						});
					}
					reject(data);
				}
			}).catch(err => {
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
		commit(mutationTypes.UPDATE_REQUSET_STATE, true);
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
					commit(mutationTypes.UPDATE_MODULE_NAME, 'sucsess');
					resolve(data);
				} else {
					const errorMsg = data.message || defaultError;
					if (code === 11800) {
						commit(mutationTypes.HNADLE_ERROR, {
							type: 'dialog',
							title: 'Certificate validation failure',
							msg: 'We have not received your SMS. Please try again or contact us.'
						});
					} else if (code === 11810) {
						// 过期
						commit(mutationTypes.HNADLE_ERROR, {
							type: 'dialog',
							isTimeout: true,
							msg: 'Your session has timed out. Please try again.'
						});
					} else {
						commit(mutationTypes.HNADLE_ERROR, {
							type: 'error',
							msg: errorMsg
						});
					}
					reject(data);
				}
			}).catch(err => {
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
