import Vue from 'vue';
import Vuex from 'vuex';

import deposit from './modules';

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		deposit
	}
});
