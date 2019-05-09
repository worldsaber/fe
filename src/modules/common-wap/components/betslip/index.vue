<template>
	<div>
		<div class="m-betslips" @click.stop="handleClick" v-loading:failLoad="loading" v-show="!isShowBookingCode">
			<div class="flex-wrapper">
				<div class="m-bet-head">
					<div class="m-list-nav">
						<!-- 选择的outcome的个数 -->
						<div class="m-count">
							<i class="m-icon-back" @click="closeBetslip"></i>
							<span>Betslip</span>
							<span class="m-bag" v-if="betCount > 0">{{betCount || ''}}</span>
						</div>
						<!-- 掉查询余额的接口，判断是否登录 -->
						<div class="m-login-status">
							<span v-if="!isLogin" class="m-login-not" @click="handleLogin">Register/Log In</span>
							<!-- <em class="m-user-icon"></em> @click="jumpToMe" 去掉图标和点击-->
							<span v-else class="m-login-yes" >{{showCurrency}}{{fomatBalance}}</span>
						</div>
					</div>
					<div class="m-sec-opt">
						<div class="remove-all" @click="clearAll">Remove All</div>
						<Check class="auto-accept-change" :checked='autoAcceptChange' @input="handleChangeAutoAcceptChanges"><span slot="before" class="before-text">Accept any odd changes</span></Check>
					</div>
					<!-- 只选择一个outcome的时候不显示 -->
					<AFSnapNav class="m-list-bet-type" :value="currentType" @change="changePlayType" v-show="betCount > 1">
						<AFSnapNavItem class="m-list-bet-type-item" name="single">Singles<i v-if="canBoost" class="m-icon-boost"></i></AFSnapNavItem>
						<AFSnapNavItem class="m-list-bet-type-item" name="multiple" :disabled="!supportMultiple">Multiple<i v-if="supportFlexibet" class="m-icon-flexibet">F</i></AFSnapNavItem>
						<AFSnapNavItem class="m-list-bet-type-item" name="system" :disabled="!supportSystem" @click.native="handleSystemClick">System</AFSnapNavItem>
					</AFSnapNav>
					<div class="change-wrong-message" v-if="isShowAcceptChange">Note:changes in odds or availability</div>
					<oddsBoostTip v-if="showBoostTips" :changed="isShowAcceptChange"/>
				</div>
				<!-- 滚动区域 -->
				<div class="m-scroll-wrapper">
					<div class="m-scroll" ref="scrollEle">
						<template v-if='betCount > 0'>
							<List></List>
							<!-- stake吸底功能取消，放到scroll中滚动 -->
							<Stake @bookingCode="isShowBookingCode = true"></Stake>
						</template>
						<shareCode v-else/>
					</div>
				</div>
			</div>
			<Success v-if="orderInfo && orderInfo.shortId"/>
		</div>
		<BookingCode v-model="isShowBookingCode" v-if="isShowBookingCode"/>
		<!-- 显示在中间的loading状态 -->
		<BetLoading v-show="betLoading" @click.stop="noop"></BetLoading>
	</div>

</template>
<script>
	import { mapMutations, mapGetters, mapState, mapActions } from 'vuex';
	import { UPDATE_BET_TYPE,
	UPDATE_REACH_MAX_THRESHOLD,
	UPDATE_REACH_CHANGE_MAX_SYSTEM_THRESHOLD,
	CHANGE_LOADING_STATUS,
	CHANGE_AUTO_ACCEPT_CHANGES,
	UPDATE_IS_ACCEPT_MORE,
	LOAD_BETSLIP,
	UPDATE_STAGE_BET_OUTCOMES,
	UPDATE_FAST_MODE
		} from 'store/betslip/mutationTypes';
	import { RESET_STAKE } from 'store/betslipStake/mutationTypes';
	import { TOGGLE_RIGHT } from 'store/layout/mutationTypes';
	import * as couponMutationTypes from 'store/coupons/mutationTypes';
	import SanpNav from 'components/sanpNav';
	import BetLoading from 'components/betLoading';
	import { userCenterUrl } from 'config/mycenter/dataConfig';
	import { showCurrency } from 'config/currencyConfig';
	import { LS, cookie } from 'storage';
	import {
		EventBus
	} from 'kernel/js/eventBus';
	import commonEvent from 'config/eventConfig/commonEvent';
	import Check from './pagelet/check.vue';
	import List from './pagelet/list.vue';
	import Stake from './pagelet/stake.vue';
	import Success from './pagelet/success';
	import BookingCode from './pagelet/bookingCode';
	import shareCode from './pagelet/shareCode';
	import oddsBoostTip from './pagelet/oddsBoostTip';

	export default {
		data () {
			return {
				showCurrency,
				isShowBookingCode: false
			};
		},
		watch: {
			showRight (val) {
				if (val) {
					const ele = this.$refs.scrollEle;
					if (ele) {
						this.$nextTick(() => {
							const scrollHeight = ele.scrollHeight;
							const clientHeight = ele.clientHeight;
							if (scrollHeight - clientHeight > 0) {
								ele.scrollTop = scrollHeight - clientHeight;
							}
						});
					}
				}
			},
			reachMaxThreshold (val) {
				if (val) {
					this.alertMaxThreshold();
					this.updateReachMaxThreshold();
				}
			},
			reachChangeMaxSystemThreshold (val) {
				if (val) {
					this.alertMaxSystemThreshold();
					this.updateReachChangeMaxSystemThreshold();
				}
			},
			betCount (val, oldVal) {
				if (val === 0) {
					this.resetStake();
				}
				if (oldVal === 0 && val === 1) {
					this.updateFastMode(true);
				} else if (this.fastMode) {
					this.updateFastMode(false);
				}
			},
			// 不支持的情况下直接重置金额
			supportMultiple (val) {
				if (!val) {
					this.resetStake();
					// 主动更新红包，因为在不支持当前玩法的情况下，玩法会自动切换，无法触发红包更新，所以主动触发下
					this.updatecheckedgiftid({
						type: 'multiple',
						giftId: ''
					});
				}
			},
			// 不支持的情况下直接重置金额
			supportSystem (val) {
				if (!val) {
					this.resetStake();
					// 主动更新红包，因为在不支持当前玩法的情况下，玩法会自动切换，无法触发红包更新，所以主动触发下
					this.updatecheckedgiftid({
						type: 'system',
						giftId: ''
					});
				}
			},
			// 弹窗询问用户是否接受删除多余的比赛
			isAcceptMore (val) {
				if (val) {
					const threshold = this.threshold;
					this.$dialog({
						title: `Exceeding ${threshold} Selections`,
						'class': 'm-exceeding-bets-dialog',
						content: `We may not be adding more than ${threshold} selections to the betslip. Is that OK for you?`,
						button: ['CANCEL', 'OK'],
					}).onClose(res => {
						if (res === 1) {
							this.loadBetslipData(this.stageBetOutcomes);
							this.updateStageBetOutcomes([]);
						}
						this.updateIsAcceptMore(false);
					});
				}
			}
		},
		components: {
			List,
			Stake,
			SanpNav,
			Success,
			shareCode,
			Check,
			BookingCode,
			BetLoading,
			oddsBoostTip
		},
		computed: {
			...mapState('layout', ['showRight']),
			...mapState('assetsInfo', ['isLogin', 'giftNum', 'balance']),
			...mapGetters('assetsInfo', ['fomatBalance']),
			...mapGetters('betslip', ['betCount', 'supportMultiple', 'supportSystem', 'supportFlexibet', 'validEventSize', 'showBoostTips', 'canBoost']),
			...mapState('betslip', ['fastMode', 'currentType', 'acceptStatus', 'loading',
				'systemThreshold', 'threshold', 'reachMaxThreshold', 'reachChangeMaxSystemThreshold', 'autoAcceptChange',
				'isAcceptMore', 'stageBetOutcomes']),
			...mapState('betslipStake', ['betLoading', 'orderInfo']),
			isShowAcceptChange () {
				// 当前选择自动接收赔率，但是只接受 odds change的这种情况
				if (this.autoAcceptChange) {
					// 当前所有比赛都可以投注，证明可能只有赔率的变化
					if (this.betCount === this.validEventSize.outcomeCount) {
						return false;
					}
					return this.acceptStatus;
				}
				return this.acceptStatus;
			}
		},
		methods: {
			...mapMutations('layout', [TOGGLE_RIGHT]),
			...mapMutations('betslip', [UPDATE_BET_TYPE, UPDATE_REACH_MAX_THRESHOLD, UPDATE_REACH_CHANGE_MAX_SYSTEM_THRESHOLD, CHANGE_LOADING_STATUS, CHANGE_AUTO_ACCEPT_CHANGES,
				UPDATE_IS_ACCEPT_MORE,
				UPDATE_STAGE_BET_OUTCOMES,
				UPDATE_FAST_MODE]),
			...mapMutations('betslip', {
				loadBetslipData: LOAD_BETSLIP
			}),
			...mapActions('betslip', ['refreshBetslip', 'loadBetslip', 'clearAllBetSlip', 'verifyOddsBoost']),
			...mapMutations('betslipStake', [RESET_STAKE]),
			...mapActions('betslipStake', ['fetchBonusConfig', 'fetchFlexiBetConfig', 'subFlexiBetPush', 'subFlexiBetPush', 'unSubFlexiBetPush']),
			...mapMutations('coupons', {
				changeCouponBetType: couponMutationTypes.UPDATEBETTYPE,
				updatecheckedgiftid: couponMutationTypes.UPDATECHECKEDGIFTID,
				resetCoupons: couponMutationTypes.RESETCOUPONSLIST
			}),
			handleChangeAutoAcceptChanges (status) {
				// 已经登录了,这里没有处理超时的情况，因为没有必要
				if (window.loginStatus) {
					this.changeAutoAcceptChanges(LS.set(`acceptChanges_${cookie('userId')}`, +status));
				} else {
					try {
						sessionStorage.setItem('acceptChanges', +status);
					} catch (e) {
						console.error(e);
					}
				}
				this.changeAutoAcceptChanges(status);
			},
			handleLoginStatus () {
				// 登录后取当前用户的接收赔率变化的要求
				this.changeAutoAcceptChanges(LS.get(`acceptChanges_${cookie('userId')}`) === '1');

				if (window.loginStatus) {
					this.verifyOddsBoost();
				}
			},
			// 清除全部
			clearAll () {
				this.resetStake();
				this.resetCoupons(true);
				this.clearAllBetSlip();

				// 去掉url参数中的shareCode参数
				const shareCode = URL.getPara('shareCode');
				if (shareCode && history.replaceState) {
					const modifiedUrl = URL.removePara(document.URL, 'shareCode');
					history.replaceState(null, document.title, modifiedUrl);
				}
			},
			changePlayType(type) {
				this.changeCouponBetType(type);
				this[UPDATE_BET_TYPE](type);
			},
			handleClick () {},
			closeBetslip () {
				this.toggleRight(false);
			},
			failLoad() {
				this.loadingData();
			},
			handleLogin() {
				if (this.$popupLogin) {
					this.$popupLogin.show();// use popup login.
				} else {
					console.log('Need to load components/login/popupLogin.js in root component ');
				}
			},
			jumpToMe() {
				window.location.href = userCenterUrl.myCenterHome;
			},
			alertMaxThreshold () {
				this.$dialog({
					title: 'Note',
					content: `There cannot be over ${this.threshold} selections within a betslip. Sorry for the inconvenience.`,
					button: ['OK'],
				});
			},
			alertMaxSystemThreshold () {
				this.$dialog({
					title: 'Note',
					content: `There cannot be over <span class="m-tips-strong">${this.systemThreshold}</span> selections under System.Sorry for the inconvenience.`,
					button: ['OK'],
				});
			},
			// 点击system上的按钮
			handleSystemClick () {
				if (this.betCount > 15) {
					this.alertMaxSystemThreshold();
				}
			},
			// 加载betslip的数据
			getBetslip () {
				const query = URL.getPara(true);
				if (query && (query.code || query.shareCode)) {
					const params = {
						betCode: query.code || query.shareCode
					};
					this.changeLoadingStatus(true);
					// 带入后直接打开
					let fastMode = LS.get('wap_last_betslip_mode') || '0';
					fastMode = !!+fastMode;
					if (!fastMode) {
						this.toggleRight(true);
					}
					// 本地有数据先刷新本地数据在请求code
					if (this.betCount) {
						this.refreshBetslip()
						.then(() => this.loadBetslip(params))
						.then(() => {
							this.changeLoadingStatus(false);
						})
						.catch(() => {
							this.changeLoadingStatus(-1);
						});
					} else {
						this.loadBetslip(params)
						.then(() => {
							this.changeLoadingStatus(false);
						})
						.catch(() => {
							this.changeLoadingStatus(-1);
						});
					}
				} else {
					return this.refreshBetslip();
				}
			},
			loadingData () {
				const res = [
					this.verifyOddsBoost(),
					this.fetchBonusConfig(),
					this.fetchFlexiBetConfig(),
					this.getBetslip(),
					this.subFlexiBetPush()
				];
				return Promise.all(res);
			},
			noop () {}
		},
		created () {
			this.subFlexiBetPush();
			EventBus.$on(commonEvent.UPDATE_LOGIN_STATUS, this.handleLoginStatus);
			if (LS.get('isOpenBetslip')) {
				LS.remove('isOpenBetslip');
			}
		},
		destroyed() {
			this.unSubFlexiBetPush();
			EventBus.$off(commonEvent.UPDATE_LOGIN_STATUS, this.handleLoginStatus);
		},
		mounted () {
			this.loadingData();
		}
	};
</script>

<style lang="less">
@import '~base/styles/variable.less';
@import 'base/styles/icon.less';
@snapGray: #50545f;

.m-betslips{
	.m-loading-wrap{
		position: absolute;
		z-index:1;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: @white;
		.m-loading{
			margin-top: 30%;
		}
	}
	.auto-accept-change{
		input{
			color: @dark;
			& + label {
				background-color: @whiteGray;
				border: 1px solid @midGray;
			}
			& + label:before {
				content: ' ';
				background:@midGray;
				border: 1px solid @dark;
				box-sizing: border-box;
			}
			&:checked + label{
				background-color: @green;
				border: 1px solid @green;
			}
		}
	}
	.m-input{
		display: block;
		.m-input-wrapper{
			padding: 0 16/@rem;
			display: flex;
			justify-content: space-between;
			align-items: center;
			&>span{
				flex: 1;
				display: block;
			}
			.currency{
				text-align: right;

				em {
					margin-right: 4/@rem;
				}
			}

			.m-bet-sep {
				width: 140/@rem;
				display: inline-block;
				flex: none;
			}

			.bet-count{
				text-align: right;
			}
			.m-keybord-input{
				flex: 0 0 auto;
			}
		}
	}

	.m-market-desc-wrapper {
		.m-input-wrapper {
			padding: 0;
		}

		.m-input .m-error-info {
			padding: 0;
		}

		.m-keybord-input {
			height: 22/@rem;
			width: 90/@rem;
			line-height: 22/@rem;
			box-sizing: border-box;
			margin-bottom: 2/@rem;
		}
	}
}

.m-betslips{
	background: @white;
	height: 100%;
	width: 100%;
	position: absolute;
	top:0px;
	right: 0px;
	.flex-wrapper{
		min-height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		&>div{
			flex: 0 0 auto;
		}
		.m-scroll-wrapper{
			flex: 1 0 auto;
			position: relative;
			// 不能加hidden否则红包列表在iphone中就会被截断
			// overflow: hidden;
			.m-scroll{
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				overflow: auto;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				.no-items{
					position: absolute;
					top: 50%;
					text-align: center;
					font-size: 14/@rem;
					color: @darkGray;
					width: 100%;
				}
			}
		}
		// android 1.1写成 flex 1 1 auto 会导致该元素无法自动放大
		.m-betslips-outcomes{
			flex: 0 1 auto;
		}
		.m-betslips-stake-wrapper{
			flex: 0 1 auto;
		}
	}
	.m-bet-head{
		background-color: @dark;
		.m-list-nav {
			padding: 0 17/@rem;
			display: flex;
			color: @white;
			&>div {
				box-sizing: border-box;
				display: block;
				flex: 1;
			}
		}
		.m-sec-opt{
			padding: 0 17/@rem;
			display: flex;
			justify-content: space-between;
			color: @white;
			overflow: hidden;

			.before-text{
				padding-right: 12/@rem;
			}
			padding-bottom: 8/@rem;
			.remove-all{
				margin-right: 6/@rem;
				color: @midGray;
				// 设置flex为1的话，会导致部分低配机型下，remove all和accept change挤出边框
				// flex: 1;
				.m-icon-trash();
				&:before{
					font-size: 16/@rem;
					color: @midGray;
					margin-right: 5/@rem;
					line-height: 1;
				}
			}
			.auto-accept-change{
				display: block;
				text-align: right;
				// flex: 1;
			}
		}
		// 顶部信息
		.m-list-nav{
			font-size: 0px;
			height: 44/@rem;
			line-height: 44/@rem;
			.m-count{
				width: 50%;
				font-size: 16/@rem;
				.m-icon-back {
					display: inline-block;
					height: 100%;
					padding: 0 10/@rem;
					margin: 0 10/@rem 0 -10/@rem;

					.m-icon-left2();
				}
				.m-bag{
					font-size: 14/@rem;
					background-color: fade(@lightGray, 15%);
					height: 24/@rem;
					min-width:24/@rem;
					border-radius: 24/@rem;
					display: inline-block;
					text-align: center;
					line-height: 24/@rem;
				}
				flex: 0 1 auto;
			}
			.m-login-status{
				width: 50%;
				color: @yellow;
				font-size: 14/@rem;
				text-align: right;
				overflow: hidden;
				.m-login-yes{
					font-size: 14/@rem;
					font-weight: 500;
					color: @yellow;
					text-overflow: ellipsis;
					white-space: nowrap;
					overflow: hidden;
					display: block;
					.m-user-icon{
						padding-left: 12/@rem;
						color: @white;
						.m-icon-user();
						&:before{
							font-size: 16/@rem;
						}
					}
				}
			}
		}
		// 当前玩法切换 singles multiple system
		.m-list-bet-type{
			padding: 4/@rem 5/@rem 0;
			.m-list-bet-type-item{
				flex: 1;
				background-color: @snapGray;
				height: 36/@rem;
				line-height: 36/@rem;
				font-size: 14/@rem;
				font-weight: bold;
				border-top-left-radius: 4/@rem;
				border-top-right-radius: 4/@rem;
				color: @white;
				margin-right: 3/@rem;
				display: block;
				&:last-child{
					margin: 0;
				}
				&.active{
					background-color:@white;
					color: @dark;

					.m-icon-boost {
						background: url(./image/boost.png) no-repeat;
						background-size: contain;
						background-position: center;
					}
				}
				&.m-snap-nav-item--disabled{
					opacity: .5;
					text-decoration:line-through;
				}
			}
		}
		// 当前错误提示
		.change-wrong-message{
			color: @white;
			height: 22/@rem;
			line-height: 22/@rem;
			background-color: @darkerRed;
			text-align: center;
		}
	}
	.m-close{
		width: 45/@rem;
		height: 48/@rem;
		position: absolute;
		left: -45/@rem;
		bottom: 16/@rem;
		text-align: center;
		&>div{
			text-align: right;
		}
	}
}

.m-icon-flexibet{
	display: inline-block;
	background: @midGreen;
	color: @white;
	position: relative;
	margin-left: 4/@rem;
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
		border-top: 8/@rem solid @lightGreen;
		border-left: 1px solid @lightGreen;
		border-right: 1px solid transparent;
		border-bottom: 8/@rem solid transparent;
	}
}

.m-icon-boost {
	display: inline-block;
	vertical-align: middle;
	width: 20/@rem;
	height: 15/@rem;
	margin-left: 4/@rem;
	margin-top: -2/@rem;
	background: url(./image/boost2.png) no-repeat;
	background-size: contain;
	background-position: center;
}

.m-dialog.m-exceeding-bets-dialog {
	.m-dialog-head {
		h1 {
			height: auto;
			font-size: 18/@rem;
		}
	}
}
</style>
