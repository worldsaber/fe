import Vue from 'vue';
import Vuex from 'vuex';

import eventDetail from './modules';

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		eventDetail
	}
});
