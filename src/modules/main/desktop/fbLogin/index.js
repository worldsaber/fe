import 'core/core';
import 'base/base';

import Vue from 'vue';
import store from 'store/fbLogin';
import App from './index.vue';

import './style/index.less';

window.v_store = store;

new Vue({
	el: '#app',
	store,
	render: h => h(App)
});
