<template lang="html">
	<div class="m-sportBets-ads" v-if="getImgUrl" @click.stop="seeAdInfo">
		<img :src="getImgUrl" alt="">
	</div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { isEmptyObject } from 'utils';
import { pagePath } from 'config/pageConfig';
import { getAdConfig } from 'utils/getAdConfig';
import { UPDATEADCONFIG } from 'store/openBet/mutationTypes';

export default {
	props: {
		keyword: {
			type: String,
			required: true
		}
	},
	computed: {
		...mapState('openBet', [
			'adCfg'
		]),
		getImgUrl() {
			const adCfg = this.adCfg || {};

			return adCfg.imgUrl || '';
		}
	},
	methods: {
		...mapMutations('openBet', {
			saveAdConfig: UPDATEADCONFIG
		}),
		seeAdInfo() {
			const adCfg = this.adCfg || {};

			location.href = adCfg.linkUrl || pagePath.shop;
		}
	},
	created() {
		if (isEmptyObject(this.adCfg)) {
			getAdConfig(this.keyword).then(obj => {
				if (obj[0]) {
					this.saveAdConfig(obj[0]);
				}
			});
		}
	}
};
</script>

<style lang="less" scoped>
@import 'base/styles/variable.less';

.m-sportBets-ads {
	width: 100%;
	margin-top: 70/@rem;
	overflow: hidden;

	>img {
		width: 100%;
	}
}
</style>
