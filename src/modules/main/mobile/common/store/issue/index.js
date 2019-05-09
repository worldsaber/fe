import Vue from 'vue';
import Vuex from 'vuex';

import issue from './modules';

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		issue
	}
});
