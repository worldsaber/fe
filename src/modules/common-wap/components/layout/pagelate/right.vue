<template>
  <Betslip></Betslip>
</template>

<script>
import Betslip from 'components/betslip';
import Vuex from 'vuex';
import Vue from 'vue';
import betslip from 'store/betslip/modules';
import betslipStake from 'store/betslipStake/modules';
import coupons from 'store/coupons/modules';

Vue.use(Vuex);

export default {
	components: {
		Betslip
	},
	beforeCreate () {
		// 找不到根的store，自己动态注入一个空的store
		if (!this.$store) {
			// 取不到store，自己注册store
			this.$store = new Vuex.Store({});
		}
		// 没有注册betslip模块
		if (!this.$store._modulesNamespaceMap['betslip/']) {
			// 没有注入store，动态取消加载种的状态
			this.$store.registerModule('betslip', betslip);
		}
		// 没有注册betslipStake模块
		if (!this.$store._modulesNamespaceMap['betslipStake/']) {
			// 没有注入store，动态取消加载种的状态
			this.$store.registerModule('betslipStake', betslipStake);
		}
		// 没有注册Coupons模块
		if (!this.$store._modulesNamespaceMap['coupons/']) {
			// 没有注入store，动态取消加载种的状态
			this.$store.registerModule('coupons', coupons);
		}
	},
};
</script>
