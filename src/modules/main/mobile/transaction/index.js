import 'core/core';
import 'base/base';
import Vue from 'vue';
import Vuex from 'vuex';
import layout from 'store/layout/modules';
import { userPushInit } from 'base/js/userPush';
import router from 'routers/transactionRouter';
import index from './index.vue';

Vue.use(Vuex);

const store = new Vuex.Store({
	modules: {
		layout
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

userPushInit('gifts');
