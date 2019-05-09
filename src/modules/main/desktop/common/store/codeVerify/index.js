import Vue from 'vue';
import Vuex from 'vuex';

import codeVerify from './modules';

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		codeVerify
	}
});
