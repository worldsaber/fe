import 'core/core';
import 'base/base';

import Vue from 'vue';
import store from 'store/usercenter';
import { userPushInit } from 'base/js/userPush';

import App from './index.vue';

window.v_store = store;

new Vue({
	el: '#app',
	store,
	render: h => h(App)
});

userPushInit('gifts');
