import 'core/core';
import 'base/base';
import Vue from 'vue';
import { userPushInit } from 'base/js/userPush';
import store from 'store/bestOdds';
import index from './index.vue';

window.v_store = store;

new Vue({
	el: '#app',
	store,
	render: h => h(index)
});

userPushInit();
