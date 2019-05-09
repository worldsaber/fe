<template lang="html">
	<li class="m-coins--item f-flex">
		<Banner class="m-l-left" :bannerInfo="bannerInfo" />

		<div class="m-l-right f-flex-item">
			<div class="m-l-top f-flex">
				<div class="m-t-bblack m-t-14 m-t-bold f-flex-item">{{coinInfo.showTitle}}</div>
				<div class="m-t-lblue m-t-10 m-t-right f-flex-item m-t-reat" @click.stop="seeDetail(coinInfo.activityId)">Transactions ></div>
			</div>
			<div class="m-l-mid m-trans-info">
				<div class="m-l-left">
					<div class="m-t-12 m-t-l16 m-t-gray">SportyCoins({{cfg.showCurrencyOrigin}})</div>
					<div class="m-t-dyellow m-t-20 m-t-bold">{{coinInfo.showCoins}}</div>
				</div>
				<div class="m-l-mid">
					<template v-if="coinInfo.isSuc">
						<div class="m-t-center m-t-10 m-t-l14 m-t-green">Auto Transfer</div>
					</template>
					<div :class="['m-trans-arrow', {'m-trans--green': coinInfo.isSuc}]"></div>
				</div>
				<div class="m-l-right">
					<div class="m-t-12 m-t-gray">Balance({{cfg.showCurrencyOrigin}})</div>
					<div :class="['m-t-20', 'm-t-bold', {'m-t-green': coinInfo.isSuc, 'm-t-gray': !coinInfo.isSuc}]">{{coinInfo.showBalance}}</div>
				</div>
			</div>
			<div class="m-l-btm m-t-10 m-t-gray m-t-l14">{{coinInfo.prompt}}</div>
		</div>
	</li>
</template>

<script>
import { showCurrencyOrigin } from 'config/currencyConfig';
import PopTransMixin from '../js/popTransMixin';
import Banner from './banner.vue';

export default {
	mixins: [
		PopTransMixin
	],
	props: {
		coinInfo: {
			type: Object,
			required: true
		}
	},
	components: {
		Banner
	},
	data() {
		return {
			cfg: Object.freeze({
				showCurrencyOrigin
			})
		};
	},
	computed: {
		bannerInfo() {
			const { banner = {}} = this.coinInfo || {};

			return banner;
		}
	}
};
</script>

<style lang="less" scoped>
@import '../style/coinsItem.less';
</style>
