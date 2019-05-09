import { formatNumber } from 'utils';

export default {
	// 格式话余额位3位加一个逗号的形式
	fomatBalance (state, getters) {
		return formatNumber(state.balance, 2);
	},
	formatGiftAmount (state, getters) {
		return formatNumber(state.giftAmount);
	}
};
