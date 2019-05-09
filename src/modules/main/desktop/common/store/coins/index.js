import Vue from 'vue';
import Vuex from 'vuex';

import sportycoins from './modules';

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		sportycoins
	}
});
