import Vue from 'vue';
import Vuex from 'vuex';

import bonus from './modules';

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		bonus
	}
});
