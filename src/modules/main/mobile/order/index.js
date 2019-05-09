import 'core/core';
import 'base/base';
import { userPushInit } from 'base/js/userPush';
import Vue from 'vue';
import Vuex from 'vuex';
import order from 'store/order/modules';
import cashout from 'store/cashout/modules';
import oddsBoost from 'store/oddsBoost/modules';
import router from 'routers/orderRouter';
import App from './index.vue';

const store = new Vuex.Store({
	modules: {
		order,
		cashout,
		oddsBoost
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

userPushInit();
