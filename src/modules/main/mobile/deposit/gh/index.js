import 'core/core';
import 'base/base';
import Vue from 'vue';
import Vuex from 'vuex';
import deposit from 'store/deposit/gh/modules';
import assetsInfo from 'store/assetsInfo/modules';
import index from './index.vue';

Vue.use(Vuex);

const store = new Vuex.Store({
	modules: {
		deposit,
		assetsInfo
	}
});

window.v_store = store;

new Vue({
	el: '#app',
	store,
	render: h => h(index)
});
