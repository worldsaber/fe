import Vue from 'vue';
import Vuex from 'vuex';
// 从首页开始的router
import layout from 'store/layout/modules';
import coupons from 'store/coupons/modules';
import bingo from './modules';

Vue.use(Vuex);

export default new Vuex.Store({
	actions: {},
	modules: {
		layout,
		coupons,
		bingo
	}
});
