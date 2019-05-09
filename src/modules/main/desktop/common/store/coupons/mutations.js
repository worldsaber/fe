import dateFormat from 'kernel/js/dateFormat';

import { bizType, bizTypeValues, betTypeValues, betType, betType2Key } from 'config/couponsConfig';

import { formatMoneyShow } from 'config/showMoneyConfig';

import * as mutationTypes from './mutationTypes';
import { getGiftTips } from './commonFun';

export default {
	[mutationTypes.UPDATECOUPONSLIST](state, data = {}) {
		const { totalNum, entityList } = data;

		if (+totalNum === 0) {
			state.errorInfo = {
				type: 'empty'
			};
		}

		state.couponsCount = +totalNum;

		state.couponsKeys.splice(0);
		state.couponsList.splice(0);

		for (const gift of entityList) {
			if (!gift.curBal) {
				continue;
			}

			gift.isUsed = gift.initBal !== gift.curBal;

			// curBal国际标准单位*10000
			if (gift.curBal) {
				gift.originBal = gift.curBal;
				gift.curBal /= 10000;
				gift.showCurBal = formatMoneyShow(gift.curBal, false);
			}

			if (gift.initBal) {
				gift.showInitBal = formatMoneyShow(gift.initBal / 10000, false);
			}

			if (gift.leastOrderAmount) {
				gift.leastOrderAmount /= 10000;
				gift.showCondition = formatMoneyShow(gift.leastOrderAmount, false);
			}

			gift.maskTips = getGiftTips(gift.deviceChScope);

			gift.expireTime && (gift.showExpireTime = dateFormat.format(gift.expireTime, 'DD/MM/YYYY'));

			state.couponsKeys.push(gift.giftId);
			state.couponsList.push(gift);
		}

		const checkGifts = state.checkGifts || {},
			checkedKeys = Object.keys(state.checkGifts);
		for (const checkedKey of checkedKeys) {
			if (!state.couponsKeys.includes(checkGifts[checkedKey])) {
				checkGifts[checkedKey] = '';
			}
		}
	},

	// update checked gift id
	[mutationTypes.UPDATECHECKEDGIFTID](state, option = {}) {
		let { giftId, type, clear } = option;

		if (clear) {
			state.checkGifts = {};
			state.skipStausMap = {};
			state.clickedGiftId = '';
			return;
		}

		if (!type) {
			type = betType2Key[state.betType];
		}

		// 存储当前betType下使用的红包id
		const checkGifts = Object.assign(
			state.checkGifts,
			{
				[type]: giftId
			}
		);

		state.checkGifts = { ...checkGifts };

		state.skipStausMap[type] = false;

		state.clickedGiftId = '';
	},

	// reset couponsList
	[mutationTypes.RESETCOUPONSLIST](state, reset = false) {
		state.couponsCount = 0;

		state.couponsList.splice(0);
		state.couponsKeys.splice(0);

		state.loading = false;
		state.errorInfo = window.loginStatus ?
			null : {
				type: 'login'
			};

		state.couponunavailable = false;
		state.clickedGiftId = '';

		if (reset) {
			state.checkGifts = {};
			state.skipStausMap = {};
		}
	},

	// loading
	[mutationTypes.UPDATELOADING](state, loading = false) {
		state.loading = loading;
	},

	// errorInfo 不记录具体错误信息
	[mutationTypes.UPDATEERRORINFO](state, errorInfo = null) {
		state.errorInfo = errorInfo;
	},

	// update bizType
	[mutationTypes.UPDATEBIZTYPE](state, type = 1) {
		if (!type ||
			(+type && !bizTypeValues.includes(type)) ||
			(!+type && !Object.keys(bizType).includes(type))) {
			return;
		}

		// 将string转换成int
		if (!+type) {
			type = bizType[type];
		}

		state.bizType = type;
	},

	// update betType
	[mutationTypes.UPDATEBETTYPE](state, type = 1) {
		if (!type ||
			(+type && !betTypeValues.includes(type)) ||
			(!+type && !Object.keys(betType).includes(type))) {
			return;
		}

		// 将string转换成int
		if (!+type) {
			type = betType[type];
		}

		state.betType = type;
	},

	[mutationTypes.COUPONSUNAVAIABLE](state, couponsState = true) {
		state.couponunavailable = couponsState;
	},

	// skip coupon
	[mutationTypes.UPDATESKIPCOUPONS](state, skip = false) {
		const betTypeName = betType2Key[state.betType];

		// 设置当前betType没有选中coupons
		const checkGifts = Object.assign(
			state.checkGifts,
			{
				[betTypeName]: ''
			}
		);

		state.checkGifts = { ...checkGifts };

		// 设置当前betType下是否使用红包
		const skipStausMap = Object.assign(
			state.skipStausMap,
			{
				[betTypeName]: skip
			}
		);
		state.skipStausMap = { ...skipStausMap };
	},

	[mutationTypes.UPDATECLICKEDCOUPON](state, giftId = '') {
		state.clickedGiftId = giftId;
		state.couponunavailable = false;
	},

	[mutationTypes.UPFATECOMFIRMERROR](state, comfirmError = false) {
		state.comfirmError = comfirmError;
	},

	[mutationTypes.UPDATEDISABLEDTIPS](state, tips) {
		state.disabledTips = tips || '';
	},

	[mutationTypes.UPDATEGIFTSTATUS](state, status) {
		state.giftsStatus = status;
	}
};
