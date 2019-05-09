<template>
<transition name="slide-fade">
	<div class="m-bingo-buy" ref="bingoBuy" v-show="visible">
		<div class="m-buy-panel">
			<div class="m-buy-header">
				<div class="m-buy-title">
					<span class="m-text">Select Shares</span> <br>
					<span class="m-desc">（{{showPrice}} {{showCurrency}} Per Share）</span>
				</div>

				<a class="m-close-btn" @click="close"></a>

				<div class="m-buy-desc">The more shares you get, the more chances to win !</div>
			</div>

			<div class="m-buy-middle">
				<Counter v-model="shares" :max="goods.leftAmount" :maxLength="8" />

				<div class="m-buy-meta">
					<div class="m-row m-buy-amount">
						<div class="m-label">Amount ({{showCurrency}})</div>
						<div class="m-value">{{payAmount.text}}</div>
					</div>

					<Coupons
						:sportType="sportType"
						:totalStake="payAmount.value"
						:isShowNote="false"
						tipsKey="s_bingo_tips">
					</Coupons>
				</div>
			</div>

			<div class="m-buy-footer">
				<a :class="['m-buy-btn', {
					disabled: isDisabled,
					'is-loading': loading
				}]" @click="submit">
					<div class="m-join">Join Now</div>
					<div v-show="!loading">
						<span class="m-text">About to pay({{showCurrency}})</span>
						<span class="m-num">{{aboutToPay.text}}</span>
					</div>
				</a>
			</div>
		</div>
		<!-- 显示在中间的loading状态 -->
		<BetLoading v-show="loading || betLoading"></BetLoading>
	</div>
</transition>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';
import * as couponMutationTypes from 'store/coupons/mutationTypes';
import { showCurrencyOrigin } from 'config/currencyConfig';
import { formatNumber } from 'utils';
import { pagePath } from 'config/pageConfig';
import { userCenterUrl } from 'config/mycenter/dataConfig.js';
import commonEvent from 'config/eventConfig/commonEvent';
import depositConfig from 'config/deposit/record';
import { EventBus } from 'kernel/js/eventBus.js';
import Coupons from 'components/coupons/index.vue';
import BetLoading from 'components/betLoading';

import Counter from './counter.vue';
import buyMixin from './buyMixin.js';
import { getLatestPeriod } from '../../js/utils.js';

export default {
	name: 'BingoBuy',
	mixins: [buyMixin],
	components: {
		Counter,
		Coupons,
		BetLoading
	},
	data() {
		return {
			loading: false, // 提交按钮的loading状态
			betLoading: false, // BetLoading 组件的loading 状态
			visible: false,
			isDisabled: false, // 实际用于判断表单是否可提交，与 disabled 间延迟同步
			shares: '1',
			goods: {},
			callback: null,
			sportType: 4 // bingo
		};
	},
	computed: {
		...mapGetters('coupons', [
			'checkItem',
			'checkGiftId'
		]),
		// 实时判断表单是否可提交
		disabled() {
			const shares = Number(this.shares);
			return !shares || shares > this.goods.leftAmount || this.loading;
		},
		discount() {
			if (this.checkItem) {
				const { curBal = 0 } = this.checkItem;
				const payAmount = this.payAmount.value;
				const value = curBal > payAmount ? payAmount : curBal;
				return {
					value,
					text: `-${this.showCurrency} ${formatNumber(value, 0)}`
				};
			}
			return {
				value: 0,
				text: 'Unused'
			};
		},
		showPrice() {
			return formatNumber(this.goods.sharePrice, 0);
		},
		showCurrency() {
			return showCurrencyOrigin;
		},
		payAmount() {
			const value = this.goods.sharePrice * Number(this.shares);
			return {
				value,
				text: formatNumber(value, 2)
			};
		},
		aboutToPay() {
			let value = this.payAmount.value - this.discount.value;
			if (value < 0) {
				value = 0;
			}
			return {
				value,
				text: formatNumber(value, 2)
			};
		}
	},
	watch: {
		$route(val) {
			this.close();
			this.reset();
		},
		disabled(val) {
			/* 异步改变表单提交状态，以避免输入状态变化及值操作导致的临界混乱，简单来说，就是clear输入值后, 点击其他按钮使键盘blur, 输入值强制置为1，此时按钮点击事件都会触发，提交按钮从 disabled 状态瞬间提交, 造成混乱blablabla... */
			clearTimeout(this.timer);
			this.timer = setTimeout(() => {
				this.isDisabled = val;
			}, 16);
		}
	},
	methods: {
		...mapActions('coupons', [
			'getCouponsGroup'
		]),
		...mapMutations('coupons', {
			resetCoupons: couponMutationTypes.RESETCOUPONSLIST,
			updateRealCouponsGroupList: couponMutationTypes.UPDATE_REAL_COUPONS_GROUP_LIST
		}),
		close() {
			this.visible = false;
		},
		show() {
			this.visible = true;
		},
		reset() {
			this.loading = false;
			this.shares = '1';
			this.goods = {};
			this.callback = null;
			this.resetCoupons(true);
			return this;
		},
		handleLogin() {
			if (this.$popupLogin) {
				this.$popupLogin.show();
			} else {
				location.href = `${pagePath.login}?okUrl=${encodeURIComponent(location.href)}`;
			}
		},
		loadCoupons() {
			this.resetCoupons(false);
			this.getCouponsGroup({
				betType: 0
			}).then(() => {
				this.updateRealCouponsGroupList(this.payAmount.value);
			});
		},
		async submit() {
			if (this.isDisabled) return false;

			// 未登录
			if (!window.loginStatus) {
				this.handleLogin();
				return false;
			}

			this.loading = true;

			const { goodsId, roundId, sharePrice } = this.goods;

			const body = {
				boughtAmount: +this.shares,
				goodsId,
				roundId,
				sharePrice,
				actualPayAmount: this.aboutToPay.value,
				currency: showCurrencyOrigin
			};

			if (this.checkGiftId) {
				// 优惠券
				body.favor = {
					favorInfo: [{
						giftId: this.checkGiftId
					}]
				};
			}

			try {
				const res = await this.buy(body);
				this.loading = false;
				this.close();
				this.$toast('Purchase Succeeded');

				this.loadCoupons();

				this.callback && this.callback({
					type: 'success',
					data: res
				});

				if (this.aboutToPay.value > 0) {
					// 更新余额
					EventBus.$emit(commonEvent.UPDATE_ACCOUNT_BALANCE);
				}
			} catch (err) {
				this.loading = false;
				this.resetCoupons(true);

				if (err.login === false) {
					return this.handleLogin();
				}

				switch (err.bizCode) {
				// shares not enough, 商品在该期剩余数量不足
				case 4100:
					this.$dialog({
						title: null,
						content: err.msg,
						button: ['*OK']
					}).onBtnClick(btnType => {
						this.$dialog();
						this.close();
						this.callback && this.callback({
							type: 'error',
							data: err
						});
					});
					break;
				// balance not enough, 余额不足下单失败
				case 4200:
					this.$dialog({
						title: 'Balance Insufficient',
						content: err.msg || 'There is not enough balance in your account to buy the shares.',
						button: ['LATER', '*DEPOSIT']
					}).onBtnClick(btnType => {
						if (+btnType === 1) { // DEPOSIT
							// 充值成功后点击Done按钮要到bingo首页
							depositConfig.setRecord(pagePath.sportybingo);
							this.close();
							location.href = userCenterUrl.deposit;
						} else { // LATER
							this.$dialog();
							this.close();
						}
					});
					break;
				// fail to use gifts， 使用红包失败
				case 4210:
					this.$dialog({
						title: 'Gift unavailable',
						content: err.msg || 'The gift you have chosen can not be used at this time, please try another one.',
						button: ['*OK']
					});
					break;
				// account is frozen, 账户冻结
				case 4220:
					this.$dialog({
						title: null,
						content: 'This account has been temporarily locked for security concern. If you need any help, please contact us at: 0207640825',
						button: ['*OK']
					});
					break;
				// round finished, 期次已经卖完,需要询问用户是否参与最新期次并获取最新期次号
				case 4400:
					this.$dialog({
						title: null,
						content: err.msg || 'This round has been finished. Do you want to join the next round?',
						button: ['CANCEL', '*JOIN NOW']
					}).onBtnClick(async btnType => {
						if (+btnType === 1) { // join now
							this.betLoading = true;
							try {
								const latestRoundId = await getLatestPeriod(this.goods.goodsId);
								this.betLoading = false;
								const options = {
									name: 'detail',
									params: { id: latestRoundId },
									query: { goodsId: this.goods.goodsId }
								};

								this.$dialog();
								this.close();

								if (this.$route.name === 'detail') {
									this.$router.replace(options);
								} else {
									this.$router.push(options);
								}
							} catch (err) {
								this.betLoading = false;
								this.$dialog();
								this.$dialog({
									title: null,
									content: 'Sorry, something went wrong. Please try again later.',
									button: ['*OK']
								});
								this.close();
							}
						} else { // cancel
							this.$dialog();
							this.close();
							this.callback && this.callback({
								type: 'error',
								data: err
							});
						}
					});
					break;
				// round finished or closed, 期在24小时内没有卖完，或者已卖完，同时不存在同一个项目的下一期次
				case 4600:
					this.$dialog({
						title: null,
						content: err.msg || 'This round has been finished or closed. Please check on other issues.',
						button: ['*OK']
					}).onBtnClick(btnType => {
						this.close();
						if (this.$route.name === 'popular') {
							this.callback && this.callback({
								type: 'error',
								data: err
							});
						} else {
							this.$router.push({ name: 'home' });
						}
					});
					break;
				// 不允许用户全包（即一次性买光全部份额）
				case 19001:
					this.$dialog({
						title: null,
						content: err.msg || 'Your stake has exceeded maximum prize amount, please reduce the amount of shares.',
						button: ['*OK']
					});
					break;
				// 请求超时
				case 19999:
					this.$dialog({
						title: null,
						content: err.msg || 'Your purchase request has been submitted, awaiting for confirmation. You can check the records in a short while.',
						button: ['*OK']
					}).onBtnClick(btnType => {
						this.close();
						if (this.$route.name === 'mine') { // 本身就在mine，刷新单个
							this.callback && this.callback({
								type: 'error',
								data: err
							});
						} else {
							this.$router.push({ name: 'mine' });
						}
					});
					break;
				default:
					this.$dialog({
						title: null,
						content: err.msg || 'Sorry, something went wrong. Please try again later.',
						button: ['*OK']
					}).onBtnClick(btnType => {
						this.close();
					});
				}
			}
		},
		closePanel(e) {
			if (this.loading) return;
			if (!e.target.closest('.m-buy-panel')) {
				this.close();
			}
		}
	},
	mounted() {
		this.$refs.bingoBuy.addEventListener('click', this.closePanel);
	},
	beforeDestroy() {
		this.$refs.bingoBuy.removeEventListener('click', this.closePanel);
	}
};
</script>

<style lang="less">
@import 'base/styles/variable.less';
@import 'base/styles/icon.less';

.m-bingo-buy {
	position: absolute;
	top: 0;
	left: 0;
	z-index: 800;
	width: 100%;
	height: 100%;
	background: fade(@black, 52%);
}

.m-buy-panel {
	position: absolute;
	bottom: 0;
	left: 0;
	width: 100%;
	padding-top: 16/@rem;
	background: @white;

	.m-buy-header {
		position: relative;
		padding: 0 16/@rem;
		text-align: center;

		.m-buy-title {
			color: @dark;
			line-height: 19/@rem;

			.m-text {
				font-size: 16/@rem;
				font-weight: 500;
			}

			.m-desc {
				font-size: 12/@rem;
			}
		}

		.m-close-btn {
			position: absolute;
			right: 12/@rem;
			top: -3/@rem;
			color: @darkGray;
			font-size: 14/@rem;
			padding: 4/@rem;
			.m-icon-close();
		}

		.m-buy-desc {
			margin-top: 5/@rem;
			font-size: 12/@rem;
			color: @green;
			line-height: 14/@rem;
		}
	}

	.m-buy-middle {
		.m-keyboard {
			margin: 10/@rem 0 11/@rem;
		}

		.m-buy-meta {
			padding: 0 16/@rem;

			.m-buy-gifts {
				.m-label {
					.m-num {
						color: @green;
					}
				}

				.m-value {
					.has-discount {
						color: @green;
					}

					.m-icon-more {
						.m-icon-arrow--right();
						color: @darkGray;
					}
				}
			}
		}
	}

	.m-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 14/@rem;
		font-weight: 500;
		color: @dark;
		line-height: 36/@rem;

		.m-label {
			width: 60%;
		}
		.m-value {
			width: 40%;
		}

		.m-value {
			text-align: right;
		}
	}

	.m-buy-footer {
		margin-top: 23/@rem;

		.m-buy-btn {
			display: block;
			background: @green;
			color: @white;
			text-align: center;
			width: 100%;
			height: 52/@rem;
			padding: 8/@rem 0;
			line-height: 18/@rem;
			box-sizing: border-box;
			text-decoration: none;

			&:active, &:visited, &:hover {
				text-decoration: none;
			}

			&.disabled {
				background-color: @midGray;
				color: @darkGray;
			}

			// 提交状态
			&.is-loading {
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
			}

			.m-join {
				font-size: 16/@rem;
				font-weight: bold;
			}

			.m-text {
				font-size: 12/@rem;
			}

			.m-num {
				font-size: 14/@rem;
				font-weight: bold;
			}
		}
	}
}

.slide-fade-enter-active {
  transition: all .2s ease;
}
.slide-fade-leave-active {
  transition: all .2s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to {
  // transform: translateY(100%);
  opacity: 0;
}

</style>
