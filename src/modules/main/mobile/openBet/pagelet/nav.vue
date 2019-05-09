<template lang="html">
	<AFSnapNav class="m-tab" v-model="activeTab">
		<AFSnapNavItem class="m-tab-item" v-for="item in cfg.tabCfg" :name="item.key" :key="item.key">
			<span>{{item.name}}</span>
			<span v-if="item.showCount && showCount">({{showCount}})</span>
		</AFSnapNavItem>
	</AFSnapNav>
</template>

<script>
import { mapState } from 'vuex';
import 'components/sanpNav';
import unsettleBetCount from 'components/openbet/openbetMixin';

export default {
	mixins: [
		unsettleBetCount
	],

	data() {
		return {
			cfg: Object.freeze({
				tabCfg: [{
				   name: 'Open Bets',
				   key: 'openBet',
				   showCount: true
			   }, {
				   name: 'Bet History',
				   key: 'betHistory',
				   showCount: false
			   }]
		   }),
		   activeTab: ''
		};
	},
	computed: {
		...mapState('openBet', [
			'totalCount',
			'isLogin',
			'reqLoading'
		]),
		showCount() {
			if (!this.isLogin) {
				return 0;
			}

			if (this.reqLoading) {
			    return 0;
			}

			const totalCount = this.totalCount || 0,
				unsettleCount = this.unsettleCount || 0;

			return totalCount || unsettleCount;
		}
	},
	watch: {
		activeTab(val) {
			const tabCfg = this.cfg.tabCfg,
				routeName = this.$route.name;

			if (routeName === 'sports' || routeName === 'openBet') {
				this.$router.replace({
					name: val === tabCfg[0].key ? val : 'sports'
				});
			}
		},
		isLogin(val) {
			if (val && !this.showCount) {
				 this.getUnsettleBetsCount();
			}
		},
		totalCount(val) {
			if (val) {
				this.unsettleCount = 0;
			}
		}
	},
	created() {
		const route = this.$route,
			meta = route.meta;

		this.activeTab = meta.tabName ? 'openBet' : 'betHistory';

		this.isLogin && this.getUnsettleBetsCount();
	}
};
</script>

<style lang="less" scoped>
@import '../style/nav.less';
</style>
