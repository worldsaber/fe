import { formatNumber } from 'utils';
import { fee } from './config';

export default {
	getRemainBalance: (state, getters, rootState) => {
		const userCenter = rootState.userCenter,
			balance = userCenter.balance,
			amount = state.wdInfo.payAmount || 0;

		const temp = balance - amount - fee;

		return formatNumber(temp, 2);
	},
	defaultCheckedBank: (state, getters) => {
		const bankList = state.bankList || [],
			bankHistory = state.bankHistory || {};

		if (!bankList.length) {
			return -1;
		}

		const { channel = '' } = bankHistory;

		let defaultIndex = 0;
		for (let i = 0, len = bankList.length; i < len; i++) {
			if (bankList[i].channelSendName === channel) {
				return i;
			}

			if (bankList[i].channelSendName === 'MTN Mobile Money') {
				defaultIndex = i;
			}
		}

		return defaultIndex;
	}
};
