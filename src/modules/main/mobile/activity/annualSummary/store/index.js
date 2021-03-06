import Vue from 'vue';
import Vuex from 'vuex';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';
import state from './state';

Vue.use(Vuex);

const store = new Vuex.Store({
	modules: {
		annual: {
			namespaced: true,
			state,
			getters,
			actions,
			mutations,
		}
	}
});

export default store;
