import 'core/core';
import 'base/base';
import Vue from 'vue';
import Vuex from 'vuex';
import order from 'store/order/modules';
import openBet from 'store/openBet/modules';
import router from 'routers/openBet';
import App from './index.vue';

const store = new Vuex.Store({
	modules: {
		order,
		openBet
	}
});

new Vue({
	el: '#app',
	render: h => h(App),
	store,
	router
});

window.v_router = router;
window.v_store = store;
