import 'core/core';
import 'base/base';
import { userPushInit } from 'base/js/userPush';
import Vue from 'vue';
import store from 'store/message';
import App from './index.vue';

window.v_store = store;

new Vue({
	el: '#app',
	store,
	render: h => h(App)
});

userPushInit();
