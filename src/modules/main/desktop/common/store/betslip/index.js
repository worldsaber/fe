import Vue from 'vue';
import Vuex from 'vuex';

import betslip from './modules';

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		betslip
	}
});