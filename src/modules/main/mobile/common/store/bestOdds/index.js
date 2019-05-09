import Vue from 'vue';
import Vuex from 'vuex';

import layout from 'store/layout/modules';
import oddsBoost from 'store/oddsBoost/modules';
import betslipStake from 'store/betslipStake/modules';
import betslip from 'store/betslip/modules';
import bestOdds from './modules';

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		layout,
		oddsBoost,
		bestOdds,
		betslipStake,
		betslip
	}
});
