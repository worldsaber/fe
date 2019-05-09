export default {
	dpSuccess: (state, getters) => state.pageModule === 'success',
	showSysNotification: (state, getters) => !!state.sysNotification,
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
