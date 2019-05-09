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
			const hasData = state.couponsKeys.includes(giftId);
			const avaliableGifts = state.couponsGroupList.find(x => x.type === 10);
			return hasData && avaliableGifts && avaliableGifts.gifts.find(x => x.giftId === giftId);
		}
	},
	// 可用红包
	availabledCoupons: state => {
		const result = state.realCouponsGroupList
			.filter(x => (x.type === 10 || x.type === 20) && Array.isArray(x.gifts))
			.map(x => x.gifts)
			.reduce((sum, cur) => sum.concat(cur), []);
		return result;
	}
};
