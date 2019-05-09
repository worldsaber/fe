import { betType2Key } from 'config/couponsConfig';

import { getCheckedId } from './commonFun';

export default {
	checkGiftId: (state, getters) => getCheckedId(state),
	skipStaus: (state, getters) => {
		const betTypeName = betType2Key[state.betType];

		return state.skipStausMap[betTypeName] || false;
	},
	checkItem: (state, getters) => {
		const giftId = getters.checkGiftId;

		if (giftId) {
			const index = state.couponsKeys.indexOf(giftId);
			return (index !== -1) && state.couponsList[index] || null;
		}
	},

	// 不显示已经过期的数据
	getRenderList: (state, getters) => {
		const bizType = state.bizType,
			betType = state.betType,
			list = state.couponsList || [];

		// 存在loaderror、没有红包、没有登录
		if (!list.length) {
			return [];
		}

		const ret = list.filter(item => {
			if (!item.bizTypeScope.includes(0) && !item.bizTypeScope.includes(bizType)) {
				return false;
			}

			if (!item.betTypeScope.includes(0) && !item.betTypeScope.includes(betType)) {
				return false;
			}

			return true;
		});

		if (!ret.length) {
			state.errorInfo = {
				type: 'empty'
			};
		} else {
			state.errorInfo = null;
		}

		return ret;
	},

	getCouponInfo: (state, getters) => giftId => {
		if (!giftId) {
			return;
		}

		const couponsList = state.couponsList || [],
			index = state.couponsKeys.indexOf(giftId);

		if (index !== -1) {
			return couponsList[index];
		}
	}
};
