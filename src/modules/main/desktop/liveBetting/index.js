import 'core/core';
import 'base/base';

import { userPushInit } from 'base/js/userPush';

import Vue from 'vue';
import store from 'store/liveBetting';
import router from 'routers/liveBettingRouter';

import App from './index.vue';

window.v_router = router;
window.v_store = store;

new Vue({
	el: '#app',
	render: h => h(App),
	store,
	router
});

userPushInit();
