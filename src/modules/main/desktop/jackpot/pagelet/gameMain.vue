<template>
	<article class="m-betting">
		<!-- 期次 -->
		<header class="match-dec">
			<h3 class="period">Round No.{{periodData.periodNumber}}</h3>
			<div class="tools">
				<span @click="printPage" class="print">Print</span>
			</div>
		</header>
		<!-- 投注项选择列表 -->
		<section :class="['match-list',{'disable': isDisable}]">
			<div class="list-head">
				<ul>
					<li class="no">No.</li>
					<li class="date">Date</li>
					<li class="time print-item">Time</li>
					<li class="match">Match</li>
					<li class="h2h">H2H</li>
					<li class="home">1(Home)</li>
					<li class="draw">X(Draw)</li>
					<li class="away">2(Away)</li>
				</ul>
			</div>
			<div class="list-body" v-for="(item, i) in periodData.elements" :key="item.eventId">
				<match-item :ref="`match-${i}`" :matchData="item" :index = "i" :disable="isDisable" :selectItems="selectItems" :openH2hPop="openH2h" :h2hOpen="activeH2H[item.eventId]"/>
				<div class="h2h-pop" v-if="activeH2H[item.eventId]"><LiveMatchTracker type="h2h" :eventId="item.eventId||''"/></div>
			</div>

		</section>
		<!-- 订单相关信息＋投注按钮 -->
		<footer class="control-com">
			<div class="overlay" v-if="isDisable"/>
			<div class="clear-all-wrap">
				<span class="jackpot-rush-btn" @click="rush">Jackpot Rush</span>
				<div class="blank-block"/>
				<span @click="clearAll" :class="[{lock:isLock}]">Clear All</span>
				<div v-if="isLock" class="lock-layOut"></div>
			</div>
			<div class="order-com">
				<ul class="order-detail">
					<li>
						<span>Combination<template v-if="combinations > 1">s</template></span>
						<em>{{combinations}}</em>
					</li>
					<li>
						<span>Total Stake</span>
						<em>{{showCurrency}}{{totalFormat}}</em>
					</li>
					<li><Coupons :sportType="3" :totalStake="total" :showCashoutTips="false" /></li>
				</ul>
				<div v-if="isLock" class="lock-layOut"></div>
			</div>
			<div class="order-com">
				<div class="btn-box" v-if="betStatus === 'selecting'">
					<a href="javascript:;" :class="['bet-btn',{'active':this.combinations > 0}]"  @click="toConfirm">Place Bet</a>
				</div>
				<div class="confirm-box" v-else>
					<p class="dec">About to Pay<br><span>{{showCurrency}}{{getPayMoney}}</span></p>
					<div class="btn-box" v-if="betStatus === 'confirm'">
						<span class="bet-cancel" @click="toCancel">Cancel</span>
						<span class="bet-confirm" @click="bet">Confirm</span>
					</div>
					<div class="btn-box"  v-else-if="betStatus === 'submitting'">
						<span class="bet-submitting">Submitting</span>
					</div>
				</div>
			</div>
		</footer>
	</article>
</template>
<script>
import Coupons from 'components/coupons/index.vue';
import LiveMatchTracker from 'packages/liveMatchTracker/liveMatchTracker.vue';
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex';
import * as mutationTypes from 'store/jackpot/mutationTypes';
import * as couponMutationTypes from 'store/coupons/mutationTypes';
import { formatNumber } from 'utils';
import 'components/dialog';
import dateFormat from 'kernel/js/dateFormat';
import { LS } from 'storage';
import { userCenterConfig } from 'config/order/userCenterConfig.js';
import matchItem from './matchItem.vue';
import successDialog from './successDialog.vue';

export default {
	components: {
		matchItem,
		successDialog,
		Coupons,
		LiveMatchTracker
	},
	computed: {
		...mapState('jackpot', [
			'periodData',
			'selections',
			'orderData',
			'betStatus',
			'gameSize'
		]),
		...mapGetters('jackpot', ['combinations', 'status']),
		...mapGetters('coupons', [
			'getCouponInfo',
			'checkItem',
			'checkGiftId'
		]),
		...mapState('coupons', [
			'clickedGiftId',
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
		// 订单临时数据，用于成功弹框
		tempData() {
			// 先把单位去了${this.showCurrency}
			return {
				total: `${formatNumber((+this.orderData.totalStake) || this.total, 2)}`,
				combinations: this.combinations,
				payMoney: this.actualPayAmount,
				type: `Sporty ${this.orderData.betType || '--'}`,
				time: dateFormat.format(this.orderData.createTime || this.newTime, 'DD/MM/YYYY'),
			};
		},
		isLock() {
			return this.betStatus !== 'selecting';
		}
	},
	data() {
		return {
			selectItems: {},
			pageType: 'selecting',
			haveLS: false,
			newTime: new Date(),
			isReady: false,
			lsKey: 'jackpot_selected',
			activeH2H: {},
		};
	},
	watch: {
		selections: {
			handler(newVal, oldVal) {
				if (this.haveLS && oldVal.itemsSize > 0) {
					this.clearLS();
				}
			},
			deep: true,
		},
		clickedGiftId(val) {
			if (val) {
				this.changeCoupon();
			}
		},
		isReady(val) {
			if (val) {
				this.betting().then(data => this.popSuc(), data => this.popErr());
			}
		},
		pageType(val) {
			this.updateBetTatus(val);
		},
		comfirmError(val) {
			if (val) {
				this.$dialog({
					css: 'errMsg-dialog',
					width: 315,
					title: 'Gift unavailable',
					content: 'The gift you have chosen can not be used at this time, please try another one.',
					button: ['*OK'],
				});
			}
		},
		// 总金额发生变化的时候需要从新计算红包
		total(val) {
			const leastOrderAmount = (this.checkItem && +this.checkItem.leastOrderAmount) || 0;

			if (leastOrderAmount && leastOrderAmount > val) {
				this.changeChecked({
					giftId: '',
				});
			}
		}

	},
	methods: {
		...mapMutations('jackpot', {
			updateSelections: mutationTypes.UPDATE_SELECTIONS,
			setOrderData: mutationTypes.SET_ORDER_DATA,
			updateBetTatus: mutationTypes.UPDATE_BET_TATUS,
		}),
		...mapActions('jackpot', ['betting']),
		...mapActions('coupons', [
			'getCoupons'
		]),
		...mapMutations('coupons', {
			updateCouponStatus: couponMutationTypes.COUPONSUNAVAIABLE,
			changeChecked: couponMutationTypes.UPDATECHECKEDGIFTID,
			updateConfirmStatus: couponMutationTypes.UPFATECOMFIRMERROR,
			updateGiftStatus: couponMutationTypes.UPDATEGIFTSTATUS,
			updateGiftsTips: couponMutationTypes.UPDATEDISABLEDTIPS
		}),
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
		rush() {
			if (this.periodData.status !== 1) { // 期次不可投
				return;
			}
			if (this.combinations > 0) {
				this.clearAll();
			}
			this.$nextTick(() => { // 等clearAll相关matchItem中的watcher执行完
				let matchEle;
				const selectKeys = Object.keys(this.selections.selectList);
				for (let i = 0; i < this.gameSize; i++) {
					if (selectKeys.indexOf(i.toString()) < 0) {
						matchEle = this.$refs[`match-${i}`];
						if (matchEle && matchEle[0]) {
							matchEle[0].randomPick();
						}
					}
				}
			});
		},
		// 去投注
		bet() {
			this.newTime = new Date();
			// 已成注
			if (this.status === 'open') {
				// 该期次可投注
				this.setOrderData(this.tempData);
				if (window.loginStatus || mutationTypes.LOGINS_TATUS) {
					this.pageType = 'submitting';
					// 已登录（成功和失败分别弹框）
					// 检验红包
					if (this.checkGiftId) {
						this.getCoupons({
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
				} else if (window.login) {
					// 未登录
					window.login();
				}
			} else {
				// 不可投注
				const errMsg = 'The current round is closed, please refer to the new round.';
				this.$dialog({
					title: 'Round Cloesd',
					content: errMsg,
					button: ['*OK']
				}).onClose(() => this.reloadPage());
			}
		},
		// 打印
		printPage() {
			// 具体打印内容通过样式决定
			window.print();
		},
		// 情况选项
		clearAll() {
			this.updateSelections({
				type: 'clearAll',
			});
			this.clearLS();
			this.changeChecked({
				clear: true
			});
		},
		// 清除缓存
		clearLS() {
			LS.remove(this.lsKey);
			this.haveLS = false;
		},
		// 刷新页面（数据）
		reloadPage() {
			location.reload();
		},
		// 投注成功消息弹窗
		popSuc() {
			this.$dialog({
				title: '&nbsp;',
				css: 'success-dialog',
				width: 512,
				contentData: this.orderData,
				content: successDialog,
				button: []
			}).onClose(() => {
				this.clearLS();
				this.reloadPage();
			});
		},
		// 投注失败消息弹窗
		popErr() {
			this.isReady = false;
			if (this.orderData.optType === 'login') {
				console.log('selecting');
				this.pageType = 'selecting';
			} else {
				this.$dialog({
					css: 'errMsg-dialog',
					width: 315,
					title: this.orderData.title || '&nbsp;',
					content: this.orderData.msg,
					button: this.orderData.buttonList || ['*OK'],
				}).onBtnClick(btnType => {
					// 跳充值，并缓存选中号码
					if (this.orderData.optType === 'deposit' && btnType === 1) {
						LS.set(this.lsKey, JSON.stringify(this.selections));
						this.pageType = 'confirm';
						window.open(userCenterConfig.Deposit);
					} else if (this.orderData.optType === 'cloesd') {
						this.reloadPage();
					} else {
						this.pageType = 'selecting';
					}
				});
			}

			// 刷新红包列表
			if (this.orderData.optType === 'coupons') {
				this.getCoupons({
					betType: 0
				});
			}
		},
		// 获取在余额不足时缓存的选择项
		getDefaultSelect() {
			const cacheSelect = JSON.parse(LS.get(this.lsKey) || '{}');
			if (cacheSelect.itemsSize) {
				this.haveLS = true;
				this.selectItems = cacheSelect.selectList || {};
				this.updateSelections({
					type: 'allData',
					allData: cacheSelect
				});
			}
		},
		// 选择红包
		changeCoupon() {
			const currentCoupon = this.getCouponInfo(this.clickedGiftId);

			if (currentCoupon) {
				const totalStake = this.total || 0,
					leastOrderAmount = +currentCoupon.leastOrderAmount;

				if (currentCoupon.maskTips) {
					this.updateCouponStatus(true);
					return;
				}

				// 没有stake、满减不符合条件
				if (!totalStake ||
					(leastOrderAmount && leastOrderAmount > totalStake)) {
					this.updateCouponStatus(true);
					this.updateGiftsTips(
						!totalStake ? `Please choose from all of the ${this.gameSize} games first` : 'Min. Stake Required Not Met'
					);
				} else {
					this.changeChecked({
						giftId: this.clickedGiftId,
					});
				}
			}
		},
		// 打开H2H详情
		openH2h(val) {
			this.activeH2H = val;
		}
	},
	mounted() {
		this.getDefaultSelect();
		this.updateGiftStatus(true);
	}
};
</script>
<style lang="less">
@import '~base/style/mixin.less';
@import '~base/style/variable.less';
@import '~base/style/icon.less';
@import './msgDialog.less';
@import 'components/coupons/index.less';

.m-betting {
	margin: 0 18px 30px;
	padding: 0 12px;
	background-color: @dark;

	.match-dec {
		height: 54px;
		text-align: right;
		font-size: 0;
		padding-top: 18px;
		.clearfix;
		.period {
			float: left;
			font-size: 24px;
			line-height: 1;
		}
		.tools {
			display: inline-block;
			.print {
				display: inline-block;
				font-size: 14px;
				color: @darkGray;
				cursor: pointer;
				.m-icon-print();
				&::before {
					color: @white;
					margin-right: 5px;
				}
			}
		}
	}
	.match-list {
		.list-head {
			height: 26px;
			background-color: @blueBlack;
			ul {
				display: table;
				width: 100%;
				height: 100%;
				li {
					display: table-cell;
					vertical-align: middle;
					text-align: center;
					&.match {
						text-align: left;
					}
					&.date{
						padding-right: 10px;
						width: 64px
					}
					&.print-item{
						display: none;
					}
				}
			}
		}
		.no {
			width: 35px;
		}
		.date {
			width: 74px
		}
		.match {
			text-align: left;
		}
		.h2h {
			width: 38px;
		}
		.home {
			width: 90px
		}
		.draw {
			width: 90px;
			padding: 0 4px
		}
		.away {
			width: 90px
		}
		.h2h-pop{
			margin-top: -1px;
		}
	}
	.control-com {
		position: relative;
		padding: 15px 0 17px;
		.clearfix;
		.overlay {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background: @dark;
			opacity: 0.8;
			z-index: 25;
		}
		.clear-all-wrap {
			position: relative;
			display: flex;
			align-items: center;
			justify-content: center;
			.blank-block {
				flex: 1 1 auto;
			}
			.lock-layOut{
				position: absolute;
				width: 101%;
				height: 100%;
				opacity: 0.9;
				top: 0;
  				background-color: @dark;
			}
			span {
				flex: 0 0 auto;
				display: inline-block;
				height: 30px;
				width: 108px;
				border-radius: 2px;
				text-align: center;
				border: 1px solid #979797;
				color: #979797;
				line-height: 30px;
				cursor: pointer;
				&.jackpot-rush-btn {
					margin-left: 35px;
					width: 138px;
					border: 1px solid @green;
					border-radius: 2px;
					color: @midGreen;
					text-align: center;
					&:active {
						border-color: @white;
						color: @white;
					}
				}
				&.lock{
					opacity: 0.1;
					cursor: default;
				}
			}
		}
		.order-com {
			padding: 15px 0 0 0;
			text-align: right;
			float: right;
			width: 276px;
			position: relative;
			clear: both;
			.order-detail {
				padding-top: 15px;
				display: block;
				background-color: fade(@white, 15%);
				& > li {
					display: block;
					padding: 0 8px 14px 12px;
					line-height: 1;
					font-size: 13px;
					.clearfix;
					&>span {
						float: left;
					}
				}

			}
			.confirm-box{
				background-color: fade(@white, 15%);
				padding: 10px 0;
				.dec{
					text-align: center;
					line-height: 21px;
					font-size: 12px;
					padding-bottom: 15px;
					span{
						display: block;
						font-size: 16px;
						font-weight: bold;
					}
				}
			}
			.btn-box {
				display: block;
				text-align: center;
				.bet-btn,.bet-confirm, .bet-cancel, .bet-submitting {
					display: inline-block;
					background-color: fade(@white, 15%);
					color: @darkGray;
					font-size: 14px;
					height: 38px;
					line-height: 38px;
					width: 100%;
					cursor: pointer;
					border-radius: 2px;
				}
				.bet-btn{
					cursor: default;
					&:active,
					&:hover {
						color: @darkGray;
						text-decoration: none;
					}
					&.active {
						cursor: pointer;
						background-color: @green;
						color: @white;
						&:hover {
							color: inherit;
							background-color: @midGreen;
						}
					}
				}
				.bet-cancel{
					width: 74px;
					background: none;
					color: #abaeb4;
					border:solid 1px #abaeb4;
					margin-right: 2px;
					box-sizing: border-box;
				}
				.bet-confirm{
					// background-color: @hRed;
					background-color: @green;
					color: @white;
					width: 172px;
					&:hover {
						background-color: @midGreen;
					}
				}
				.bet-submitting{
					// background-color: @hRed;
					background-color: @green;
					color: @white;
					width: 90%;
					.m-icon-loading();
					&:before{
						display: inline-block;
						animation:loading .6s linear infinite;
						margin-right: 20px;
					}

				}
			}
			.lock-layOut{
				position: absolute;
				width: 101%;
				height: 100%;
				opacity: 0.9;
				top: 0;
  				background-color: @dark;
			}
		}
		.m-coupon-wrapper{
			text-align: left;
			.m-coupon-title {
				font-size: 13px;
				.m-value{
					color: @midGreen;
				}
			}
			.m-coupon-opt{
				background-color: inherit;
				.m-coupon-tips{
					padding-bottom: 10px;

				}
				.m-refresh{
					color: @white;
					border-color: fade(@white, 15%);
					&.is-disabled{
						background-color: fade(@lightGray,15%);
						border-color:fade(@lightGray,15%);
						color: fade(@lightGray,15%);
					}
				}
			}
			.m-coupon-list{
				font-size: 0;
				background-color: inherit;
				max-height: 285px;
				margin-right: -4px;
				overflow-y: scroll;
				overflow-x: hidden;
				padding: 0;
				&::-webkit-scrollbar-track{
					border-radius: 10px;
					background-color:inherit;
				}
				&::-webkit-scrollbar
				{
					width: 4px;
					background-color: inherit;
				}
				&::-webkit-scrollbar-thumb
				{
					border-radius: 10px;
					background-color: @darkGray;
				}
				li{
					cursor: pointer;
					line-height: 1.5;
					.m-info-ban{
						width: 220px
					}
					.m-icon-left>div, .m-icon-right>div{
						background: @whiteGray;
					}
				}
			}
			.m-error-wrapper{
				background-color: inherit;
				.m-text-msg .m-text-highlight{
					color: @white;
					cursor: pointer;
				}
			}
		}
	}
}

.errMsg-dialog {
	.dialog();
}

@keyframes loading {
	100% {
		transform: rotate(360deg);
	}
}

</style>
