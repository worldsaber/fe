import 'core/core';
import 'base/base';
import Vue from 'vue';
import Vuex from 'vuex';
import store from 'store/activityRegister';
import index from './registerA.vue';

Vue.use(Vuex);

window.v_store = store;

new Vue({
	el: '#app',
	store,
	render: h => h(index)
});
