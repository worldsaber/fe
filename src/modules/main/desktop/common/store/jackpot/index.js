import Vue from 'vue';
import Vuex from 'vuex';

import coupons from 'store/coupons/modules';
import jackpot from './modules';

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		jackpot,
		coupons,
	}
});
