<template>
<div class="m-fast-stake-wrapper">
	<div class="m-fast-stake">
		<div class="stake-info-wrap">
			<div class="stake-info">
				<div class="flex-row">
					<div class="label">Pot. Win</div>
					<div class="value">{{showStakeUnion.potentialWin}}</div>
				</div>
				<div class="flex-row bonus" v-if="showStakeUnion.originBonus > 0">
					<div class="label">Max. Bonus</div>
					<div class="value">{{showStakeUnion.showBonus}}</div>
				</div>
			</div>
		</div>
		<div :class="betBtnCls" @click="betConfirm">
			<span class="m-pay-text">{{betBtnText}}</span>
			<div class="m-pay-num" v-if="!acceptStatus && !betLoading && showStakeUnion.totalStake !== 0">
				<span>About to pay {{totalToPay}}</span>
			</div>
		</div>
	</div>
	<div class="betslip-alert-confirm" v-if="isShowConfirm">
		<betConfirm :contentData="contentData" @cancel="onCancel" @confirm="onConfirm" />
	</div>
</div>
</template>
<script>
import {
	mapMutations,
	mapGetters,
	mapState,
	mapActions
} from 'vuex';
import { TOGGLE_RIGHT } from 'store/layout/mutationTypes';
import {
	EventBus
} from 'kernel/js/eventBus';
import * as couponMutationTypes from 'store/coupons/mutationTypes';
import commonEvent from 'config/eventConfig/commonEvent';
import { RESET_STAKE, UPDATE_BET_LOADING } from 'store/betslipStake/mutationTypes';
import stakeMixins from '../js/stakeMixins';
import betConfirm from './flexibetConfirm.vue';

export default {
	mixins: [stakeMixins],
	components: {
		betConfirm
	},
	props: {
		showStakeUnion: {
			type: Object
		}
	},
	data() {
		return {
			isShowConfirm: false,
			loginStatus: window.loginStatus,
			ISFASTSTAKE: true // 在公共方法中区分fast betslip
		};
	},
	watch: {

	},
	computed: {
		...mapGetters('coupons', [
			'checkItem',
			'checkGiftId'
		]),
		...mapGetters('betslip', ['betCount', 'canBet', 'validEventSize']),
		...mapState('betslip', ['acceptStatus', 'autoAcceptChange', 'payMode']),
		...mapState('betslipStake', ['minStake', 'maxStake', 'betLoading']),
		...mapGetters('betslipStake', ['stakeUnion']),
		contentData() {
			return {
				totalStake: this.showStakeUnion.totalStake,
				stakeNum: this.totalToPay,
				totalOdds: this.showStakeUnion.totalOdds,
				potentialWin: this.showStakeUnion.potentialWin,
				payMode: this.payMode
			};
		}
	},
	created() {
		EventBus.$on(commonEvent.UPDATE_LOGIN_STATUS, this.handleLoginStatus);
	},
	mounted() {
	},
	destroyed() {
		EventBus.$off(commonEvent.UPDATE_LOGIN_STATUS, this.handleLoginStatus);
	},
	methods: {
		...mapMutations('layout', [TOGGLE_RIGHT]),
		...mapMutations('betslipStake', [RESET_STAKE, UPDATE_BET_LOADING]),
		...mapActions('betslip', ['accpetChanges', 'clearAllBetSlip', 'verifyOddsBoost']),
		...mapMutations('betslip', ['changeAutoAcceptChanges']),
		...mapActions('betslipStake', ['placeBet']),
		...mapActions('assetsInfo', ['fetchAcountInfo']),
		...mapActions('coupons', [
			'getCouponsGroup'
		]),
		...mapMutations('coupons', {
			resetCoupons: couponMutationTypes.RESETCOUPONSLIST,
			updateConfirmStatus: couponMutationTypes.UPFATECOMFIRMERROR
		}),
		handleLoginStatus() {
			this.$popupLogin.close();
			if (window.loginStatus && this.showRight) {
				this.isShowConfirm = false;
			}
			this.loginStatus = window.loginStatus;
		},
		onCancel() {
			this.isShowConfirm = false;
		},
		onConfirm() {
			this.isShowConfirm = false;
			this.bet();
		}
	},
};
</script>

<style lang="less">
@import '~base/styles/variable.less';
@import '~base/styles/icon.less';
@import '~base/styles/animate.less';
.m-fast-stake-wrapper {
    .m-fast-stake {
		display: flex;
		height: 48/@rem;
		border: none;
		align-items: center;
		justify-content: center;
		color: @white;
		.stake-info-wrap {
			height: 100%;
			box-sizing: border-box;
			flex: 1 1 154/@rem;
			background: @dark;
			padding: 8/@rem 16/@rem;
			display: flex;
			align-items: center;
			justify-content: center;
			.stake-info {
				width: 100%;
			}
			.flex-row {
				display: flex;
				align-content: center;
				justify-content: center;
				font-size: 12/@rem;
				line-height: 14/@rem;
				.label {
					flex: 0 0 auto;
					margin-right: 6/@rem;
				}
				.value {
					flex: 1 1 auto;
					text-align: right;
					font-weight: 500;
				}
				&.bonus {
					margin-top: 4/@rem;
				}
			}
		}
		.place-bet {
			height: 100%;
			box-sizing: border-box;
			flex: 1 1 206/@rem;
			background: @green;
			padding: 8/@rem 16/@rem;
			font-size: 16/@rem;
			display: flex;
			justify-content: center;
			align-items: center;
			flex-direction: column;
			&.bet-disabled {
				background-color: @midGray;
				color: @darkGray;
			}
			// 接受赔率变化状态
			&.bet-accept-change{
				background-color: @green;
				color: @white;
				&:active {
					background: @lightGreen;
				}
			}
			// 提交状态
			&.bet-submit{
				.m-icon-loading-circle();
				&:before{
					animation: circles 1s infinite;
					animation-timing-function: linear;
					display: inline-block;
					vertical-align: top;
				}
				>span{
					display: inline-block;
					padding-left: 10/@rem;
				}
				background-color: @green;
				color: @white;
				&:active {
					background: @lightGreen;
				}
			}
			.m-pay-text {
				font-size: 16/@rem;
				font-weight: bold;
				line-height: 18/@rem;
			}
			.m-pay-num {
				font-size: 12/@rem;
				line-height: 14/@rem;
			}
		}
	}
}

.betslip-alert-confirm {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    z-index: 10;
    background: rgba(0,0,0,0.6);
    padding: 0;
}
</style>
