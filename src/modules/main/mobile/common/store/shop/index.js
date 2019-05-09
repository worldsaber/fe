import Vue from 'vue';
import Vuex from 'vuex';
import layout from 'store/layout/modules';

import shop from './modules';

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		shop,
		layout
	}
});
