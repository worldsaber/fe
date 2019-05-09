import Vue from 'vue';
import Vuex from 'vuex';

import betslipStake from 'store/betslipStake/modules';
import betslip from 'store/betslip/modules';
import cashout from 'store/cashout/modules';
import coupons from 'store/coupons/modules';
import bonus from 'store/bonus/modules';
import { modules } from 'store/sportSize/modules';
import home from './modules';

Vue.use(Vuex);
export default new Vuex.Store({
	modules: {
		home,
		betslip,
		betslipStake,
		cashout,
		coupons,
		bonus,
		liveSportSize: modules(),
		sportSize: modules(),
	}
});
