import 'core/core';
import 'base/base';
import Vue from 'vue';
import Vuex from 'vuex';
import oddsBoost from 'store/oddsBoost/modules';
import index from './index.vue';

Vue.use(Vuex);
const store = new Vuex.Store({
	modules: {
		oddsBoost
	}
});

new Vue({
	el: '#app',
	store,
	render: h => h(index)
});
