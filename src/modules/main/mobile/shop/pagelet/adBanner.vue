<template lang="html">
	<div class="m-shop--banner" v-if="getImgUrl" @click.stop="goShop">
		<img :src="getImgUrl" alt="">
	</div>
</template>

<script>
import { getAdConfig } from 'utils/getAdConfig';
import { pagePath } from 'config/pageConfig';

export default {
	props: {
		// buyGiftMainPage, buyGiftFavorPage, buyGiftWithdrawPage
		keyword: {
			type: String,
			required: true
		}
	},
	data() {
		return {
			adCfg: null
		};
	},
	computed: {
		getImgUrl() {
			const adCfg = this.adCfg || {};

			return adCfg.imgUrl || '';
		}
	},
	methods: {
		goShop() {
			const adCfg = this.adCfg || {};

			location.href = adCfg.linkUrl || pagePath.shop;
		}
	},
	created () {
		getAdConfig(this.keyword).then(obj => {
			if (obj[0]) {
				this.adCfg = obj[0];
			}
		});
	}
};
</script>

<style lang="less" scoped>
@import 'base/styles/variable.less';

.m-shop--banner {
	width: 100%;
	margin-top: 30/@rem;
	overflow: hidden;

	>img {
		width: 100%;
	}
}
</style>
