import Vue from 'vue';
import Vuex from 'vuex';
import coupons from 'store/coupons/modules';
import betslip from 'store/betslip/modules';
import betslipStake from 'store/betslipStake/modules';
import layout from 'store/layout/modules';
import jackpot from './modules';

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		coupons,
		jackpot,
		layout,
		betslip,
		betslipStake
	}
});
