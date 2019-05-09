<template>
	<div class="m-uc-wrap">
		<form class="m-fm-wrap">
			<p class="m-fm-tip"><i class="m-icon--light"></i>Enter an amount below, use your service PIN to authorize the transaction.</p>
			<div class="m-deposit-from">
				<div class="deposit-from-label">Deposit From:</div>
				<div class="deposit-from-value">
					<img class="deposit-from-mpesa m-mpesa-img" src="../image/mpesa@3x.png"/>
					<span class="deposit-from-mobile">&nbsp;(****{{mobile && mobile.slice(-4)}})</span>
				</div> <!-- WAP 1.3 change -->
			</div>
			<!-- WAP1.3-充值优惠 -->
			<div class="select-amount-label ">Select Amount({{showCurrencyOrigin}})</div>
			<div class="m-select-amout-list">
				<div :class='["m-deposit-gifts-row", extraCls]'>
					<div class="m-deposit-gifts-cell m-deposit-gifts-extra-cell"
						v-for="(item, index) in extraOffer"
						:class="[amount == getOfferAmount(item) ? 'm-deposit-cell-active': '']"
						@click="setDepositAmount(item)"
						:key="index">
						<!-- 后台配置调整了位置，跟以前反了 -->
						<div class="m-cell-title">{{item.text}}</div>
						<div class="m-cell-desc" v-if="item.btnText">{{item.btnText}}</div>
					</div>
					<!-- <div class="m-deposit-gifts-cell m-gifts-cell-none">
					</div> -->
				</div>
			</div>
			<div class="m-fm-row">
				<AfInput
					v-model="amount"
					placeholder="Enter Deposit Amount"
					icon="delete"
					:maxlength="18"
					:error="isError"
					:iconClick="clearAllInput"
					@change="validatorAmount"
					@blur="handleBlur"
					>
					<span slot="prepend">Amount({{showCurrencyOrigin}})</span>
				</AfInput>
				<span class="m-error-infos">{{errorInfo}}</span>
			</div>
			<template v-if="showTip">
				<div class="select-amount-mpesa-charge" v-if="isOverThreshold && mpesaCharges">
					<div class="mpesa-charge-label">
						<span class="mpesa-label">M-Pesa Charges({{showCurrencyOrigin}})</span>
						<span class="mpesa-value">{{mpesaCharges}}</span>
					</div>
					<div class="mpesa-cash-back">
						<span class="mpesa-label">You Will Receive({{showCurrencyOrigin}})</span>
						<span class="mpesa-value">{{formatAmount}} + {{mpesaCharges}} cash back</span>
					</div>
				</div>
				<div class="select-amount-free-tip" v-else>
					<span class="free-label">Free Deposits for {{this.showCurrency}}{{this.freeThreshold}} or more </span>
					<span class="free-charge">(SportyBet will credit your M-pesa charges to your balance.)</span>
				</div>
			</template>
			<div class="m-fm-row m-top-up-now">
					<div class="m-btn-wrapper">
						<AfButton
							extraType="primary"
							:disabled="submitStatus"
							:loading="loading"
							@click.prevent="submitHandler"
							>
							<template v-if="loading">Loading...</template>
							<template v-else>
								<div>{{btnLabel}}</div>
								<div v-if="buttonComment" class="m-extra-text">{{buttonComment}}</div>
							</template>
						</AfButton>
						</div>
					<giftTip />
			</div>
			<ul class="m-fm-b-des">
				<li v-for="(line,i) in lines" :key="i">{{line}}</li>
				<!-- <li>2. Maximum per transaction is {{showCurrency}}{{showDpMax}}. </li>
				<li>3. Maximum Daily Transaction is {{showCurrency}}{{showTransThreshold}}.</li> -->
			</ul>
		</form>
		<mpesa-pop v-if="isShowMpesaPop" @hideMpesaPop="hideMpesaPop" @mpesaBtnClick="mpesaBtnClick"></mpesa-pop>
	</div>
</template>
<script>
import { EventBus } from 'kernel/js/eventBus.js';
import { userCenterUrl, payBillNumber } from 'config/mycenter/dataConfig';
import { formatNumber } from 'utils';
import AfButton from 'packages/button/button.vue';
import { AfInput } from 'packages/input';
import { showCurrencyOrigin, showCurrency } from 'config/currencyConfig';
import '../../../mockData/deposit/index?debug';
import popMsg from '../js/popMsg';
import { showDpMax, showTransThreshold, dpMax } from '../js/config';
import mpesaPop from './mpesaPop';
import giftTip from './giftTip';

export default {
	name: 'deposit',
	mixins: [popMsg],
	components: {
		AfButton,
		AfInput,
		mpesaPop,
		giftTip
	},
	props: {
		// showCurrency: '',
		mobile: {
			type: String,
			'default': ''
		},
		wholeMobile: {
			type: String,
			'default': ''
		},
		quickInput: {
			type: Object
		},
		freeThreshold: {
			type: Number
		},
		feeRange: {
			type: Array
		},
		lines: {
			type: Array
		}

	},
	data () {
		return {
			amount: '',
			errorInfo: '',
			amountValid: false,
			isShowMpesaPop: false,
			loading: false,
			isSuccess: false,
			tradeId: '',  // 交易id
			showCurrency,
			showCurrencyOrigin,
			showTransThreshold,
			showDpMax,
			dpMax,
			activeIndex: '',
		};
	},
	computed: {
		submitStatus () {
			return this.amount === '' || this.errorInfo !== '';
		},
		isError () {
			return this.errorInfo !== '';
		},
		extraOffer() {
			return this.quickInput.extraOffer || [];
		},
		extraCls() {
			return this.extraOffer.length > 2 ? '' : 'm-deposit-gifts-cell-lt';
		},
		exclusiveTitle() {
			return this.quickInput.title;
		},
		offers() {
			return this.extraOffer;
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
		inConfigOffer() {
			const offers = this.offers;
			// 49, 99 的 extra 奖励
			const amount = parseInt(this.amount, 10);

			return offers.find(offer => {
				const totalAmount = this.getOfferAmount(offer);
				return totalAmount === amount;
			});
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
		// 是否达到free条件
		isOverThreshold() {
			const amount = parseInt(this.amount, 10);
			return amount >= this.freeThreshold;
		},
		showTip() {
			return !this.isError;
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
		// 充值优惠-设置充值金额和充值按钮下方文案
		setDepositAmount(item) {
			const amount = this.getOfferAmount(item);
			this.amount = amount;
			this.validatorAmount({
				value: amount
			});
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
					this.showToast('No internet connection, try again.');
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
						if (originData.status === 72) {  // risk audit
							return this.showErrorPop(code, message);
						}
						this.tradeId = originData.tradeId;
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
			this.isShowMpesaPop = true;
			// this.popMsg = this.showMsgPop({
			// 	msg: 'Lipa na M-PESA Online transaction has been initiated on your phone! Please enter service pin to confirm the deposit!',
			// 	buttonList:	['*Cancel', 'Complete']
			//  }, this.queryInfo);
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
			// this.popMsg.close();
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
							this.showMsgPop({ msg, msgTitle, className: 'm-mpesa-long-tit' }).onClose(this.hideMpesaPop);
						}
					} else {
						this.showMsgPop({
							msg: 'Sorry，something went wrong. Please try again later.',
						});
					}
					resolve(true);
				})
				.catch(() => {
					this.showToast('No internet connection, try again.');
					reject(false);
				});
			});
		},
		goToBizQueryPage () {
			window.location = userCenterUrl.transaction;
		},
		hideMpesaPop () {
			this.isShowMpesaPop = false;
		},
		mpesaBtnClick () {
			this.queryInfo().then(() => {
				EventBus.$emit('completeLoadingChange', false);
			}).catch(() => {
				EventBus.$emit('completeLoadingChange', false);
			});
		}
	}
};
</script>
<style lang="less">
@import '~base/styles/variable.less';
// 充值优惠相关样式
.select-amount-label{
	margin: 24/@rem 0 6/@rem;
	font-size: 14/@rem;
	font-weight: bold;
}
.m-deposit-gifts-row{
	display: flex;
	// justify-content: space-between;
	flex-wrap: wrap;
	margin: 0 -5/@rem 5/@rem 0;
	&.m-deposit-gifts-cell-lt{
		.m-deposit-gifts-cell{
			flex: 0;
			flex-basis: 48%;
			width: 48%;
		}
	}
	.m-deposit-gifts-cell{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 44/@rem;
		// padding: 8/@rem 0;
		// flex: 1;
		flex-basis: 32%;
		width: 32%;
		max-width: 48%;
		margin: 5/@rem 1% 0 0;
		border-radius: 2px;
		border: 1px solid #0d9737;
		text-align: center;
		line-height: 1;
		box-sizing: border-box;
	}
	.m-cell-title{
		font-weight: bold;
		font-size: 12/@rem;
		line-height: 1.5;
		color: #0d9737;
	}
	.m-cell-desc{
		font-size: 10/@rem;
		color: #9ca0ab;
	}
	.m-gifts-cell-none{
		border: 0;
	}
	.m-deposit-cell-active{
		background-color: rgba(13, 151, 55, 0.8);
		.m-cell-title, .m-cell-desc{
			color: white;
		}
	}
}
.m-deposit-desc{
	font-size: 12/@rem;
	color: #9ca0ab;
	margin-top: 8/@rem;
}
.m-extra-text{
	margin-top: 6/@rem;
	font-size: 10/@rem;
}
.m-desc{
	margin: 58/@rem 0 0;
	color:@darkGray;
	li{
		text-indent: -1em;
		padding-left: 1em;
		font-size:12/@rem;
		line-height: 19/@rem;
	}
}
.m-mpesa-img{
	margin-left: 13/@rem;
	width: 44/@rem;
}
.m-deposit-from{
	display: flex;
	margin: 16/@rem 0 24/@rem;
	font-size: 14/@rem;
	justify-content: space-between;
	color: #353a45;
}
.deposit-from-label{
	font-weight: bold;
}
.select-amount-free-tip{
	font-size: 12/@rem;
	margin-top: 12/@rem;
	.free-label{
		color: #353a45;
	}
	.free-charge{
		color: #9ca0ab;
	}
}
.m-select-amout-list{
	margin-bottom: 10/@rem;
}
.select-amount-mpesa-charge{
	font-size: 12/@rem;
	margin-top: 12/@rem;
	color:#9ca0ab;
}
.mpesa-charge-label,.mpesa-cash-back{
	font-size: 12/@rem;
	display: flex;
	justify-content: space-between;
	color: #9ca0ab;
	.mpesa-value{
		color: #353a45;
	}
}
.m-top-up-now{
	margin-top: 60/@rem;
}
.m-uc-wrap .m-fm-b-des{
	margin-top: 60/@rem;
}
</style>
