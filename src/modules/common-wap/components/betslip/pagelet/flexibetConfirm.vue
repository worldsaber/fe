<template>
	<div class="m-flexibet-confirm">
		<div class="about-to-pay">Confirm to Pay{{contentData.payMode === 1 ? ' SportyCoins' : ''}}</div>
		<div class="stake-num">{{currency}} {{contentData.stakeNum}}</div>
		<div class="betslip-confirm-coupons">
			<Coupons
				:sportType="1"
				:totalStake="totalStake"
				tipsKey="s_gift_tips"
				:isShowGiftTips="showRight"
				contentInsertSelector=".m-betslips">
			</Coupons>
		</div>
		<div :class="['form-wrap', {'flexibet-change': isFlexiAutoChg}]" v-if="isFlex">
			<div class="form-item">
				<span class="label">Options to be Correct</span>
				<span class="value">{{contentData.flexibetNum}} of {{contentData.flexibetThreshold}}</span>
			</div>
			<div class="form-item">
				<span class="label">Total Odds</span>
				<span class="value">{{contentData.totalOdds}}</span>
			</div>
			<div class="form-item">
				<span class="label">Potential Win</span>
				<span class="value">{{contentData.potentialWin}}</span>
			</div>
		</div>
		<p class="flexibet-note" v-if="isFlex">Note: Cashout is unavailable with FlexiBet.</p>
		<div class="button-wrap">
			<af-button class="flexibet-cancel" @click="cancel">Cancel</af-button>
			<af-button class="flexibet-confirm" @click="confirm">Confirm</af-button>
		</div>
	</div>
</template>
<script>
import afButton from 'packages/button/index';
import Coupons from './fakeCoupons.vue';

export default {
	props: {
		contentData: Object,
	},
	components: {
		afButton,
		Coupons
	},
	data() {
		return {
			currency: window.currency
		};
	},
	computed: {
		showRight() {
			return this.contentData.showRight;
		},
		isFlex() {
			return this.contentData.isFlex;
		},
		totalStake() {
			return this.contentData.totalStake;
		},
		isFlexiAutoChg() {
			return this.contentData.isFlexiAutoChg;
		}
	},
	methods: {
		cancel() {
			this.$emit('cancel');
		},
		confirm() {
			this.$emit('confirm');
		}
	}
};
</script>
<style lang="less">
@import '~base/styles/variable.less';
@import '~base/styles/icon.less';
.m-flexibet-confirm {
	position: absolute;
	bottom: 0;
	width: 100%;
	background: #FFF;
	padding-top: 26/@rem;
	
	.about-to-pay {
		font-size: 12/@rem;
		line-height: 16/@rem;
		text-align: center;
		color: @dark;
		font-weight: 500;
	}
	.stake-num {
		font-size: 20/@rem;
		line-height: 26/@rem;
		text-align: center;
		color: @dark;
		margin-bottom: 27/@rem;
		font-weight: 500;
	}
	
	.form-wrap {
		&.flexibet-change {
			.form-item .value {
				background-color: #d6ebdc;
			}
		}
	}
	.form-item {
		padding: 0 16/@rem;
		margin-top: 2/@rem;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 12/@rem;
		line-height: 18/@rem;
		color: @dark;
		.label {
			flex: 1 1 auto;
			text-align: left;
			color: @darkGray;
		}
		.value {
			flex: 0 0 auto;
			text-align: right;
			padding: 0 4/@rem;
		}
	}
	.flexibet-note {
		margin-top: 3/@rem;
		margin-bottom: 11/@rem;
		padding: 0 16/@rem;
		font-size: 12/@rem;
		line-height: 26/@rem;
		text-align: left;
		color: @darkGray;
	}
	.button-wrap {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 14/@rem;
		font-weight: bold;
		color: @white;
		.flexibet-cancel {
			flex: 0 0 auto;
			padding: 0 25/@rem;
			background-color: @darkGreen;
			line-height: 48/@rem;
			border: none;
			border-radius: 0;
		}
		.flexibet-confirm {
			flex: 1 1 auto;
			padding: 0 25/@rem;
			background-color: @green;
			line-height: 48/@rem;
			border: none;
			border-radius: 0;
		}
	}
	.betslip-confirm-coupons{
		padding: 0 16/@rem;
		margin-bottom: 20/@rem;
	}
}
</style>
