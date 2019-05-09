import Vue from 'vue';
import Vuex from 'vuex';

import sportSize from './modules';

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		sportSize
	}
});
