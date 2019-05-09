import dateFormat from 'kernel/js/dateFormat';

import { bizType, bizTypeValues, betTypeValues, betType, betType2Key } from 'config/couponsConfig';
import { formatMoneyShow } from 'config/showMoneyConfig';

import * as mutationTypes from './mutationTypes';

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

			// curBal国际标准单位*10000
			if (gift.curBal) {
				gift.originBal = gift.curBal;
				gift.curBal /= 10000;
				gift.showCurBal = formatMoneyShow(gift.curBal, false);
			}

			if (gift.leastOrderAmount) {
				gift.leastOrderAmount /= 10000;
				gift.showCondition = formatMoneyShow(gift.leastOrderAmount, false);
			}

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

	[mutationTypes.UPDATE_COUPONS_GROUP_LIST](state, data = []) {
		if (data.length < 1) {
			state.errorInfo = {
				type: 'empty'
			};
		}

		state.couponsCount = data.reduce((sum, x) => sum + x.gifts.length, 0);

		state.couponsKeys.splice(0);
		state.couponsGroupList.splice(0);

		state.couponsGroupList = data.map(group => {
			group.gifts.forEach(gift => {
				if (gift.curBal) {
					gift.originBal = gift.curBal;
					gift.curBal /= 10000;
					gift.initBal /= 10000;
					gift.showCurBal = formatMoneyShow(gift.curBal, false);
				}

				// 直减优惠，已经用掉部分
				if (gift.kind === 1 && gift.initBal > gift.curBal) {
					const remainingBal = gift.initBal - gift.curBal;
					gift.remainingBal = formatMoneyShow(remainingBal, false);
					gift.showInitBal = formatMoneyShow(gift.initBal, false);
				}

				if (gift.leastOrderAmount) {
					gift.leastOrderAmount /= 10000;
					gift.showCondition = formatMoneyShow(gift.leastOrderAmount, false);
				}

				gift.expireTime && (gift.showExpireTime = dateFormat.format(gift.expireTime, 'DD/MM/YYYY'));
				gift.usableTime && (gift.showUsableTime = dateFormat.format(gift.usableTime, 'DD/MM/YYYY'));

				gift.isGtUsableTime = Date.now() >= gift.usableTime;

				state.couponsKeys.push(gift.giftId);
			});

			return group;
		});

		const checkGifts = state.checkGifts || {},
			checkedKeys = Object.keys(state.checkGifts);
		for (const checkedKey of checkedKeys) {
			if (!state.couponsKeys.includes(checkGifts[checkedKey])) {
				checkGifts[checkedKey] = '';
			}
		}
	},

	// 更新实际红包分组
	[mutationTypes.UPDATE_REAL_COUPONS_GROUP_LIST] (state, totalStake) {
		let result = [];
		if (!totalStake) {
			result = state.couponsGroupList;
		} else {
			// A、B混合在一起，需要分出来
			state.couponsGroupList.forEach(group => {
				if (group.type === 10) {
					const groupA = {
							type: 10
						},
						groupB = {
							type: 20
						};

					groupA.gifts = group.gifts.filter(x => x.leastOrderAmount <= totalStake);

					groupB.gifts = group.gifts.filter(x => x.leastOrderAmount > totalStake);

					if (groupA.gifts.length > 0) {
						result.push(groupA);
					}

					if (groupB.gifts.length > 0) {
						result.push(groupB);
					}
				} else {
					result.push(group);
				}
			});
		}
		state.realCouponsGroupList = result;
	},

	// update checked gift id
	[mutationTypes.UPDATECHECKEDGIFTID](state, option = {}) {
		let { giftId, type } = option;

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

		state.chickedGiftId = '';
	},

	// reset couponsList
	[mutationTypes.RESETCOUPONSLIST](state, reset = false) {
		state.couponsCount = 0;

		state.couponsList.splice(0);
		state.couponsKeys.splice(0);

		state.loading = false;
		state.errorInfo = window.loginStatus ?
			null :
		{
			type: 'login'
		};
		state.chickedGiftId = '';

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

	// 更新当前选中的红包
	[mutationTypes.UPDATECLICKEDCOUPON](state, giftId = '') {
		state.chickedGiftId = giftId;
	},

	[mutationTypes.UPFATECOMFIRMERROR](state, comfirmError = false) {
		state.comfirmError = comfirmError;
	},
	[mutationTypes.TOGGLE_PACK] (state, status) {
		if (typeof status === 'boolean') {
			state.isPack = status;
			return;
		}
		state.isPack = !state.isPack;
	}
};
