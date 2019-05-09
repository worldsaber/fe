import * as type from './mutationTypes';

export default {
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

	[type.UPDATE_ACCOUNT](state, account) {
		state.account = account;
	},

	/*
	save token
	 */
	[type.SAVE_TOKEN](state, data) {
		const originData = data || {};

		originData.token && (state.token = originData.token);
	},

	[type.UPDATE_IGNORE_VCODE](state, data) {
		state.ignoreVcode = data;
	}
};
