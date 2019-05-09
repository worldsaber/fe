<template>
		<form class="m-fm-wrap">
			<div class="m-fm-row">
				<div class="m-fm-left">Deposit From</div>
				<div class="m-fm-right m-fm-deposit-from"><em class="icon-mpesa"></em><span>M-PESA (****{{mobile.slice(-4)}})</span></div>
			</div>
			<div class="m-fm-row m-fm-offer">
				<div class="m-fm-left">
					<p class="offer-title">Select Amount({{showCurrencyOrigin}})</p>
				</div>
				<div class="m-fm-right ">
					<div :class='["m-fm-options-list", extraCls]'>
						<div :class="['m-options-item', {'m-options-item-active': getOfferAmount(item) == amount}]" v-for="item in extraOffer" :key="item.amount" :data-amount="getOfferAmount(item)" @click="onClickOption">
							<!-- 后台配置调整了位置，跟以前反了 -->
							<p class="m-options-item-btntext">{{item.text}}</p>
							<p class="m-options-item-text" v-if="item.btnText">{{item.btnText}}</p>
						</div>
					</div>
				</div>
			</div>

			<div class="m-fm-row">
				<div class="m-fm-left">Amount({{showCurrencyOrigin}})</div>
				<div class="m-fm-right m-fm-input">
					<AfInput
						v-model="amount"
						icon="delete"
						:maxlength="18"
						:error="isError"
						:iconClick="clearAllInput"
						@change="validatorAmount"
						@blur="handleBlur"
						>
					</AfInput>
					<GiftTip />
					<div class="m-error-infos">{{errorInfo}}</div>
				</div>
			</div>
			<template v-if="showTip">
				<div class="deposit-mpesa-wrap" v-if="isOverThreshold && mpesaCharges">
					<div class="mpesa-item">
						<span class="mpesa-label">M-Pesa Charges({{showCurrencyOrigin}}):&nbsp;&nbsp;</span>
						<span class="mpesa-value">{{mpesaCharges}}</span>
					</div>
					<div class="mpesa-item">
						<span class="mpesa-label">You Will Receive({{showCurrencyOrigin}}):&nbsp;&nbsp;</span>
						<span class="mpesa-value">{{formatAmount}} + {{mpesaCharges}} cash back</span>
					</div>
				</div>
				<div class="deposit-free-tip" v-else>
					<span class="free-label">Free Deposits for {{showCurrencyOrigin}} {{freeThreshold}} or more </span>
					<span class="charge-label">(SportyBet will credit your M-pesa charges to your balance.)</span>
				</div>
			</template>
			<div class="m-fm-row">
				<div class="m-fm-left">&nbsp;</div>
				<div class="m-fm-right">
					<div class="m-btn-wrapper">
						<AfButton
							extraType="primary"
							:disabled="submitStatus"
							:loading="loading"
							@click.prevent="submitHandler"
							><template v-if='!loading'>
								<span class="m-btn-label">{{btnLabel}}</span>
							</template>
							<template v-else>Loading...</template>
						</AfButton>
					</div>
					<div class="m-btn-comment" v-if="buttonComment">{{buttonComment}}</div>
				</div>
			</div>
		</form>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { userCenterUrl, payBillNumber } from 'config/order/userCenterConfig';
import { formatNumber } from 'utils';
import AfButton from 'packages/button/button.vue';
import { getShowCurrency, showCurrencyOrigin } from 'config/currencyConfig';
import { AfInput } from 'packages/input';
import '../../../mockData/deposit/index?debug';
import popMsg from '../js/popMsg';
import GiftTip from './giftTip';
import { showTransThreshold, showDpMax, dpMax } from '../js/config';

export default {
	name: 'deposit',
	mixins: [popMsg],
	components: {
		AfButton,
		AfInput,
		GiftTip
	},
	props: {
		quickInput: {
			type: Object,
			'default': {}
		},
		freeThreshold: {
			type: Number
		},
		feeRange: {
			type: Array
		}
	},
	data () {
		return {
			amount: '',
			errorInfo: '',
			loading: false,
			isSuccess: false,
			tradeId: '',  // 交易id

			showCurrency: getShowCurrency(),
			showCurrencyOrigin,
			showDpMax,
			showTransThreshold,
			dpMax,
		};
	},
	computed: {
		...mapState('userCenter', {
			mobile: 'phone'
		}),
		...mapGetters('userCenter', {
			wholeMobile: 'wholePhone'
		}),
		extraOffer() {
			return this.quickInput.extraOffer || [];
		},
		extraCls() {
			return this.extraOffer.length > 2 ? '' : 'm-fm-options-list-lt';
		},
		submitStatus () {
			return this.amount === '' || this.errorInfo !== '';
		},
		isError () {
			return this.errorInfo !== '';
		},
		offers() {
			return [...this.extraOffer];
		},
		buttonComment() {
			let comment = '';
			if (this.isError) {
				return comment;
			}
			// 49, 99 的 extra 奖励
			const amount = parseInt(this.amount, 10);
			const configOffer = this.inConfigOffer;

			if (configOffer) {
				comment = configOffer.bounty ? `Get ${this.showCurrencyOrigin} ${Math.floor(configOffer.bounty / 10000)} Extra after Top Up` : '';
			}

			if (comment) {
				return comment;
			}
			// mpesa charges
			if (amount && this.isOverThreshold && this.mpesaCharges) {
				const charges = Math.floor(parseFloat(this.mpesaCharges, 10));
				return `Get ${this.showCurrencyOrigin} ${charges} Extra after Top Up`;
			}
		},
		btnLabel() {
			let amount = parseInt(this.amount, 10);
			// 配置的选项
			const configOffer = this.inConfigOffer;
			if (configOffer) {
				amount = configOffer.amount;
			}

			if (this.buttonComment) {
				return `Pay ${formatNumber(amount)}`;
			}
			return 'Top Up Now';
		},
		mpesaCharges() {
				// 根据 amount 计算mpesa 收费
			const range = this.feeRange;
			const amount = parseInt(this.amount, 10);
			const item = range.find(item => item.lower <= amount && item.upper >= amount);
			return item && item.amount;
		},
		isOverThreshold() {
			const amount = parseInt(this.amount, 10);
			return amount >= this.freeThreshold;
		},
		showTip() {
			return !this.isError;
		},
		inConfigOffer() {
			const offers = this.offers;
			// 49, 99 的 extra 奖励
			const amount = parseInt(this.amount, 10);

			return offers.find(offer => {
				const totalAmount = this.getOfferAmount(offer);
				return totalAmount === amount;
			});
		},
		payAmount() {
			let amount = parseInt(this.amount, 10);
			// 配置的选项
			const configOffer = this.inConfigOffer;
			if (configOffer) {
				amount = configOffer.amount;
			}
			return amount;
		},
		formatAmount() {
			return formatNumber(this.amount);
		}
	},
	methods: {
		getOfferAmount(offer) {
			return offer.amount + Math.floor(offer.bounty / 10000);
		},
		clearAllInput () {
			this.amount = '';
			this.validatorAmount({ value: '' });
		},
		// 当输入框内小数点前数字全部删除后剩 00时，光标失去聚焦后，输入框清空
		handleBlur () {
			const mount = this.amount;
			if (/^0+$/.test(mount)) {
				this.amount = '';
				this.errorInfo = '';
			}
		},
		validatorAmount (data) {
			const amount = data.value;
			if (amount) {
				// replace space
				if (/\s/.test(amount)) {
					this.amount = amount.replace(/\s/g, '');
				} else if (/[^0-9]/.test(amount)) {
					this.errorInfo = 'Please enter a valid integer.';
				} else if (amount > this.dpMax) {
					this.errorInfo = `Maximum per transaction is ${this.showCurrency}${this.showDpMax}`;
				} else {
					this.errorInfo = '';
				}
			} else {
				this.errorInfo = '';
			}
		},
		// Top Up Now click handler
		submitHandler () {
			if (this.amount === '') {
				this.errorInfo = 'Amount is required.';
			} else if (!this.submitStatus && !this.loading) {
				this.loading = true;
				this.submitPost().catch(() => {
					this.loading = false;
					this.showMsgPop({
						msg: 'Please check your internet connection and try again.'
					});
				});
			}
		},
		submitPost () {
			// 提交让input失去焦点，这样防止用户ajax回来后弹框出来了按enter按键还能发送请求
			document.querySelector('.m-fm-wrap .m-input').blur();
			// console.log(this.wholeMobile + ';' + this.amount * 10000 + ';');
			return new Promise((resolve, reject) => {
				fetch('/pocket/v1/bankTrades/bankTrade/deposit', {
					method: 'POST',
					headers: new Headers({
						'Content-Type': 'application/json'
					}),
					body: JSON.stringify({
						phoneNo: this.wholeMobile,
						payAmount: this.payAmount * 10000,
						payChId: 10   // 付款渠道（10-Mpesa） 暂时只有10
					})
				})
				.then(res => res.json())
				.then(data => {
					this.loading = false;
					const { bizCode: code, message } = data;
					const originData = data.data || {};

					if (code === 10000) {
						this.tradeId = originData.tradeId;

						if (originData.status === 72) { // risk audit
							return this.showErrorPop(code, message);
						}

						this.showSuccPop();
					} else {
						return this.showErrorPop(code);
					}
				})
				.catch(err => reject(err));
			});
		},
		// 显示成功弹出层
		showSuccPop () {
			this.popMsg = this.showMsgPop({
				msg: 'Lipa na M-PESA Online transaction has been initiated on your phone! Please enter service PIN to confirm the deposit!',
				buttonList:	[{
					type: 'text',
					text: 'Cancel'
				}, {
					type: 'primary',
					text: 'Completed'
				}] }).onClose(this.queryInfo);
		},
		showErrorPop (code, message) {
			let msg;
			if (code === 62100) {
				msg = `Maximum daily transaction value is ${this.showCurrency}${this.showTransThreshold}. The maximum you can send in a day is ${this.showCurrency}${this.showTransThreshold}.`;
			} else {
				msg = message || 'Sorry，something went wrong. Please try again later.';
				// msgTitle = 'Something went wrong';
				// msg = `M-PESA account is unable to accept your payment at this time. You can also use paybill number(${payBillNumber}) to deposit.`;
			}
			this.showMsgPop({ msg });
		},
		// 查询交易
		queryInfo () {
			// console.log(this.tradeId);
			return new Promise((resolve, reject) => {
				fetch('/pocket/v1/bankTrades/bankTrade/' + this.tradeId, {
					method: 'GET',
					// body: {
					// 	tradeId: this.tradeId
					// }
				})
				.then(res => res.json())
				.then(data => {
					const code = data.bizCode;
					const status = (data.data || {}).status;
					if (code === 10000) {
						if (status === 20) { // 成功
							this.isSuccess = true;
							this.$emit('success', {
								tradeId: this.tradeId,
								amount: formatNumber(this.payAmount, 2)
							});
						} else if (status === 10) { // 等待支付
							this.showMsgPop({
								msg: 'Your deposit request has been submitted, awaiting for confirmation. You can check the deposit records in a short while.'
							}).onClose(this.goToBizQueryPage);
						} else { // 30-FAIL, 90-CLOSED
							const msgTitle = 'Error during transaction';
							const msg = `M-PESA account is unable to accept your payment at this time.You can also use paybill number(${payBillNumber}) to deposit.`;
							this.showMsgPop({ msg, msgTitle });
						}
					} else {
						this.showMsgPop({
							msg: 'Sorry，something went wrong. Please try again later.',
						});
					}
				})
				.catch(() => {
					this.showMsgPop({ msg: 'Please check your internet connection and try again.' });
				});
			});
		},
		goToBizQueryPage () {
			window.location = userCenterUrl[5];
		},
		onClickOption(evt) {
			const target = evt.currentTarget;
			const value = target.dataset.amount;

			// 填充input
			this.amount = value;
			// 重新校验输入
			this.validatorAmount({
				value
			});
		}
	}
};
</script>
<style lang="less">
.m-fm-wrap{
	color: #353a45;
	.m-fm-input{
		font-weight: bold;
	}
}
.m-fm-offer{
	.offer-content{
		font-size: 12px;
		line-height: 40px;

	}
}
.m-fm-row{
	display: flex;
	line-height: 40px;
	padding: 10px 0;
}

.m-fm-left {
	width: 160px;
	flex-basis: 160px;
	font-size: 16px;
}

.m-fm-right{
	width: 440px;
	flex-basis: 440px;
	&.m-fm-input{
		flex-grow: 1;
	}
}
.m-fm-deposit-from{
	display: flex;
	align-items: center;
	font-size: 16px;
	font-weight: bold;
	.icon-mpesa{
		display: inline-block;
		width: 43px;
		height: 40px;
		margin-right: 10px;
		background-image: url(../images/mpesa.png);
		background-position: center center;
		background-repeat: no-repeat;
		@media only screen and (-webkit-min-device-pixel-ratio: 2),
		only screen and (min--moz-device-pixel-ratio: 2),
		only screen and (-o-min-device-pixel-ratio: 2/1),
		only screen and (min-device-pixel-ratio: 2),
		only screen and (min-resolution: 192dpi),
		only screen and (min-resolution: 2dppx) {
			background-image: url(../images/mpesa@2x.png);
			background-size: 43px 21px;
		}
	}
}


.m-fm-options-list{
	display: flex;
	flex-wrap: wrap;
}
.m-fm-options-list-lt{
	.m-options-item{
		width: 170px;
	}
}
.m-options-item{
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 44px;
	// width: 170px;
	width: 111px;
	margin: 5px 5px 0 0;
	border: 1px solid #0d9737;
	text-align: center;
	line-height: 1;
	cursor: pointer;
	color: #0d9737;
	border-radius: 2px;
	.m-options-item-btntext{
		font-size: 16px;
		line-height: 20px;
		font-weight: bold;
	}
	.m-options-item-text{
		font-size: 10px;
		color: #9ca0ab;
	}
	&.m-options-item-active{
		color: #FFF;
		background-color: rgba(13, 151, 55, 0.8);
		border: solid 1px #0d9737;
		.m-options-item-text{
			color: #FFF;
		}
	}
}
.m-fm-options-random{
	margin-top: 5px;
}
.m-btn-wrapper{
	line-height: 1;
	margin-top: 20px;
	.af-button{
		height: auto;
		padding: 7px 0;
		height: 44px;
		box-sizing: border-box;
		font-size: 14px;
	}
}
.m-btn-comment{
	display: block;
	margin-top: 8px;
	font-size: 12px;
	line-height: 1;
	color: #353a45;
}
.deposit-free-tip{
	margin-left: 160px;
	width: 300px;
	line-height: 20px;
	color: #353a45;
	.charge-label{
		color: #9ca0ab;
	}
}
.deposit-mpesa-wrap{
	margin-left: 160px;
	color: #353a45;
	line-height: 20px;
	.mpesa-label{
		color: #9ca0ab;
	}
}
</style>
