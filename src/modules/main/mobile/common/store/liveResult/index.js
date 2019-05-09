import Vue from 'vue';
import Vuex from 'vuex';

import liveResult from './modules';

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		liveResult
	}
});
