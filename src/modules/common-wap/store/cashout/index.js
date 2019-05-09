import Vue from 'vue';
import Vuex from 'vuex';

import cashout from './modules';

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		cashout
	}
});
