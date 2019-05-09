export default {
	isSettled (state, getters) {
		const settleType = state.settleType;

		switch (settleType) {
		case 'Settled':
			return 1;
		case 'Unsettled':
			return 0;
		case 'All':
			return 10;
		default:
		}
	}
};
