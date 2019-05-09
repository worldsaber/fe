<template>
	<div class="stake-required-help" v-loading="isLoading">
		<navbar/>
		<div class="stake-help-wrap" v-if="config && config.length > 0">
			<p class="stake-help-text">Continue adding up to the required sum of settled stakes of the Challenges to meet the requirements and get rewards.</p>
			<p class="stake-help-text" v-for="(item, index) in config" :key="index">{{item}}</p>
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
					configKey: 'sportycoins.stake.require.sentences'
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

.stake-required-help {
	.stake-help-wrap {
		padding: 24/@rem;
	}
	.stake-help-text {
		margin-bottom: 12/@rem;
		font-size: 12/@rem;
		line-height: 1.83;
	}
}
</style>
