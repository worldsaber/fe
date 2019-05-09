import Vue from 'vue';
import Vuex from 'vuex';
// 从首页开始的router
import layout from 'store/layout/modules';
import betslip from 'store/betslip/modules';
import order from './order/modules';

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		layout,
		betslip,
		order
	}
});
