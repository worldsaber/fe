import Vue from 'vue';
import Vuex from 'vuex';

import userCenter from './modules';

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		userCenter
	}
});
