import 'core/core';
import 'base/base';

import Vue from 'vue';
import store from 'store/loginRegister';
import App from './index.vue';

window.v_store = store;

new Vue({
	el: '#app',
	store,
	render: h => h(App)
});
