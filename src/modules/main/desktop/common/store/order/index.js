import Vue from 'vue';
import Vuex from 'vuex';

import order from './modules';

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		order
	}
});
