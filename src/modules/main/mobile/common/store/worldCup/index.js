import Vue from 'vue';
import Vuex from 'vuex';

import worldCup from './modules';

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		worldCup
	}
});
