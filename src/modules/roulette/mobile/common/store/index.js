import Vue from 'vue';
import Vuex from 'vuex';
import roulette from './modules.js';

Vue.use(Vuex);

export default new Vuex.Store({
	actions: {},
	modules: {
		roulette
	}
});
