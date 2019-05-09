import Vue from 'vue';
import Vuex from 'vuex';

import changePsd from './modules';

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		changePsd
	}
});
