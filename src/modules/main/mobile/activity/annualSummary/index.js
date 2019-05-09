import 'core/core';
import 'base/base';

import Vue from 'vue';

import index from './index.vue';
import router from './router/index.js';
import store from './store/index.js';

Vue.filter('toUpperCase', value => `${value}`.toUpperCase());

new Vue({
	el: '#app',
	router,
	store,
	render: h => h(index)
});
