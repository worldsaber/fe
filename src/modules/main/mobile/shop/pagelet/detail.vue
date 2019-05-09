<template lang="html">
	<div :class="['m-shop-detail', {'is--disabled': giftInfo.isSoldout}]">
		<topNavBar :backClick="handleBack">
			<span class="m-t--share" slot="right" @click="toggleSharePop">Share</span>
		</topNavBar>

		<template v-if="pageError">
			<div class="m-error-wrapper">
				<div>
					<span class="m-error-msg">Sorry，something went wrong. Please try again later.</span>
					<div class="m-btn" @click="loadData">Retry</div>
				</div>
			</div>
		</template>

		<template v-else-if="pageLoading">
			<div class="m-error-wrapper">
				<div>
					<i class="m-icon-loading"></i>
					<span class="m-text-msg">Loading...</span>
				</div>
			</div>
		</template>

		<template v-else>
			<div class="m-top-banner">
				<img class="m-bg-img" src="../image/dis2.png" alt="" v-if="giftInfo.isSoldout">
				<img class="m-bg-img" src="../image/normal2.png" alt="" v-else>
				<div>
					<div class="m-l-top m-t-12 m-t-white f-flex">
						<span class="m-t-bold f-flex-item">On Any Stake</span>
						<span class="f-flex-item m-t-right">Cash Gift</span>
					</div>
					<div class="m-l-bottom">
						<div class="m-t-white m-t-center">
							<sub class="m-t-20 m-currency">{{cfg.showCurrency}}</sub>
							<span class="m-t-bold m-t-35">{{giftInfo.showAmount}}</span>
						</div>
						<div class="m-org m-t-center">
							<div class="m-t-12 m-t-white">
								<span class="m-t-op6 ">Left: </span>
								<span>{{giftInfo.remainNum}}/{{giftInfo.totalNum}}</span>
								<span class="m-t-op6 ">Shares</span>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="m-detial">
				<div class="m-l-top m-t-black ">
					<sup class="m-t-14">{{cfg.showCurrency}}</sup>
					<span class="m-t-bold m-t-22">{{giftInfo.showPrice}}</span>
				</div>
				<div class="m-t-gray m-t-del m-t-14">{{cfg.showCurrency}}{{giftInfo.showAmount}}</div>
			</div>
			<div class="m-rulers" v-if="rulers.length">
				<h3 class="m-t-bold m-t-black m-t-16">Condition of Use</h3>
				<ul class="f-count">
					<li class="f-count-item m-t-black m-t-12" v-for="item in rulers">{{item}}</li>
				</ul>
			</div>
			<div class="m-desc">
				<h3 class="m-t-bold m-t-black m-t-16">What is Cash Gift</h3>
				<ul>
					<li class="m-t-black m-t-12" v-for="item in cfg.shopDesc">{{item}}</li>
				</ul>
			</div>
			<div class="m-btn-wrapper">
				<af-button
					:autofocus="false"
					@click.stop="showComfirm(giftInfo)"
					:disabled="giftInfo.isSoldout"
				>{{giftInfo.isSoldout ? 'Sold Out' : 'Purchase Now'}}</af-button>
			</div>
		</template>

		<Share v-if="isShowShare" :shareCfg="cfg.shareCfg" @close-share="handleCloseShare"></Share>
	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import 'packages/button';
import { showCurrency } from 'config/currencyConfig';
import topNavBar from 'components/navbar';
import 'components/share';
import { domain, protocol } from 'config/pageConfig';
import { shopDesc } from '../js/config';
import ConfirmMixin from '../js/confrimMixin';
import pageMixin from '../js/pageMixin';

export default {
	mixins: [
		ConfirmMixin,
		pageMixin
	],
	components: {
		topNavBar
	},
	data() {
		return {
			isShowShare: false,
			cfg: Object.freeze({
				shopDesc,
				showCurrency,
				shareCfg: {
					url: `${protocol}//${domain}${window.v_router.options.base}`,
				// 	text: 'SportyBet Cash Gifts! Don\'t Think Twice. Limited Shares!'
				},
			})
		};
	},
	computed: {
		...mapGetters('shop', [
			'getDetailInfo'
		]),
		rulers() {
			return this.getDetailInfo.rulers || [];
		},
		giftInfo() {
			return this.getDetailInfo.gift || {};
		}
	},
	methods: {
		...mapActions('shop', [
			'getDetail'
		]),
		loadData() {
			if (this.pageLoading) {
				return;
			}

			this.pageLoading = true;
			this.getDetail();
		},
		handleCloseShare() {
			this.isShowShare = false;
		},
		toggleSharePop() {
			this.isShowShare = !this.isShowShare;
		},
		handleBack() {
			this.$router.back();
		}
	}
};
</script>

<style lang="less" scoped>
@import '../style/detail.less';
</style>
