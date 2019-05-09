import 'core/core';
import 'base/base';
import Vue from 'vue';
import Vuex from 'vuex';
import layout from 'store/layout/modules';
import betslip from 'store/betslip/modules';
import betslipStake from 'store/betslipStake/modules';
import { userPushInit } from 'base/js/userPush';

import index from './index.vue';

Vue.use(Vuex);

const store = new Vuex.Store({
	modules: {
		layout,
		betslip,
		betslipStake
	}
});

window.v_store = store;

new Vue({
	el: '#app',
	store,
	render: h => h(index)
});

userPushInit('gifts');
