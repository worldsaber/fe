import Vue from 'vue';
import Vuex from 'vuex';

import registerVerify from './modules';

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		registerVerify
	}
});
