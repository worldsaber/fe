import * as mutationTypes from './mutationTypes';
import {
	clearHistoryData,
	clearTransData,
	clearCoinsInfo,
	getStepDesc
} from './commonFun';

export default {
	// update currentTab
	[mutationTypes.UPDATECURRENTTAB](state, opt) {
		const { type = 'coins', tab = 'tab' } = opt || {};

		if (tab === 'tab') {
			state.currentTab = type;

			state.historyList.splice(0);
			state.totalRecords = 0;
			state.pageIndex = 0;
			state.coinsInfo = {};
		}

		if (tab === 'transTab') {
			state.curTransTab = type;
			state.coinsTransInfo.splice(0);
		}
	},
	// loading
	[mutationTypes.UPDATELOADING](state, loading) {
		state.reqLoading = loading;
	},

	[mutationTypes.UPDATEERRORINFO](state, errorInfo) {
		state.errorInfo = errorInfo;
	},

	[mutationTypes.UPDATECURRENTPAGE](state, index) {
		state.pageIndex = index;
	},

	[mutationTypes.UPDATEHISTORYLIST](state, data) {
		const { totalNum = 0, entityList = [] } = data || {};

		totalNum && (state.totalRecords = totalNum);

		state.historyList = [...clearHistoryData(entityList)];
	},
	[mutationTypes.UPDATECURRENTTRANSACTION](state, list = []) {
		state.coinsTransInfo = [...clearTransData(list, state.curTransTab)];
	},
	[mutationTypes.UPDATECOINSINFO](state, data) {
		const { isShowed = true, status = -1 } = data || {};
		state.coinsInfo = { ...clearCoinsInfo(data || {}) };

		let showVal = 0;
		if (status === 4) {
			showVal = state.coinsInfo || {};
			showVal = showVal.coins || {};
			showVal = showVal.showCur;
		}

		if (!isShowed) {
			const showStatusDesc = getStepDesc(data);
			showStatusDesc && (state.errorInfo = {
				type: 'dialog',
				msg: showStatusDesc,
				isSuc: status === 4,
				showVal
			});
		}
	}
};
