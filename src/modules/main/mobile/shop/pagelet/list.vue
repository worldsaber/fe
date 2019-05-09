<template lang="html">
	<div class="m-shop--list">
		<topNavBar :link="cfg.homeUrl"/>

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
			<AdBanner keyword="buyGiftMainPage" />
			<Notification type="info" :text="notifyContent" class="m-shop-notification"/>
    		<ul class="m-list" v-if="lists.length">
    			<li
    				:class="['m-l-item', 'f-flex', {'m-l-item--disabled': item.isSoldout}]"
    				v-for="item in lists"
    				:key="item.id"
    				@click="seeDetail(item)"
    			>
					<div class="m-shop-item-wrap">
						<div class="m-l-left m-t-white">
							<div class="m-wrapper m-t-center">
								<div class="m-l-top">
									<span class="m-t-bold m-t-11">Cash Gift </span>
									<span class="m-t-11">({{cfg.showCurrency}})</span>
								</div>
								<div class="m-l-bottom">
									<span class="m-t-22">{{item.showAmount}}</span>
								</div>
							</div>
						</div>
						<div class="m-l-mid f-flex-item">
							<div class="m-cur">
								<span class="m-t-black m-t-12 m-item-currency">{{cfg.showCurrency}}</span>
								<span class="m-t-black m-t-bold m-t-20 m-item-price">{{item.showPrice}}</span>
							</div>
							<div class="m-orig m-t-gray m-t-del m-t-12">{{cfg.showCurrency}} {{item.showAmount}}</div>
							<div>
								<span class="m-t-gray m-t-12">Left: </span>
								<span class="m-t-green m-t-12">{{item.remainNum}}</span>
								<span class="m-t-black m-t-12">/{{item.totalNum}} </span>
								<span class="m-t-gray m-t-12">Shares</span>
							</div>
						</div>
						<div class="m-l-right">
							<af-button
								extraType="text"
								:autofocus="false"
								:disabled="item.isSoldout"
								@click.prevent.stop="showComfirm(item)"
							>{{item.isSoldout ? 'Sold Out' : 'Purchase'}}</af-button>
						</div>
					</div>
					<div class="m-l-wrap" v-if='item.conditions.length'><span class="condition-label">Condition of Use:</span> {{item.conditions.join('; ')}}<span class="arrow-right"></span></div>
    			</li>
    		</ul>

			<div class="m-error-wrapper" v-else>
				<div>
					<span class="m-text-msg">Sorry，there are currently no items available for purchase. Please try again later. Thank you.</span>
				</div>
			</div>
		</template>
	</div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { showCurrency } from 'config/currencyConfig';
import 'packages/button';
import topNavBar from 'components/navbar';
import Notification from 'components/notification';
import { pagePath } from 'config/pageConfig';
import AdBanner from './adBanner.vue';
import confirmMinix from '../js/confrimMixin';
import pageMixin from '../js/pageMixin';

export default {
	mixins: [
		confirmMinix,
		pageMixin
	],
	components: {
		AdBanner,
		topNavBar,
		Notification
	},
	data() {
		return {
			cfg: Object.freeze({
				showCurrency,
				homeUrl: pagePath.home
			}),
			notifyContent: 'Note: Bets placed with Cash Gifts cannot be cashed out; Cash Gifts cannot be redeemed or withdrawn.'
		};
	},
	computed: {
		...mapState('shop', [
			'lists'
		]),
	},
	methods: {
		...mapActions('shop', [
			'getList'
		]),
		seeDetail(item) {
			this.$router.push({
				name: 'detail',
				params: {
					id: item.id
				}
			});
		},
		loadData() {
			if (this.pageLoading) {
				return;
			}

			this.pageLoading = true;
			this.getList();
		}
	}
};
</script>

<style lang="less">
@import '../style/list.less';
</style>
