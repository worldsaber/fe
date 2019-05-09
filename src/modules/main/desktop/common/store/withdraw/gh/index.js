import Vue from 'vue';
import Vuex from 'vuex';

import withdraw from './modules';

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		withdraw
	}
});
