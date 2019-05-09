import 'core/core';
import 'base/base';

import Vue from 'vue';
import Vuex from 'vuex';
import userCenter from 'store/usercenter/modules';
import withdraw from 'store/withdraw/ng/modules';
import codeVerify from 'store/codeVerify/modules';
import router from 'routers/offlineWithdrawRouter';

import App from './index.vue';

Vue.use(Vuex);

const store = new Vuex.Store({
	modules: {
		withdraw,
		userCenter,
		codeVerify,
	}
});

window.v_store = store;
window.v_router = router;

new Vue({
	el: '#app',
	store,
	router,
	render: h => h(App)
});
