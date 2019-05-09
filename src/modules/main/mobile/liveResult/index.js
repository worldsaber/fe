import 'core/core';
import 'base/base';

import { userPushInit } from 'base/js/userPush';

import Vue from 'vue';
import store from 'store/liveResult';
import '../mockData/liveResult/mock?debug';
import App from './index.vue';

window.v_store = store;

new Vue({
	el: '#app',
	render: h => h(App),
	store,
});

userPushInit();
