<template lang="html">
	<div class="m-coins--detail">
		<template v-if="pageError">
  		   <div class="m-error-wrapper">
  			   <div>
  				   <span class="m-error-msg">Failed to load data. Please refresh.</span>
  				   <div class="m-btn" @click="loadData">Refresh</div>
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
			<div class="m-l-top">
				<h4 class="m-t-bold m-t-bblack m-t-14">{{isCoinsActive ? 'Now attending' : ''}}</h4>

				<template v-if="isCoinsActive">
					<div class="m-info-wrapper" :style="getBgStyle">
    					<div class="m-act-info m-t-reat" @click.stop="seeAct('')">
    						<div class="m-t-14 m-t-bold m-t-coffee">{{banner.title || ''}}</div>
    						<div class="m-t-20 m-t-l24 m-t-white m-t-bold m-val">{{cfg.showCurrencyOrigin}} {{banner.promotation || ''}}</div>
    						<div class="m-t-12 m-t-white" v-if="banner.promotation">SportyCoins</div>
    					</div>

    					<div class="m-main">
    						<div class="m-trans-info">
    							<div class="f-flex">
    								<div class="m-l-left f-flex-item">
    									<div class="m-t-12 m-t-l14 m-t-gray">SportyCoins({{cfg.showCurrencyOrigin}})<template v-if="isPending">
    									  <span class="m-t-10 m-t-l14 m-t-bblack m-t-btn">Pending</span><i class="m-icon-help" @click.stop="seePendingTips"></i></template>
									  	</div>
    									<div class="m-t-30 m-t-bold m-t-lyellow">{{coinsInfo.coins.showCur || ''}}</div>
    									<div class="m-t-12 m-t-l14 m-t-gray m-t-mt3">{{coinsInfo.showExpireTime || ''}}</div>
    								</div>
    								<div class="m-l-right m-t-right">
    									<div class="m-t-12 m-t-l14 m-t-fgray m-t-reat" @click.stop="seeDetail(coinsInfo.activityId)">Transactions<i class="m-icon-more"></i></div>
    								</div>
    							</div>

    							<div class="m-trans-desc m-t-center" v-if="showCoinTip">
    								<div class="m-t-white m-t-bold m-t-16">{{showCoinTip.main}}</div>
    								<div class="m-t-10 m-t-gray m-t-mt4">{{showCoinTip.desc}}</div>
    							</div>
    						</div>

    						<div class="m-stake-info" v-if="coinsInfo.stake.showStake">
    							<Progress type="stake" :infos="coinsInfo.stake" :activityId="coinsInfo.activityId" :tips="stakeTips"/>
    						</div>

    						<div class="m-coins-info" v-if="coinsInfo.coins.showCoins">
    							<div class="m-union" v-if="coinsInfo.stake.showStake">
    								<img src="../img/add.png" alt="">
    							</div>
    							<Progress type="coins" :infos="coinsInfo.coins" :activityId="coinsInfo.activityId" :tips="coinsTips" />
    						</div>
    					</div>
    				</div>
				</template>
				<template v-else>
					<div class="m-info-wrapper m-info-wrapper-fix" :style="getBgStyle">
    					<div class="m-act-info">
    						<div class="m-t-14 m-t-bold m-t-coffee">No offers are in progress</div>
    					</div>

    					<div class="m-main">
    						<div class="m-trans-info">
    							<div class="f-flex">
    								<div class="m-l-left f-flex-item">
    									<div class="m-t-12 m-t-l14 m-t-gray">SportyCoins({{cfg.showCurrencyOrigin}})</div>
    									<div class="m-t-30 m-t-bold m-t-lyellow">0.00</div>
    								</div>
    							</div>
    						</div>
    					</div>
    				</div>
				</template>
			</div>
			<div class="m-l-mid" v-if="cfg.descRulers.length && isCoinsActive">
				<h4 class="m-t-14 m-t-bold m-t-bblack">Terms & Conditions:</h4>
				<ul class="f-count">
					<li class="m-t-14 m-t-black f-count-item f-flex" v-for="(item, index) in cfg.descRulers" :key="index">{{item}}</li>
				</ul>
			</div>

			<div class="m-l-btm" v-if="coinsInfo.showBanners.length">
				<h4 class="m-t-14 m-t-bold m-t-bblack">Offers You May Like</h4>
				<ul class="m-prompt">
					<li v-for="(item, index) in coinsInfo.showBanners" :key="`${item.activityUrl}_${index}`" :class="['m-prompt-item', {'m-t-right': index % 2}]">
						<Banner :bannerInfo="item" @click.stop.native="seeAct(item)" class="m-t-reat" />
					</li>
				</ul>
			</div>
		</template>

	</div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { showCurrencyOrigin } from 'config/currencyConfig';
import CommonPop from 'components/popDialog/commonPop';

import PageMixin from '../js/pageMixin';
import PopTransMixin from '../js/popTransMixin';
import { getShowCoinTip, descRulers } from '../js/config';
import Progress from './progress.vue';
import Banner from './banner.vue';

export default {
	props: {
		tipsCfg: {
			type: Object,
			'default': null
		}
	},
	mixins: [
		PageMixin,
		PopTransMixin
	],
	components: {
		Progress,
		Banner
	},
	data() {
		return {
			cfg: Object.freeze({
				showCurrencyOrigin,
				descRulers
			})
		};
	},
	computed: {
		...mapState('sportycoins', [
			'coinsInfo'
		]),
		...mapGetters('sportycoins', [
			'isCoinsActive'
		]),
		stakeTips() {
			const tipsCfg = this.tipsCfg || {};

			return tipsCfg.stakeCfg || [];
		},
		coinsTips() {
			const tipsCfg = this.tipsCfg || {};

			return tipsCfg.coinsCfg || [];
		},
		banner() {
			const coinsInfo = this.coinsInfo || {};

			return coinsInfo.banner || {};
		},
		showCoinTip() {
			const coinsInfo = this.coinsInfo || {},
				count = coinsInfo.count || 0;

			if (count) {
				return getShowCoinTip(count);
			}
		},
		getBgStyle() {
			if (!this.isCoinsActive) {
				return {
					backgroundImage: `url(${require('../img/bg.jpg')})`
				};
			}

			if (this.banner.bgUrl) {
				return {
					backgroundImage: `url(${this.banner.bgUrl})`
				};
			}

			return {
				backgroundImage: `url(${require('../img/bgDefault.jpg')})`
			};
		},
		isPending() {
			const coinsInfo = this.coinsInfo || {},
				status = coinsInfo.status || -1;

			return +status === 6;
		}
	},
	methods: {
		seeAct(bannerInfo) {
			const banner = bannerInfo || this.banner || {};
			if (banner.activityUrl) {
				location.href = banner.activityUrl;
			}
		},
		seePendingTips() {
			this.$dialog();
			this.$dialog({
				title: null,
				contentData: {
					title: 'Note',
					msg: 'Your SportyCoins account is currently frozen due to unsettled ticket status. Feel free to contact us if you have any concerns.'
				},
				content: CommonPop,
				button: []
			});
		}
	}
};
</script>

<style lang="less" scoped>
@import '../style/coins.less';
</style>
