<template lang="html">
	<div :class="['m-gift-wrapper',{'m-cash-wrapper': contentData.isLapse && !contentData.isMultiple}]">
		<div class="m-pop-header">
			<i class="m-icon-close" data-action="close" data-ret="close"></i>
		</div>
		<div class="m-pop-main">
			<div class="m-coupon-type">Received {{getGiftsType}} !</div>
			<div :class="['m-coupons-info',
				{'m-coupon--green': contentData.isLapse && !contentData.isMultiple,
				'm-coupon--yellow': !contentData.isLapse && !contentData.isMultiple,
				'm-coupon--mix': contentData.isMultiple}]">

				<div>
					<div class="m-coupons-detail">
						<p class="m-coupons-desc">{{getGiftsDesc}}</p>
					</div>
					<div class="m-coupons-title">
						<span class="m-value"><span class="m-lable">{{showCurrency}}</span>{{contentData.amount}} {{showOff}}</span>
					</div>
					<p class="m-coupons-use">Use it in your Betslip</p>
				</div>
			</div>
		</div>
		<div class="m-gifts-desc-wrapper">
			<div class="m-gifts-desc">
				<p class="title">{{contentData.title}}</p>
				<p class="description">{{contentData.srcCtt}}</p>
			</div>

			<div class="m-btn-wrapper">
				<af-Button
					class="m-btn-gift"
					extraType="text"
					data-action="close"
					data-ret="close"
					@click="goGifts"
				>View</af-Button>
				<af-Button
					class="m-btn-bet"
					extraType="text"
					data-action="close"
					data-ret="bet"
					@click="goBet"
				>Bet Now</af-Button>
			</div>
		</div>
	</div>
</template>

<script>
import 'packages/button';
import {
	userCenterUrl
} from 'config/mycenter/dataConfig';
import { showCurrency } from 'config/currencyConfig';
import { pagePath } from 'config/pageConfig';

export default {
	name: 'giftTips',
	// props: ['contentData'],
	computed: {
		showCurrency() {
			return showCurrency;
		},
		getGiftsDesc() {
			if (!this.contentData.isMultiple) {
				if (this.contentData.isLapse) { // isLapse, kind为1时为true
					return 'On Any Stake';
				}
				return `On Stakes of ${this.contentData.showCondition} or More`;
			}
		},
		getGiftsType() {
			if (!this.contentData.isMultiple) {
				if (this.contentData.isLapse) { // isLapse, kind为1时为true
					return 'a Cash Gift';
				}
				return 'a Discount Gift';
			}
			return 'New Gifts';
		},
		showOff() {
			if (!this.contentData.isMultiple) {
				if (!this.contentData.isLapse) { // isLapse, kind为1时为true
					return 'OFF';
				}
			}
		}
	},
	methods: {
		goGifts() {
			location.href = userCenterUrl.gift;
		},
		goBet() {
			location.href = pagePath.sports;
		}
	}
};
</script>
