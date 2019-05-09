import * as type from './mutationTypes';

const weekMap = {
	1: 'Mon',
	2: 'Tue',
	3: 'Wed',
	4: 'Thur',
	5: 'Fri',
	6: 'Sat',
	7: 'Sun'
};

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
	},

	[type.UPDATE_IGNORE_VCODE](state, val) {
		state.ignoreVcode = val;
	},

	[type.UPDATE_MARKET_DATA](state, data) {
		state.eventId = data.eventId;
		state.marketId = data.markets[0].id;
		const startTime = new Date(data.estimateStartTime);
		if (startTime.toDateString() === (new Date().toDateString())) {
			data.estimateStartTime = `Today ${startTime.getHours()}:${startTime.getMinutes()}`;
		} else {
			data.estimateStartTime = `${startTime.getDate()}/${startTime.getMonth() + 1} ${weekMap[startTime.getDay()]} ${startTime.getHours()}:${startTime.getMinutes()}`;
		}
		data.markets[0].outcomes.map(item => {
			item.isSelected = false;
			return item;
		});
		state.marketData = data;
	},

	[type.CLEAR_SELECTION](state) {
		state.marketData.markets[0].outcomes.map(item => {
			item.isSelected = false;
			return item;
		});
	},

	[type.UPDATE_ORDER_PARAMS](state, params) {
		state.id = params.id;
		state.odds = params.odds;
		state.potentialWin = params.potentialWin;
		state.pickedDesc = params.desc;
	},

	[type.UPDATE_BET_STATUS](state, data) {
		state.betStatus = data;
	},

	[type.UPDATE_ORDER_ID](state, id) {
		state.orderId = id;
	}
};
