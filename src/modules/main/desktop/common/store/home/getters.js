export default {
	grandList: (state, getters) => state.promotions.grandInfo || [],
	hasGrand: (state, getters) => !!getters.grandList.length,
	bdcastList: (state, getters) => state.promotions.bscastInfo || [],
	hasBdcast: (state, getters) => !!getters.bdcastList.length
};
