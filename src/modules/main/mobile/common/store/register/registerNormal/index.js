import Vue from 'vue';
import Vuex from 'vuex';

import register from './modules';
// import activityRegister from '../activityRegister/modules';

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		register
	}
});
