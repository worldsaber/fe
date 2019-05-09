import 'core/core';
import 'base/base';
import store from 'store/layout';
import Vue from 'vue';
import App from './index.vue';

window.v_store = store;

new Vue({
	el: '#app',
	store,
	render: h => h(App),
});
