import { formatNumber } from 'utils';
import { formatMoneyShow } from 'config/showMoneyConfig';

export default {
	// 格式话余额位3位加一个逗号的形式
	fomatBalance (state, getters) {
		return formatNumber(state.balance, 2);
	},
	formatGiftAmount (state, getters) {
		return formatMoneyShow(state.giftAmount);
	},
	// 返回完整的电话： 国别码 + 手机号（手机号第一位如果是0则去除）
	wholePhone (state, getters) {
		const phone = state.phone;
		if (phone) {
			return state.phoneCountryCode + (phone.substring(0, 1) === '0' ? phone.substr(1) : phone);
		}
		return '';
	}
};
