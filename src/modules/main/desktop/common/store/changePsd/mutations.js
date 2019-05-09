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

	[type.UPDATE_ACCOUNT](state, account) {
		(typeof account !== 'undefined') && (state.account = account);
	},

	/*
	set next page name
	 */
	[type.UPDATE_NEXT_PAGE](state, pageName) {
		state.moduleName = pageName;

		state.psdError = false;
		state.phoneError = false;
		state.errorInfo = null;
	},

	/*
	set request state
	 */
	[type.UPDATE_REQUSET_STATE](state, status) {
		state.requesting = status;
	},

	/*
	save token
	 */
	[type.SAVE_TOKEN](state, data) {
		const originData = data || {};

		originData.token && (state.token = originData.token);
	},

	// update token status
	// [type.UPDATE_TOKEN_STATUS](state, status = false) {
	// 	state.tokenUnaviable = status;
	// }
};
