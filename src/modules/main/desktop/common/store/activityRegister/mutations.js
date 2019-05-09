import * as type from './mutationTypes';

export default {
	/*
	handle error
	 */
	[type.HNADLE_ERROR](state, data) {
		state.errorInfo = data ? { ...data } : data;
	},

	[type.UPDATE_NEXT_PAGE](state, pageName) {
		state.moduleName = pageName;
		state.errorInfo = null;
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
		state.account = account;
	},

	/*
	save token
	 */
	[type.SAVE_TOKEN](state, data) {
		const originData = data || {};

		originData.token && (state.token = originData.token);
	},

	// request state
	[type.UPDATE_REQUSET_STATE](state, loading) {
		state.reqLoading = loading;
	},

	[type.UPDATE_COUNTRY_CODE](state, code) {
		state.countryCode = code;
	},

	// update success ad
	// [type.UPDATE_PROMOTION_AD](state, adObj = {}) {
	// 	const adSpots = adObj.adSpots || [];
	//
	// 	for (const adItem of adSpots) {
	// 		state.promotionAd = adItem.ads || null;
	// 	}
	// },

	// update referralCode
	[type.UPDATE_REFERRAL_CODE](state, code = '') {
		state.referralCode = code;
	}
};
