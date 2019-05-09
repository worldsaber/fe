<template>
  <div class="m-betslips-stake-wrapper">
	<div class="change-wrong-message" v-if='showStakeUnion.totalStake > maxStake'>Total stake cannot exceed {{maxStake.toLocaleString()}}</div>
	<div :class="['m-betslips-stake', {
		'use-flexibet': useFlexibet
		}]">
		<div class="flexibet-wrap" v-show="currentType === 'multiple' && supportFlexibet">
			<div class="flexibet-label-wrap">
				<div class="flexibet-label-body">
					<i class="m-icon-flexibet">F</i>
					Options to be Correct
					<i class="m-tips-icon" @click="showTips"/>
				</div>
			</div>
			<div class="flexibet-num-wrap">
				<span :class="['flexibet-action', {disabled: isMin(n) || hasMutexGroup}]" @click="changeNum('desc')"><i class="arrow-down"/></span>
				<div :class="['flexibet-num', {'flexibet-change': isFlexiAutoChg}]">
					<div :class="['flexibet-flex-num', {
						'midGray': n <= minFlexibetNum && flexibetThreshold <= minFlexibetNum
						}]">{{n !== flexibetThreshold ? n + '+' : n}}</div>
					<div class="flexibet-total-num" v-if="n !== flexibetThreshold">of {{flexibetThreshold}}</div>
				</div>
				<span :class="['flexibet-action', {disabled: isMax(n) || hasMutexGroup}]" @click="changeNum('insc')"><i class="arrow-up"/></span>
			</div>
			<div class="flexibet-pop" v-if="showFlexibetTip">
				<div class="flexibet-pop-wrap">
					<div class="flexibet-pop-header">
						<i class="m-icon-flexibet">F</i>
						Flex Your Bet!
					</div>
					<p class="flexibet-pop-text">Increase your chances with our new feature!</p>
				</div>
				<i class="flexibet-pop-close" @click="closeFlexibetTip"/>
			</div>
		</div>
		<div v-if="currentType === 'multiple' && supportFlexibet">
			<p v-if="n < flexibetThreshold" class="flexibet-label-bottom">If up to <span>{{flexibetThreshold - n}}</span> {{flexibetThreshold - n > 1 ? 'games cut' : 'game cuts'}} ticket, we still pay you!</p>
		</div>
		<div class="total-odds" v-if="currentType === 'multiple'"><span>Total Odds</span><span>{{showStakeUnion.totalOdds}}</span></div>

		<!-- single -->
		<NumberInput v-if="currentType === 'single'"
			class="m-input"
			:max="maxStake"
			:min="minStake"
			:value="String(singleStake.union || '')"
			@input="changeSingleUnion"
			:length="String(maxStake).length"
			:disable="!showStakeUnion.count"
			:placeholder="'min.' + minStake">
			<template slot="inputBefore">
				<span v-if="currentType === 'single' && showStakeUnion.count > 1" class="m-bet-sep"><em>Stake per bet ({{showStakeUnion.count}} bets)</em></span>
				<span v-else><em>Stake</em></span>
				<span class="currency"><em>{{showCurrency}}</em></span>
			</template>
		</NumberInput>

		<!-- multiple: 只有一种组合的情况，直接totalStake可以输入 -->
		<NumberInput v-if="currentType === 'multiple'"
			class="m-input"
			:max="maxStake"
			:min="minStake"
			:value="multipleStake"
			@input="setStake"
			key="multiple"
			:length="String(maxStake).length"
			:placeholder="'min.' + minStake">
			<template slot="inputBefore">
				<span v-if="showStakeUnion.count > 1"><em>Stake</em></span>
				<span v-else>Total Stake</span>

				<span class="bet-count" v-if="showStakeUnion.count > 1">
					<em>{{showStakeUnion.count}} X</em>
				</span>

				<span class="currency"><em>{{showCurrency}}</em></span>
			</template>
		</NumberInput>
		<div class="total-stake" v-else><span>Total Stake</span><span>{{showStakeUnion.showTotalStake}}</span></div>
		<coinRadioGroup v-if="showCoinGroup" :totalStake="showStakeUnion.totalStake"/>
		<div class='use-gift'>
			<Coupons
				:sportType="1"
				:totalStake="showStakeUnion.totalStake"
				tipsKey="s_gift_tips"
				:isShowGiftTips="showRight"
				contentInsertSelector="body">
			</Coupons>
		</div>
		<div class="bonus" v-if="showStakeUnion.originBonus > 0"><span>Max. Bonus</span><span>{{showStakeUnion.showBonus}}</span></div>
		<div class="potential-win"><span>Potential Win</span><span><span :class="['m-value', {'is--boost': isBoosting && showStakeUnion.boostCount}]">{{showStakeUnion.potentialWin}}</span></span></div>
		<!-- 状态有 disabled，不可用状态  submit提交状态  acceptChange状态 -->
		<div class="m-submit">
			<template v-if="!this.isShowAcceptChange && !this.betLoading">
				<div class="m-book-btn" v-if="country === 'ng' || country === 'gh' " @click="$emit('bookingCode')">Book Bet</div>
				<div class="m-share-btn" v-else @click="showShare = true">
					<!-- ke 显示文字，其他显示图标 -->
					<span class="m-share-text" v-if="country === 'ke'">Share</span>
					<i class="m-icon-share" v-else></i>
				</div>
			</template>
			<div :class="betBtnCls" @click="betConfirm">
				<span>{{ betBtnText }}</span>
				<div class="m-pay-num" v-if="!acceptStatus && !betLoading && showStakeUnion.totalStake !== 0">
					<span>About to pay {{totalToPay}}</span>
				</div>
			</div>
		</div>
		<div class="betslip-alert-confirm" v-if="isShowConfirm">
			<FlexibetConfirm :contentData="contentData" @cancel="onCancel" @confirm="onConfirm" />
		</div>
	</div>
	<Share @close-share="showShare = false" :shareCfg="shareCfg" v-if="showShare"/>
  </div>
</template>
<script>
	import { mapMutations, mapGetters, mapState, mapActions } from 'vuex';
	import { UPDATE_FLEXIBET_NUM, UPDATE_MULTIPLE_MODE } from 'store/betslip/mutationTypes';
	import { UPDATE_STAKE, RESET_STAKE, UPDATE_BET_LOADING } from 'store/betslipStake/mutationTypes';
	import * as couponMutationTypes from 'store/coupons/mutationTypes';
	import Coupons from 'components/coupons/index.vue';
	import { isEmptyObject } from 'utils';
	import {
		EventBus
	} from 'kernel/js/eventBus';
	import {
		LS
	} from 'storage';
	import { flexiNConfig, unlimitNMax } from 'store/betslip/config';
	import commonEvent from 'config/eventConfig/commonEvent';
	import { pagePath } from 'config/pageConfig';
	import 'components/share';
	import NumberInput from './numberInput.vue';
	import flexibetTip from './flexibetTip.vue';
	import FlexibetConfirm from './flexibetConfirm.vue';
	import stakeMixins from '../js/stakeMixins';
	import stakeUnionMixins from '../js/calcStakeUnionMixins';
	import coinRadioGroup from './coinRadioGroup';

	let timerId;

	export default {
		mixins: [stakeMixins, stakeUnionMixins],
		components: {
			NumberInput,
			Coupons,
			FlexibetConfirm,
			coinRadioGroup
		},
		data () {
			return {
				country: window.country,
				showFlexibetTip: false,
				n: 0,
				isShowConfirm: false,
				showShare: false,
				shareCfg: {
					url: `${location.origin}${pagePath.preFootball}`
				}
			};
		},
		watch: {
			acceptStatus (val) {
				if (this.confirmDialog) {
					this.confirmDialog.close();
				}
			},
			comfirmError(val) {
				// 出错弹窗，弹窗后重置状态
				if (val) {
					this.$dialog({
						css: 'errMsg-dialog',
						width: 315,
						title: 'Gift Unavailable',
						content: 'The gift you have chosen can not be used at this time, please try another one.',
						button: ['*OK'],
					})
					.onBtnClick(() => this.updateConfirmStatus(false));
				}
			},
			flexibetThreshold(val, oldVal) {
				const diff = val - oldVal;
				let num;
				num = this.flexibetNum + diff;
				const isMax = this.isMax(num),
					isMin = this.isMin(num);

				if (isMax) {
					this.updateFlexibetNum(this.flexibetThreshold);
				} else if (!isMin) {
					this.updateFlexibetNum(num);
				} else if (this.flexibetThreshold > unlimitNMax) {
					this.updateFlexibetNum(flexiNConfig[this.flexibetThreshold]);
				} else {
					this.updateFlexibetNum(this.minFlexibetNum);
				}
			},
			hasMutexGroup() {
				this.updateFlexibetNum(this.flexibetThreshold);
			},
			useFlexibet(val) {
				this.updateMultipleMode(val ? 2 : 1);
			},
			flexibetNum(val) {
				this.n = val;
			},
			currentType () {
				if (this.currentType === 'single') {
				   this.updateSingleUnion();
				}
			},
			betslips() {
				if (this.currentType === 'single') {
					this.updateSingleUnion();
				}
			}
		},
		computed: {
			...mapState('coupons', [
				'comfirmError'
			]),
			...mapGetters('coupons', [
				'checkItem',
				'checkGiftId'
			]),
			...mapState('layout', ['showRight']),
			...mapGetters('betslip', ['betCount', 'supportMultiple', 'canBet', 'validEventSize', 'supportFlexibet', 'flexibetThreshold', 'hasMutexGroup', 'useFlexibet', 'isBoosting']),
			...mapState('betslip', ['betslips', 'currentType', 'acceptStatus', 'autoAcceptChange', 'flexibetNum', 'minFlexibetNum', 'isFlexiAutoChg', 'oddsThreshold', 'payMode']),
			...mapState('betslipStake', ['singleStake', 'multipleStake', 'systemStake',
				'minStake', 'maxStake', 'showCurrency', 'betLoading', 'orderInfo', 'maxBonus', 'maxPotWin']),
			...mapGetters('betslipStake', ['stakeUnion']),
			...mapState('assetsInfo', ['coin']),
			contentData() {
				return {
					isFlex: this.useFlexibet,
					showRight: this.showRight,
					totalStake: this.showStakeUnion.totalStake,
					stakeNum: this.totalToPay,
					totalOdds: this.showStakeUnion.totalOdds,
					potentialWin: this.showStakeUnion.potentialWin,
					flexibetNum: this.flexibetNum,
					flexibetThreshold: this.flexibetThreshold,
					isFlexiAutoChg: this.isFlexiAutoChg,
					payMode: this.payMode
				};
			}
		},
		created () {
			this.n = this.flexibetNum;
			this.detectFlexibetTip();
			this.updateFlexibetNum(this.flexibetThreshold);
			EventBus.$on(commonEvent.UPDATE_LOGIN_STATUS, this.handleLoginStatus);
		},
		mounted() {
			this.updateSingleUnion();
		},
		destroyed() {
			EventBus.$off(commonEvent.UPDATE_LOGIN_STATUS, this.handleLoginStatus);
		},
		methods: {
			...mapActions('betslip', ['accpetChanges', 'clearAllBetSlip', 'verifyOddsBoost']),
			...mapMutations('betslip', ['changeAutoAcceptChanges', UPDATE_FLEXIBET_NUM, UPDATE_MULTIPLE_MODE]),
			...mapMutations('betslipStake', [UPDATE_STAKE, RESET_STAKE, UPDATE_BET_LOADING]),
			...mapActions('betslipStake', ['placeBet', 'fetchFlexiBetConfig']),
			...mapActions('assetsInfo', ['fetchAcountInfo']),
			...mapMutations('coupons', {
				changeChecked: couponMutationTypes.UPDATECHECKEDGIFTID,
				resetCoupons: couponMutationTypes.RESETCOUPONSLIST,
				updateConfirmStatus: couponMutationTypes.UPFATECOMFIRMERROR
			}),
			...mapActions('coupons', [
				'getCouponsGroup'
			]),
			// 分享到faceBook
			shareToFaceBook() {
				if (window.FB) {
					window.FB.ui({
						method: 'share',
						display: 'popup',
						href: `${location.origin}${pagePath.preFootball}`,
						quote: 'Hey check out the bet I just placed on Sportybet!'
					}, response => {
						console.log('cancel share!');
					});
				}
			},
			showTips() {
				this.$dialog({
					title: null,
					content: flexibetTip,
					button: ['OK']
				});
			},
			handleLoginStatus() {
				this.$popupLogin.close();
				if (window.loginStatus && this.showRight) {
					// this.betConfirm();
					this.isShowConfirm = false;
				}
			},
			// 弹窗确认
			alertPayConfirm () {
				if (this.useFlexibet) {
					if (+this.showStakeUnion.totalOdds < this.oddsThreshold) {
						this.$dialog({
							title: 'Note',
							content: `The FlexiBet feature can not be applied when the Total Odds is lower than ${this.oddsThreshold}.`,
							button: ['OK']
						});
						return;
					}
				}
				this.isShowConfirm = true;
			},
			setStake (val) {
				this.updateStake({
					type: this.currentType,
					stake: val
				});
			},
			changeNum(type) {
				if (this.n <= this.minFlexibetNum && this.flexibetThreshold <= this.minFlexibetNum) {
					this.$toast('This feature is invalid when there are 2 or less valid selections.');
					return;
				}
				if (this.hasMutexGroup) {
					this.$toast('This feature is unavailable when there are contingent outcomes.');
					return;
				}
				if (type === 'desc') {
					if (!this.isMin(this.n)) {
						this.n--;
						clearTimeout(timerId);
						timerId = setTimeout(() => {
							this.updateFlexibetNum(this.n);
						}, 400);
					} else {
						this.$toast('This feature is constrained with certain number of selections');
					}
				} else if (!this.isMax(this.n)) {
					this.n++;
					clearTimeout(timerId);
					timerId = setTimeout(() => {
						this.updateFlexibetNum(this.n);
					}, 400);
				} else {
					this.$toast('This feature is constrained with certain number of selections');
				}
			},
			detectFlexibetTip() {
				const tipStatus = LS.get('wap_flexibet');
				this.showFlexibetTip = !tipStatus;
			},
			closeFlexibetTip() {
				this.showFlexibetTip = false;
				LS.set('wap_flexibet', 1);
			},
			isMin(num) {
				if (this.flexibetThreshold <= unlimitNMax) {
					return num <= this.minFlexibetNum;
				}
				return num <= flexiNConfig[this.flexibetThreshold];
			},
			isMax(num) {
				return num >= this.flexibetThreshold;
			},
			changeSingleUnion(val, key) {
				const stake = {
					union: val
				};

				for (const item of this.betslips || []) {
					stake[item.key] = val;
				}

				this.updateStake({
					type: 'single',
					stake
				});
			},
			updateSingleUnion() {
				const singleStake = this.singleStake || {},
					union = singleStake.union;

				const tempStake = union || sportsCfg.min || '50';
				const stake = {};

				for (const item of this.betslips || []) {
					if (typeof singleStake[item.key] === 'undefined') {
						stake[item.key] = tempStake;
					}
				}

				if (isEmptyObject(stake)) {
					return;
				}

				this.updateStake({
					type: 'single',
					stake
				});
			},
			onCancel() {
				this.isShowConfirm = false;
			},
			onConfirm() {
				this.isShowConfirm = false;
				this.bet();
			}
		}
	};
</script>

<style lang="less">
	@import '~base/styles/variable.less';
	@import '~base/styles/icon.less';
	@import '~base/styles/animate.less';
	.m-betslips-stake-wrapper{
		.change-wrong-message{
			color: @white;
			height: 22/@rem;
			line-height: 22/@rem;
			background-color: @darkerRed;
			text-align: center;
			padding-left: 15/@rem;
		}
		.m-betslips-stake{
			background-color: @white;
			// box-shadow: 0px 0px 4px 0px fade(@black, 50%);
			color: @dark;
			font-size: 14/@rem;
			&>div{
				display: flex;
				padding: 0 16/@rem;

				&>span{
					flex: 0 0 auto;
					display: block;
					&:last-child{
						flex: 1 0 auto;
						text-align: right;
					}
				}
			}
			.betslip-alert-confirm{
				padding: 0;
			}
			.total-stake, .bonus, .potential-win, .total-odds{
				height: 27/@rem;
				line-height: 27/@rem;
			}

			.potential-win {
				.m-value {
					display: inline-block;
					padding: 1/@rem 3/@rem;
					box-sizing: border-box;
				}

				.is--boost {
					background: linear-gradient(to right, #40208c, #1e0e53);
					color: @white;
					line-height: 20/@rem;
				}
			}

			.total-stake, .total-odds, .bonus{
				justify-content: space-between;
			}
			.m-input{
				padding: 0;
				display: block;
			}
			position: relative;
			display: block;
			padding-top: 10/@rem;
			padding-bottom: 1/@rem;
			border-top: 2/@rem solid @fogGrayBorder;
			&.use-flexibet {
				background-color: #f2f6f3;
				border-top: 2/@rem solid @midGreen;
			}
			.m-submit{
				margin: 16/@rem;
				display: flex;
				.m-book-btn,.m-share-btn {
					flex: 0 0 auto;
					background-color: @white;
					height: 48/@rem;
					line-height: 48/@rem;
					color:@green;
					margin-right: 6/@rem;
					border: 1px solid @green;
					border-radius: 2/@rem;
					box-sizing: border-box;
					text-align: center;
				}
				.m-book-btn {
					width: 33.33%;
				}
				.m-share-btn{
					padding: 0 22/@rem;

					.m-share-text {
						font-size: 16/@rem;
					}

					.m-icon-share {
						.m-icon-share-fb();
						&:before{
							color: @green;
							font-size: 16/@rem;
						}
					}
				}
				.place-bet{
					height: 48/@rem;
					font-size: 16/@rem;
					flex: 1;
					border-radius: 2/@rem;
					background-color: @green;
					text-align:center;
					display: block;
					color: @white;
					display: flex;
					justify-content: center;
					align-items: center;
					flex-direction: column;

					// 禁止使用状态
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

					.m-pay-num {
						font-size: 12/@rem;
					}
				}
			}

            .flexibet-label-bottom {
                padding-top: 3/@rem;
                padding-bottom: 6/@rem;
                font-size: 12/@rem;
                line-height: 12/@rem;
                span {
                    color: @green;
                }
            }

			.flexibet-wrap {
				display: flex;
				align-items: center;
				justify-content: center;
				position: relative;
				line-height: 40/@rem;
				font-size: 14/@rem;
				font-weight: 500;
				.flexibet-label-wrap {
					flex: 1 1 auto;
					//height: 28/@rem;
					//padding-top: 24/@rem;
					.flexibet-label-body {
						display: flex;
						height: 16/@rem;
						align-items: center;
						justify-content: flex-start;
					}
				}
				.m-icon-flexibet {
					display: inline-block;
					background: @midGreen;
					color: @white;
					position: relative;
					margin-right: 6/@rem;
                    margin-left: 0;
					padding: 0 2/@rem;
					box-sizing: border-box;
					flex: 0 0 auto;
					font-size: 14/@rem;
					font-weight: bold;
					height: 16/@rem;
					line-height: 16/@rem;
					text-shadow: 0 1px 0 rgba(0, 0, 0, 0.5);
					&:after {
						position: absolute;
						top: 0;
						right: -2px;
						content: '';
						width: 0;
						height: 0;
						border-top: 8/@rem solid @midGreen;
						border-left: 1px solid @midGreen;
						border-right: 1px solid transparent;
						border-bottom: 8/@rem solid transparent;
					}
				}
				.m-tips-icon {
					margin-left: 3/@rem;
					.m-icon-tips();
					&::before {
						font-size: 16/@rem;
						color: @darkGray;
					}
				}
				.flexibet-num-wrap {
					flex: 0 0 auto;
					// position: relative;
					.flexibet-action {
						display: inline-block;
						vertical-align: middle;
						height: 30/@rem;
						width: 30/@rem;
						line-height: 30/@rem;
						text-align: center;
						font-size: 16/@rem;
						font-weight: bold;
						border: 1/@rem solid @green;
						border-radius: 2/@rem;
						color: @green;
						background-color: @white;
						.arrow-up {
							.m-icon-arrow-up2();
						}
						.arrow-down {
							.m-icon-arrow-down2();
						}
						&.disabled {
							color: @darkGray;
							border-color: @fogGrayBorder;
							background-color: @fogGray;
						}
					}
					.flexibet-num {
						display: inline-block;
						vertical-align: middle;
						height: 40/@rem;
						width: 32/@rem;
						padding-top: 12/@rem;
						box-sizing: border-box;

						&.flexibet-change {
							background-color: #d6ebdc;
							font-weight: bold;
						}
						.flexibet-flex-num {
							text-align: center;
							font-size: 14/@rem;
							line-height: 16/@rem;
							color: @dark;
							&.midGray {
								color: @midGray
							}
						}
						.flexibet-total-num {
							text-align: center;
							font-size: 12/@rem;
							line-height: 12/@rem;
							color: @darkGray;
						}
					}
				}
				.flexibet-pop {
					display: flex;
					align-items: center;
					justify-content: center;
					padding: 11/@rem;
					position: absolute;
					// width: 180/@rem;
					bottom: 50/@rem;
					right: 10/@rem;
					background-color: @dark;
					box-shadow: 0 2/@rem 4/@rem 0 rgba(0, 0, 0, 0.5);
					&::before {
						content: '';
						display: block;
						width: 10/@rem;
						height: 10/@rem;
						position: absolute;
						background: @dark;
						box-shadow: 2/@rem 2/@rem 2/@rem -1/@rem fadeout(@black, 92%), 2/@rem 2/@rem 2/@rem -1/@rem fadeout(@black, 92%);
						border-top-color: transparent;
						border-left-color: transparent;
						right: 83/@rem;
						bottom: -5/@rem;
						transform: translate3d(-50%,0,0) rotate(45deg);
					}
					.flexibet-pop-wrap {
						flex: 1 1 auto;
						color: @white;
						.flexibet-pop-header {
							font-size: 16/@rem;
							font-weight: bold;
							line-height: 18/@rem;
						}
						.flexibet-pop-text {
							margin-top: 8/@rem;
							font-size: 12/@rem;
							line-height: 16/@rem;
						}
					}
					.flexibet-pop-close {
						flex: 0 0 auto;
						margin-left: 10/@rem;
						color: @darkGray;
						.m-icon-delete();
						&::before {
							font-size: 24/@rem;
						}
					}
				}
			}
		}
	}

	.m-coupon-wrapper{
		width: 100%;
		.m-coupon-title{
			width: 100%;
			.m-label {
				width: 69%;
			}
			.m-value {
				width: 29%;
			}
			.m-value{
				color: @green;
			}
			.m-value-gray{
				color: @midGray;
			}
			.m-icon-pack {
				color: @darkGray;
			}
		}
	}

	.m-betslip-confirm{
		.es-dialog-body{
			font-size: 20/@rem;
			font-weight: 700;
		}
	}

	.m-betslip-flexibet-confirm {
		&.es-dialog {
			padding: 0;
			.es-dialog-body .es-dialog-main{
				padding: 0;
			}
		}
	}
	.betslip-alert-confirm{
		position: fixed;
		top: 0;
		bottom: 0;
		right: 0;
		left: 0;
		z-index: 10;
		background: rgba(0,0,0,0.6);
		padding: 0;
	}
	.sportycoin-dialog.es-dialog {
		.es-dialog-head {
			h1 {
				white-space: nowrap;
			}
		}
	}

</style>
