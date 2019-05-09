import Vue from 'vue';
import Vuex from 'vuex';

import layout from 'store/layout/modules';
import betslip from 'store/betslip/modules';
import betslipStake from 'store/betslipStake/modules';
import comment from 'store/comment/modules';
import me from 'store/me/modules';

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		layout,
		betslip,
		betslipStake,
		comment,
		me
	}
});
