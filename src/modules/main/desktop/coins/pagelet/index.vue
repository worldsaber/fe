<template lang="html">
	<div class="m-sportycoins">
		<Nav />

		<template v-if="currentTab === 'coins'">
			<Coins :tipsCfg="tipsCfg"/>
		</template>

		<template v-if="currentTab === 'history'">
			<History />
		</template>

		<template v-if="currentTab === 'guide'">
			<UseTips />
		</template>

	</div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import { userCenter } from 'config/order/userCenterConfig';
import * as mutationTypes from 'store/usercenter/mutationTypes';
import CommonPop from 'components/popDialog/commonPop';

import Nav from './nav.vue';
import Coins from './coins.vue';
import History from './historyList.vue';
import UseTips from './useTips.vue';
import SucPop from './sucPop.vue';

export default {
	components: {
		Nav,
		Coins,
		History,
		UseTips
	},
	computed: {
		...mapState('sportycoins', [
			'errorInfo',
			'currentTab',
			'coinsInfo'
		]),
	},
	data() {
		return {
			tipsCfg: null
		};
	},
	created () {
		this.updatePageTab(userCenter[0]);
		this.getTipsCfg();
	},
	watch: {
		errorInfo(val) {
			const type = val && val.type || '';

			switch (type) {
			case 'login':
			case 'trans_login':
				this.$dialog();
				window.login({ activeTab: 'Log In' });
				return;
			case 'dialog':
				this.$dialog();
				if (val.isSuc) {
					this.$dialog({
						title: null,
						'class': 'm-coins-popSuc',
						contentData: {
							showVal: val.showVal,
							msg: val.msg
						},
						content: SucPop,
						button: []
					});
				} else {
					this.$dialog({
						title: null,
						contentData: {
							title: val.title || 'Note',
							msg: val.msg
						},
						content: CommonPop,
						button: []
					});
				}
				break;
			default:
			}
		}
	},
	methods: {
		...mapMutations('userCenter', {
			updatePageTab: mutationTypes.UPDATE_CURRENT_TAB
		}),
		...mapActions('userCenter', [
			'getBalance'
		]),
		async getTipsCfg() {
			const ret = await fetch('/common/config/query', {
				method: 'POST',
				headers: new Headers({
					'Content-Type': 'application/json'
				}),
				body: JSON.stringify([
					{
						appId: 'pocket',
						namespace: 'application',
						configKey: 'sportycoins.stake.require.sentences'
					}, {
						appId: 'pocket',
						namespace: 'application',
						configKey: 'sportycoins.coins.require.sentences'
					}
				])
			}).then(res => res.json());

			const { bizCode = 0, data = [] } = ret || {};

			let stakeCfg = null,
				coinsCfg = null;

			if (bizCode === 10000) {
				try {
					let temp;

					for (const item of data) {
						switch (item.configKey) {
						case 'sportycoins.stake.require.sentences':
							temp = JSON.parse(item.configValue);
							stakeCfg = [];
							temp.forEach(cfgItem => { // eslint-disable-line
								stakeCfg.push(cfgItem.replace(/^\d\.(\s)*/, ''));
							});
							break;
						case 'sportycoins.coins.require.sentences':
							temp = JSON.parse(item.configValue);
							coinsCfg = [];
							temp.forEach(cfgItem => { // eslint-disable-line
								coinsCfg.push(cfgItem.replace(/^\d\.(\s)*/, ''));
							});
							break;
						default:
						}
					}
				} catch (e) {}  // eslint-disable-line
			}

			this.tipsCfg = {
				stakeCfg,
				coinsCfg
			};
		}
	}
};
</script>

<style lang="less">
@import '../style/layout.less';
</style>
