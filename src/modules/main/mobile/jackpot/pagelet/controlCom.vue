<template>
  <!-- 订单相关信息＋投注按钮 -->
	<footer class="control-com-jackpot">
		<div class="overlay" v-if="isDisable"/>
		<div class="order-com"  v-show="betStatus === 'selecting'">
			<ul class="order-detail">
				<li>
					<span class="dec">Combination<template v-if="combinations > 1">s</template></span>
					<em>{{combinations}}</em>
				</li>
				<li>
					<span class="dec">Total Stake</span>
					<em>{{showCurrency}}{{totalFormat}}</em>
				</li>
				<li>
					<Coupons
						:sportType="3"
						:totalStake="total"
						tipsKey="s_gift_tips"
						:isShowGiftTips="selections.itemsSize > 0"/>
				</li>
			</ul>
			<div class="jackpot-rush-btn" @click="rush">Jackpot Rush</div>
			<div class="btn-box">
				<span class="clear-all" @click="clearAll">Clear All</span>
				<span :class="['bet-btn',{'active':this.combinations > 0}]" @click="toConfirm">Place Bet</span>
			</div>
		</div>
		<successDialog  v-if= "betStatus === 'successShow'" @handleClose = 'clearAll'/>
		<template v-else-if="betStatus !== 'selecting'">
			<div class="order-com" >
				<ul class="order-detail confirm-detail">
					<li>
						<span class="dec">About to Pay</span>
					</li>
					<li class="pay-money">
						<em>{{showCurrency}}{{getPayMoney}}</em>
					</li>
				</ul>
				<div class="btn-box" v-if="betStatus === 'confirm' ">
					<span class="bet-cancel" @click="toCancel">Cancel</span>
					<span class="bet-confirm" @click="bet">Confirm</span>
				</div>
				<div class="btn-box"  v-else-if="betStatus === 'submitting'">
					<span class="bet-submitting">Submitting</span>
				</div>
			</div>
			<div class="layout-shade"></div>
		</template>
	</footer>
</template>
<script>
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex';
import * as mutationTypes from 'store/jackpot/mutationTypes';
import * as couponMutationTypes from 'store/coupons/mutationTypes';
import { EventBus } from 'kernel/js/eventBus';
import commonEvent from 'config/eventConfig/commonEvent';
import { formatNumber } from 'utils';
import 'components/dialog';
import 'components/login/popupLogin.js';
import { LS } from 'storage';
import { userCenterUrl } from 'config/mycenter/dataConfig.js';
import { pagePath } from 'config/pageConfig';
import Coupons from 'components/coupons/index.vue';
import successDialog from './successDialog.vue';

export default {
	components: {
		successDialog,
		Coupons
	},
	computed: {
		...mapState('jackpot', ['periodData', 'selections', 'orderData', 'betStatus', 'loginStatus']),
		...mapGetters('jackpot', ['combinations', 'status']),
		...mapGetters('coupons', [
			'checkItem',
			'checkGiftId'
		]),
		...mapState('coupons', [
			'comfirmError'
		]),
		// 显示注数
		showCurrency() {
			return mutationTypes.SHOW_CURRENCY;
		},
		// 注数大于1时计算金额
		total() {
			return this.combinations * mutationTypes.MINBET || 0;
		},
		totalFormat() {
			return formatNumber(this.total, 2);
		},
		// 是否可投
		isDisable() {
			return this.periodData.status !== 1;
		},
		// 订单临时数据，用于成功弹框
		tempData() {
			return {
				showCurrency: this.showCurrency,
				combinations: this.combinations,
				payMoney: this.actualPayAmount,
			};
		},
		// 确认支付金额
		actualPayAmount() {
			let money = 0;
			if (this.checkGiftId) {
				money = this.total - this.checkItem.curBal;
			} else {
				money = this.total;
			}
			return money > 0 ? money : 0;
		},
		getPayMoney() {
			return formatNumber(this.actualPayAmount, 2);
		},
	},
	data() {
		return {
			pageType: 'selecting',
			lsKey: 'jackpot_selected',
			isReady: false
		};
	},
	watch: {
		pageType(val) {
			this.updateBetTatus(val);
		},
		isReady(val) {
			if (val) {
				this.betting().then(data => this.popSuc(), data => this.popErr());
			}
		},
		comfirmError(val) {
			if (val) {
				this.$dialog({
					css: 'errMsg-dialog',
					width: 315,
					title: 'Gift Unavailable',
					content: 'The gift you have chosen can not be used at this time, please try another one.',
					button: ['*OK'],
				});
			}
		}
	},
	created () {
		EventBus.$on(commonEvent.UPDATE_LOGIN_STATUS, this.handleLogin);
	},
	beforeDestroy () {
		EventBus.$off(commonEvent.UPDATE_LOGIN_STATUS, this.handleLogin);
	},
	methods: {
		...mapMutations('jackpot', {
			updateSelections: mutationTypes.UPDATE_SELECTIONS,
			setOrderData: mutationTypes.SET_ORDER_DATA,
			updateBetTatus: mutationTypes.UPDATE_BET_TATUS,
			changeLoginStatus: mutationTypes.CHANGE_LOGIN_STATUS
		}),
		...mapActions('jackpot', ['betting']),
		...mapActions('coupons', [
			'getCouponsGroup'
		]),
		...mapMutations('coupons', {
			updateConfirmStatus: couponMutationTypes.UPFATECOMFIRMERROR
		}),
		handleLogin() {
			if (!window.loginStatus) {
				this.$popupLogin && this.$popupLogin.show();
			} else {
				this.$popupLogin && this.$popupLogin.close();
			}
		},
		// 确认消息
		toCancel() {
			if (this.combinations > 0) {
				this.pageType = 'selecting';
			}
		},
		// 确认消息
		toConfirm() {
			if (this.combinations > 0) {
				this.pageType = 'confirm';
			}
		},
		// 去投注
		bet() {
			this.pageType = 'submitting';
			// 已成注
			if (this.status === 'open') {
			// 该期次可投注
				this.setOrderData(this.tempData);
				if (window.loginStatus) {
					// 已登录（成功和失败分别弹框）
					if (this.checkGiftId) {
						this.getCouponsGroup({
							betType: 0,
							isComfirm: true
						}).then(ret => {
							if (ret && ret.conponAviable) {
								// 继续校验totalStake和coupon
								const leastOrderAmount = (this.checkItem && +this.checkItem.leastOrderAmount) || 0;

								// 满减不符合条件
								if (!this.total ||
									(leastOrderAmount && leastOrderAmount > this.total)) {
									// 重置coupon的confirm状态
									this.updateConfirmStatus(true);
									this.isReady = false;
									this.pageType = 'selecting';
								} else {
									this.isReady = true;
								}
							} else {
								this.isReady = false;
								this.pageType = 'selecting';
							}
						});
					} else {
						this.isReady = true;
					}
				} else if (this.$popupLogin) {
					this.$popupLogin.show();// use popup login.
					this.pageType = 'selecting';
				} else {
					// 跳页面登录时，缓存数据
					LS.set(this.lsKey, JSON.stringify(this.selections));
					// let url = '/ke/m/independent_login';
					// url += `?okUrl=${encodeURIComponent(location.href)}`;
					location.href = `${pagePath.login}?okUrl=${encodeURIComponent(location.href)}`;
				}
			} else {
				// 不可投注
				const errMsg =
					'The current round is closed, please refer to the new round.';
				this.$dialog({
					title: 'Round Cloesd',
					content: errMsg,
					button: ['*OK']
				}).onClose(() => {
					this.pageType = 'confirm';
					this.reloadPage();
				});
			}
		},
		rush() {
			if (this.periodData.status !== 1) { // 期次不可投
				return;
			}
			if (this.combinations > 0) {
				this.clearAll();
			}
			this.$nextTick(() => { // 等clearAll相关matchItem中的watcher执行完
				this.$emit('rush');
			});
		},
		// 情况选项
		clearAll() {
			this.updateSelections({
				type: 'clearAll'
			});
			LS.remove(this.lsKey);
		},
		// 刷新页面（数据）
		reloadPage() {
			location.reload();
		},
		// 投注成功消息弹窗
		popSuc() {
			this.pageType = 'successShow';
		},
		// 投注失败消息弹窗
		popErr() {
			this.isReady = false;
			if (this.orderData.optType === 'login') {
				this.pageType = 'selecting';
			} else {
				this.$dialog({
					css: 'errMsg-dialog',
					width: 315,
					title: this.orderData.title || '&nbsp;',
					content: this.orderData.msg,
					button: this.orderData.buttonList || ['*OK']
				}).onBtnClick(btnType => {
					if (this.orderData.optType === 'deposit' && btnType === 1) {
						LS.set(this.lsKey, JSON.stringify(this.selections));
						this.pageType = 'confirm';
						location.href = URL.addPara(userCenterUrl.deposit, {
							source: 'jackpot'
						});
					} else if (this.orderData.optType === 'cloesd') {
						this.reloadPage();
					} else {
						this.pageType = 'selecting';
					}
				});
			}

			// 刷新红包列表
			if (this.orderData.optType === 'coupons') {
				this.getCouponsGroup({
					betType: 0
				});
			}
		},
	}
};
</script>
<style lang="less">
@import "~base/styles/mixin.less";
@import "~base/styles/variable.less";
@import "~base/styles/icon.less";

 .control-com-jackpot {
	position: relative;
	box-sizing: border-box;
	// position: fixed;
	// bottom: 0;
	// z-index: 50;
	width: 100%;
	.overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		opacity: 0.8;
		z-index: 55;
		background: @dark;
	}
	.order-com {
	  padding: 26/@rem 16/@rem 10/@rem 16/@rem;
	  position: relative;
	  z-index: 51;
	  background: @dark;
	  .order-detail {
		display: block;
		& > li {
			text-align: right;
			display: block;
			padding-bottom: 10/@rem;
			line-height: 1.5;
			font-size: 14/@rem;
			color: @white;
			&:first-child {
				padding-bottom: 0px;
			}
			.clearfix;
			.dec {
				float: left;
			}
			.giftNums{
				.m-icon-arrow--right();
			}

			.m-coupon-wrapper {
				.m-coupon-title {
					.m-label--green,
					.m-text--green {
						color: @midGreen;
					}
					.m-value {
						color: @lightGray;
					}
					.m-icon-pack {
						color: @midGray;
					}
				}
			}
		}
	  }
	  .confirm-detail{
		  li {
			text-align: center;
			.dec {
				font-size: 14/@rem;
				float: none;
			}
			&.pay-money{
				font-size: 20/@rem;
			}
		}
		padding-bottom: 10/@rem;
	  }
	  .jackpot-rush-btn {
		  margin-bottom: 4/@rem;
		  line-height: 34/@rem;
		  border: 1px solid @green;
		  border-radius: 2/@rem;
		  color: @midGreen;
		  text-align: center;
		  &:active {
			  border-color: @white;
			  color: @white;
		  }
	  }
	  .btn-box {
		display: block;
		text-align: right;
		padding-top: 5/@rem;
		font-size: 0;
		.bet-btn,.bet-confirm, .clear-all, .bet-cancel, .bet-submitting {
		  display: inline-block;
		  box-sizing: border-box;
		  background-color: fade(@white, 15%);
		  color: @darkGray;
		  font-size: 14/@rem;
		  height: 48/@rem;
		  line-height: 48/@rem;
		  border-radius: 2px;
		  width: 70%;
		  text-align: center;
		  &.active {
			background-color: @green;
			color: @white;
			&:active {
				background: @lightGreen;
			}
		  }
		}
		.clear-all,.bet-cancel{
			width: 27%;
			height: 46/@rem;
		  	line-height: 46/@rem;
			background: none;
			color: @white;
			border:solid 1px @darkGray;
			margin-right: 8px;
			margin-left: -10px;
		}
		.bet-confirm{
			background-color: @green;
			color: @white;
			width: 70%;
			&:active {
				background: @lightGreen;
			}
		}
		.bet-cancel{
			border: 1px solid @darkGray;
		}
		.bet-submitting{
			background-color: @green;
			color: @white;
			width: 100%;
			.m-icon-loading();
			&:before{
				display: inline-block;
				animation:loaddng .6s linear infinite;
				margin-right: 20/@rem;
			}
			&:active {
				background: @lightGreen;
			}
		}
	  }
	}
	.layout-shade{
		background: fade(#000000,60%);
		width: 100%;
		height: 100%;
		display: block;
		position: fixed;
		z-index: 49;
		top: 0;
		left: 0;
	}
  }
@keyframes loaddng{
	0%{transform:rotate(0)}
	50%{transform:rotate(180deg)}
	100%{transform:rotate(360deg)}
}
</style>
