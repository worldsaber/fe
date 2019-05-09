import 'core/core';
import 'base/base';
import Vue from 'vue';
import Vuex from 'vuex';
import layout from 'store/layout/modules';
import betslip from 'store/betslip/modules';
import betslipStake from 'store/betslipStake/modules';
import cashout from 'store/cashout/modules';
import index from './index.vue';

// import cashout from 'store/cashoutNew/modules';
// import index from '../openBet/index.vue';

Vue.use(Vuex);

const store = new Vuex.Store({
	modules: {
		layout,
		betslip,
		betslipStake,
		cashout
	}
});

window.v_store = store;

new Vue({
	el: '#app',
	store,
	render: h => h(index)
});
