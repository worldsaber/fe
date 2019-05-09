import 'core/core';
import 'base/base';
import Vue from 'vue';
import Vuex from 'vuex';
import router from 'routers/offlineWithdrawRouter';
import assetsInfo from 'store/assetsInfo/modules';
import index from './index.vue';

Vue.use(Vuex);

const store = new Vuex.Store({
	modules: {
		assetsInfo
	}
});

window.v_store = store;
window.v_router = router;

new Vue({
	el: '#app',
	store,
	router,
	render: h => h(index)
});
