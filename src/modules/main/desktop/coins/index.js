import 'core/core';
import 'base/base';

import Vue from 'vue';
import Vuex from 'vuex';
import userCenter from 'store/usercenter/modules';
import sportycoins from 'store/coins/modules';
import App from './index.vue';

Vue.use(Vuex);

const store = new Vuex.Store({
	modules: {
		sportycoins,
		userCenter
	}
});

window.v_store = store;

new Vue({
	el: '#app',
	store,
	render: h => h(App)
});
