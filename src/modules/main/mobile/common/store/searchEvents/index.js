import Vue from 'vue';
import Vuex from 'vuex';

import searchEvents from './modules';

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		searchEvents
	}
});
