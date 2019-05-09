import 'core/core';
import 'base/base';
import Vue from 'vue';
import { userPushInit } from 'base/js/userPush';
import router from 'routers/liveBettingRouter';
import store from 'store/liveBetting';
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
