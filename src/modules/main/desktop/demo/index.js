import 'core/core';
import 'base/base';

import Vue from 'vue';
import Vuex from 'vuex';

// import store from 'store/betslip';
import userCenter from 'store/usercenter/modules';
import withdraw from 'store/withdraw/ng/modules';
import codeVerify from 'store/codeVerify/modules';

import App from './index.vue';

Vue.use(Vuex);

const store = new Vuex.Store({
	modules: {
		withdraw,
		userCenter,
		codeVerify
	}
});

window.v_store = store;

let vueObj = new Vue({
	el: '#app',
	render: h => h(App),
	store
});

window.vueObj = vueObj;
