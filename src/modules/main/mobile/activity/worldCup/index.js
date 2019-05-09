import 'core/core';
import 'base/base';

import Vue from 'vue';
import Vuex from 'vuex';

import layout from 'store/layout/modules';
import worldCup from 'store/worldCup/modules';
import router from 'routers/worldCup';

import index from './index.vue';

Vue.use(Vuex);

const store = new Vuex.Store({
	modules: {
		layout,
		worldCup
	}
});

window.v_store = store;
window.v_router = router;

new Vue({
	el: '#app',
	store,
	router,
	render: h => h(index)
});
