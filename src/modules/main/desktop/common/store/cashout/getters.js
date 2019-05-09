export default {
	hasData: (state, getters) => !!state.cashoutList.length,
	pageCount: (state, getters) => Math.ceil(state.totalCashout && state.totalCashout / state.pageSize) || 1,
	hasMorePage: (state, getters) => getters.pageCount > 1,
	getLiveNowList: (state, getters) => {
		const cashoutList = state.cashoutList || [],
			errorInfo = state.errorInfo || {},
			cashoutInfo = state.cashoutInfo || {},
			currentBetId = state.currentBetId || '';

		const ret = {};

		for (const betInfo of cashoutList) {
			if (errorInfo.type === 'replace' || betInfo.showTips) {
				ret[betInfo.id] = false;
				continue;
			}

			if (betInfo.id === currentBetId && cashoutInfo.done) {
				ret[betInfo.id] = false;
				continue;
			}

			ret[betInfo.id] = betInfo.hasLive;
		}

		return ret;
	}
};
