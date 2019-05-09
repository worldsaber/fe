import 'core/core';
import 'base/base';
import Vue from 'vue';
import Vuex from 'vuex';
import index from './index.vue';

Vue.use(Vuex);

new Vue({
	el: '#app',
	render: h => h(index)
});
