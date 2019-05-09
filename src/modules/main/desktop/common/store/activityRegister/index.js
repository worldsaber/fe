import Vue from 'vue';
import Vuex from 'vuex';

import activityRegister from './modules';

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		activityRegister
	}
});
