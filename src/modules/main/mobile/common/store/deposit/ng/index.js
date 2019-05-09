import Vue from 'vue';
import Vuex from 'vuex';

import assetsInfo from 'store/assetsInfo/modules';
import deposit from './modules';

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		assetsInfo,
		deposit
	}
});
