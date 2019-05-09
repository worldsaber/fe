import Vue from 'vue';
import Vuex from 'vuex';

import eventList from './modules';

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		eventList
	}
});
