import 'core/core';
import 'base/base';
import 'components/login/popupLogin.js';
import { userPushInit } from 'base/js/userPush';
import Vue from 'vue';
import router from 'routers/home';
import store from 'store/home';
import App from './app.vue';

window.v_store = store;
window.v_router = router;

new Vue({
	el: '#app',
	router,
	store,
	render: h => h(App)
});

userPushInit();
