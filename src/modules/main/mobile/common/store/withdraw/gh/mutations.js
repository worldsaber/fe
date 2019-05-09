import { isEmptyObject } from 'utils';
import * as mutationTypes from './mutationTypes';

export default {
	// update bank list
	[mutationTypes.UPDATEBANKLIST](state, list) {
		let tempList = list || [];

		tempList = tempList.filter(item => [0, 2].includes(+item.supportAction) && item.isActive);

		state.bankList = [...tempList];
	},

	// loading
	[mutationTypes.UPDATELOADING](state, loading) {
		state.reqLoading = loading;
	},

	[mutationTypes.BANKLOADERROR](state, isError) {
		state.bankLoadError = isError;
	},

	[mutationTypes.UPDATEWITHDRAWINFO](state, wdBaseInfo) {
		state.wdInfo = wdBaseInfo;
	},

	[mutationTypes.UPDATEWITHDRAWTRADEID](state, data) {
		const { tradeId = '' } = data || {};
		state.tradeId = tradeId;
	},

	[mutationTypes.SUPPLEMENTWITHDRAWINFO](state, data) {
		const { counterAuthority = '', counterPart = '' } = data;

		counterAuthority && (state.wdInfo.channelShowName = counterAuthority);
		counterPart && (state.wdInfo.phoneNo = counterPart);
	},

	[mutationTypes.UPDATEERRORINFO](state, errorInfo) {
		state.errorInfo = errorInfo;

		if (!isEmptyObject(errorInfo)) {
			state.reqLoading = false;
		}
	},

	[mutationTypes.UPDATEWITHDRAWRESULT](state, ret) {
		state.wdSuccess = ret;
		state.reqLoading = false;
	},

	[mutationTypes.UPDATEAUDITSTATUS](state, ret) {
		state.needAudit = ret;
	},
	[mutationTypes.UPDATEBANKHISROEY](state, list) {
		state.bankHistory = list[0] || {};
	},
};
