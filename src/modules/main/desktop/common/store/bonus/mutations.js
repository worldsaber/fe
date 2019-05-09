import * as mutationTypes from './mutationTypes';

export default {
	[mutationTypes.UPDATEBONUS](state, data = null) {
		let list = data && data.entityList || [];

		let tempConfig;
		const tempMap = {};
		let planId;

		list = list.filter(tempBonus => tempBonus.qualifyingOddsLimit > 10000);

		list.sort((a, b) => b.planId - a.planId);

		if (list.length) {
			tempConfig = list[0];
			planId = tempConfig.planId;

			(tempConfig.bonusRatios || []).forEach(item => {
				// single下不支持bonus，如果有配置，强转
				tempMap[item.qualifyingSelections] = +item.qualifyingSelections === 0 ?
					0 :
					item.ratio /= 10000;
			});

			state.bonusConf[planId] = tempMap;

			state.planId = planId;

			state.oddsLimit = tempConfig.qualifyingOddsLimit / 10000;

			state.superposePolicy = tempConfig.superposePolicy;
		}
	}
};
