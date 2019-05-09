import 'core/core';
import 'base/base';
import Vue from 'vue';
import store from 'store/usercenter';
import index from './index.vue';

new Vue({
	el: '#app',
	store,
	render: h => h(index)
});
