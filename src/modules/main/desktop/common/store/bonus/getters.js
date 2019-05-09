export default {
	currentBonusConf: (state, getters) => state.bonusConf && state.planId && state.bonusConf[state.planId] || null,
};
