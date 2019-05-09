export default {
	hasCashoutHistory: (state, getters) => state.cashoutHistory.length,
	isSettled: (state, getters) => state.settleType === 'settled'
};
