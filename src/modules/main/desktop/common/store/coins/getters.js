export default {
	hasData: (state, getters) => !!state.historyList.length,
	pageCount: (state, getters) => {
		if (state.totalRecords && state.pageSize) {
			return Math.ceil(state.totalRecords / state.pageSize);
		}

		return 0;
	},
	isCoinsActive: (state, getters) => {
		const coinsInfo = state.coinsInfo || {},
			status = coinsInfo.status;

		return status === 0 || status === 6;
	}
};
