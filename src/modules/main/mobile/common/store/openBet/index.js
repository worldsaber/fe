import Vue from 'vue';
import Vuex from 'vuex';

import openBet from './modules';

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		openBet
	}
});
