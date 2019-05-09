export default {
	getSportId: (state, getters) => {
		const currentType = state.currentType || 0;

		if (!+currentType) {
			return '';
		}

		return `sr:sport:${currentType}`;
	},
	hasData: (state, gettter) => !!state.events.length,
	moreEvents: (state, getter) => state.total && state.events.length && state.total > state.events.length,
	needShowMoreTips: (state, getter) => state.total > 20
};
