import * as mutationTypes from './mutationTypes';

export default {
	// update bank list
	[mutationTypes.UPDATEBANKLIST](state, list) {
		let tempList = list || [];

		tempList = tempList.filter(item => [0, 1].includes(+item.supportAction) && item.isActive);

		state.bankList = [...tempList];
	},

	// update depositType
	[mutationTypes.UPDATEDEPOSITTYPE](state, type) {
		state.depositType = type || 'online';
	},
	// loading
	[mutationTypes.UPDATELOADING](state, loading) {
		state.reqLoading = loading;
	},

	[mutationTypes.BANKLOADERROR](state, isError) {
		state.bankLoadError = isError;
	},

	[mutationTypes.UPDATEDEPOSITINFO](state, info) {
		state.dpInfo = { ...info };
	},

	[mutationTypes.UPDATEDEPOSITTRADEID](state, data) {
		const { tradeId = '', counterIconUrl = '', counterAuthority = '', counterPart = '' } = data;
		state.tradeId = tradeId;

		counterIconUrl && (state.dpInfo.channelIconUrl = counterIconUrl);
		counterAuthority && (state.dpInfo.channelShowName = counterAuthority);
		counterPart && (state.dpInfo.counterPart = counterPart);
	},

	[mutationTypes.UPDATEERRORINFO](state, errorInfo) {
		state.errorInfo = errorInfo;
	},

	[mutationTypes.UPDATEPAGEMODULE](state, val) {
		state.pageModule = val;
	},

	[mutationTypes.UPDATESYSNOTEINFO](state, val) {
		state.sysNotification = val || '';
	},

	[mutationTypes.UPDATEBANKHISROEY](state, list) {
		state.bankHistory = list[0] || {};
	},
};
