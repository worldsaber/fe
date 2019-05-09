import Vue from 'vue';
import Vuex from 'vuex';

import layout from 'store/layout/modules';
import betslip from 'store/betslip/modules';
import betslipStake from 'store/betslipStake/modules';
import message from './modules';

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		layout,
		betslip,
		betslipStake,
		message
	}
});
