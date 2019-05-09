import Vue from 'vue';
import Vuex from 'vuex';

import assetsInfo from './modules';

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		assetsInfo
	}
});
