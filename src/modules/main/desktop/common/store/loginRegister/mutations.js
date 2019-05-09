// import commonEvent from 'config/eventConfig/commonEvent';
// import { EventBus } from 'kernel/js/eventBus.js';

import * as type from '../changePsd/mutationTypes';

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
		state.account = account;
		// EventBus.$emit(commonEvent.UPDATE_ACCOUNT, account);
	},

	/*
	set next page name
	pageName: 下一个module, 不传返回上一个页面，''返回首页
	 */
	[type.UPDATE_NEXT_PAGE](state, pageName) {
		// 返回
		if (typeof pageName === 'undefined') {
			state.modulePath.pop();
			state.moduleName = state.modulePath[state.modulePath.length - 1];
			return;
		}

		state.moduleName = pageName;

		state.psdError = false;
		state.phoneError = false;
		state.errorInfo = null;

		// 重置为首页
		if (pageName === '') {
			state.modulePath.splice(1);
			return;
		}

		// sms与code互斥，只能出现一个
		if (pageName === 'sms') {
			const codeIndex = state.modulePath.indexOf('code');
			if (codeIndex !== -1) {
				// code页跳转到sms页，sms页替换掉code页面
				state.modulePath.splice(codeIndex, 1, pageName);
			} else {
				// 首页跳转到sms页，sms页入栈
				!state.modulePath.includes('sms') && state.modulePath.push(pageName);
			}
			return;
		}

		const inExist = state.modulePath.includes(pageName);
		// 不存在，直接入栈
		if (!inExist) {
			pageName && state.modulePath.push(pageName);
		} else {
			// 存在，出栈使当前值为栈顶
			const index = state.modulePath.indexOf(pageName);
			state.modulePath.splice(index + 1);
		}
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
	// },

	// update success ad
	[type.UPDATE_PROMOTION_AD](state, adObj = {}) {
		const adSpots = adObj.adSpots || [];

		for (const adItem of adSpots) {
			state.promotionAd = adItem.ads || null;
		}
	},

	// update referralCode
	[type.UPDATE_REFERRAL_CODE](state, code = '') {
		state.referralCode = code;
	},

	[type.UPDATE_SUC_CFG](state, cfg) {
		state.sucCfg = cfg || '';
	}
};
