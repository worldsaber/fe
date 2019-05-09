<template lang="html">
	<ul class="m-coins-nav">
		<li
			v-for="item in getShowTabs"
			:key="item.key"
			:class="[
				'f-item',
				{
					'f-item--active': item.key === curTab
				}
			]"
			@click="changeType(item.key)"
		>{{item.name}}</li>
	</ul>
</template>

<script>
import { mapMutations, mapState, mapActions } from 'vuex';
import * as mutationTypes from 'store/coins/mutationTypes';
import { tabConfig, transTab } from '../js/config';

export default {
	props: {
		tabType: {
			type: String,
			'default': 'tab'
		}
	},
	data() {
		return {
			cfg: Object.freeze({
				transTab,
				tabConfig
			})
		};
	},
	computed: {
		...mapState('sportycoins', [
			'currentTab',
			'curTransTab',
			'reqLoading'
		]),
		getShowTabs() {
			const tabType = this.tabType,
				cfg = this.cfg;

			if (tabType === 'tab') {
				return cfg.tabConfig;
			}

			return cfg.transTab;
		},
		curTab() {
			const tabType = this.tabType;

			if (tabType === 'tab') {
				return this.currentTab;
			}

			return this.curTransTab;
		}
	},
	methods: {
		...mapMutations('sportycoins', {
			chgCurrentTab: mutationTypes.UPDATECURRENTTAB,
		}),
		...mapActions('sportycoins', [
			'getCoinsTransInfo'
		]),
		changeType(val) {
			if (this.reqLoading) {
				return;
			}

			this.chgCurrentTab({
				type: val,
				tab: this.tabType
			});

			if (!this.tabType === 'tab') {
				this.getCoinsTransInfo();
			}
		}
	}
};
</script>

<style lang="less" scoped>
@import '../style/nav.less';
</style>
