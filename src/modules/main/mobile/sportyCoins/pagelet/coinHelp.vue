<template>
	<div class="coin-required-help" v-loading="isLoading">
		<navbar/>
		<div class="coin-help-wrap" v-if="config && config.length > 0">
			<p class="coin-help-text">SportyCoins are profit! Place bets using SportyCoins and complete the turnover challenges.</p>
			<p class="coin-help-text">The following are the conditions for SportyCoins usage:</p>
			<p class="coin-help-text" v-for="(item, index) in config" :key="index">{{item}}</p>
		</div>
	</div>
</template>

<script>
import 'components/loading';
import navbar from '../../../../common-wap/components/navbar';

export default {
	components: {
		navbar
	},
	data() {
		return {
			config: []
		};
	},
	methods: {
		getConfig() {
			this.isLoading = true;
			return fetch('/common/config/query', {
				method: 'POST',
				headers: new Headers({
					'Content-Type': 'application/json',
				}),
				body: JSON.stringify([{
					appId: 'pocket',
					namespace: 'application',
					configKey: 'sportycoins.coins.require.sentences'
				}])
			}).then(res => res.json()).then(res => {
				this.isLoading = false;
				if (res.bizCode === 10000) {
					this.config = JSON.parse(res.data[0].configValue) || [];
				}
			}).catch(() => {
				this.isLoading = false;
			});
		}
	},
	created() {
		this.getConfig();
	}
};
</script>

<style lang="less">
@import 'base/styles/variable.less';

.coin-required-help {
	.coin-help-wrap {
		padding: 24/@rem;
	}
	.coin-help-text {
		margin-bottom: 12/@rem;
		font-size: 12/@rem;
		line-height: 1.83;
	}
}
</style>
