import Vue from 'vue';
import Vuex from 'vuex';

import coupons from './modules';

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		coupons
	}
});
