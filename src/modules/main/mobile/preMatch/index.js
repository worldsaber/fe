import 'core/core';
import 'base/base';
import Vue from 'vue';
import { userPushInit } from 'base/js/userPush';
import router from 'routers/preMatchRouter';
import store from 'store/preMatch';
import index from './index.vue';

window.v_router = router;
window.v_store = store;

new Vue({
	el: '#app',
	store,
	router,
	render: h => h(index)
});

userPushInit();
