import * as type from './mutationTypes';

export default {
	/*
	handle error
	 */
	[type.HNADLE_ERROR](state, data) {
		state.errorInfo = data;
	},

	/*
	get code
	 */
	[type.SAVE_SMS_INFO](state, data) {
		const smsData = data || {};

		(typeof smsData.smsNumber !== 'undefined') && (state.smsNumber = smsData.smsNumber);
		(typeof smsData.msgContent !== 'undefined') && (state.msgContent = smsData.msgContent);

		if (typeof smsData.remainMsgNum !== 'undefined') {
			state.remainMsgNum = smsData.remainMsgNum;
		} else {
			state.remainMsgNum = -1;
		}
	},

	/*
	set request state
	 */
	[type.UPDATE_REQUSET_STATE](state, status) {
		state.reqLoading = status;
	},

	/*
	save token
	 */
	[type.SAVE_TOKEN](state, data) {
		const originData = data || {};

		originData.token && (state.token = originData.token);
	},

	[type.UPDATE_MODULE_NAME](state, name) {
		state.moduleName = name;
	},

	[type.RESETCODEINFO](state, resetStatus) {
		state.moduleName = '';
		state.remainMsgNum = state.msgThreshold;

		if (resetStatus) {
			state.errorInfo = {};
			state.reqLoading = false;
		}
	}
};
