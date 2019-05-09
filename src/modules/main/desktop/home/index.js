import 'core/core';
import 'base/base';

import { userPushInit } from 'base/js/userPush';

import store from 'store/home';
import Vue from 'vue';
import home from './home.vue';

window.v_store = store;

new Vue({
	el: '#app',
	store,
	render: h => h(home)
});

userPushInit();
