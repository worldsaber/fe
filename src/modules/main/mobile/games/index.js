import 'core/core';
import 'base/base';
import Vue from 'vue';
import Vuex from 'vuex';
import Router from 'vue-router';
import layout from 'store/layout/modules';
import App from './index.vue';

Vue.use(Vuex);

const store = new Vuex.Store({
	modules: {
		layout
	}
});
Vue.use(Router);
new Vue({
	el: '#app',
	render: h => h(App),
	router: new Router(),
	store
});
