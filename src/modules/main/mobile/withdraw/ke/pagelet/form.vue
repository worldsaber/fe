<template>
		<form class="m-fm-wrap m-withdraw-wrap">
			<div class="m-withdraw-balance">
				<div class="m-fm-balance balance-label">Balance ({{showCurrencyOrigin}})</div>
				<div class="m-fm-balance"><strong>&nbsp;&nbsp;{{showAmount}}</strong></div>
			</div>
			<div class="withdraw-to-wrap">
				<div class="withdraw-to-label">Withdraw To</div>
				<div class="withdraw-to-value">
					<img class="m-mpesa-img" src="../images/mpesa@3x.png"/>
					<span>&nbsp;(****{{mobile && mobile.slice(-4)}})</span>
				</div>
			</div>
			<!-- <div class="m-fm-row m-fee-row">
				<div class="m-fm-left">Additional Fee({{showCurrencyOrigin}})</div>
				<div class="m-fm-right" @click="openFeeDialog()"><strong>33.00</strong><i class="m-icon-tips" ></i></div>
			</div> -->
			<div class="m-fm-row">
					<AfInput
						:placeholder="getAmountPHolder"
						v-model="amount"
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
			<div class="withdraw-additional-fee-wrap" v-if="showAdditionalFee">
				<div class="additional-fee-label">Additional Fee({{showCurrencyOrigin}}): {{fee}}</div>
				<div class="free-charge-label">Free of charge on amount {{showCurrency}}{{freeThreshold}} or more</div>
			</div>
			<div class="m-fm-row m-fm-btn-row">
					<div class="m-btn-wrapper">
						<AfButton
							extraType="primary"
							:disabled="submitStatus"
							@click.prevent="submitHandler"
							>Withdraw</AfButton>
						</div>
			</div>

			<ul class="m-fm-b-des">
				<li v-for="(line,i) in lines" :key="i">{{line}}</li>
				<!-- <li>2. An additional Carrier Fee of {{showCurrency}}{{additionalFee}} will be applied if the withdrawal amount is less than {{showCurrency}}{{freeThreshold}}.</li>
				<li>3. Maximum per transaction is {{showCurrency}}{{showWdMax}}.</li>
				<li>4. Maximum Daily Transaction is {{showCurrency}}{{showTransThreshold}}.</li> -->
			</ul>
		</form>
</template>

<script>
import { mapState } from 'vuex';
import { userCenterUrl, withdrawContactPhone, payBillNumber } from 'config/mycenter/dataConfig';
import { formatNumber } from 'utils';
import AfButton from 'packages/button/button.vue';
import { AfInput } from 'packages/input';
import dialog from 'components/dialog';
import checkWithdrawBlock from 'components/withdrawBlockTip/withdrawDialog.js';
import { showCurrencyOrigin, showCurrency } from 'config/currencyConfig';
import confirmPop from './confirmPop';
import popMsg from '../../../deposit/ke/js/popMsg';
import { showFee, showWdMax, showTransThreshold, wdMin, wdFee, wdMax } from '../js/config';

import '../../../mockData/withdraw/index?debug';

export default {
	mixins: [popMsg],
	components: {
		AfButton,
		AfInput,
		confirmPop,
		payBillNumber
	},
	props: {
		// showCurrency: '',
		mobile: '',
		wholeMobile: '',
		// 账户剩余可用余额
		remainAmount: 0,
		feeRange: Array,
		lines: Array,
		freeThreshold: Number,
		additionalFee: String
	},
	data () {
		return {
			amount: '',
			errorInfo: '',
			loading: false,
			tradeId: '',
			showCurrency,
			showCurrencyOrigin,
			showFee,
			showWdMax,
			showTransThreshold,
			wdMin,
			wdFee,
			wdMax
		};
	},
	computed: {
		...mapState('assetsInfo', ['auditStatus']),
		showAmount () {
			return formatNumber(this.remainAmount, 2);
		},
		canDrawAmount () {
			return Math.max((this.remainAmount - this.numberFee).toFixed(2), 0);
		},
		submitStatus () {
			return this.amount === '' || this.errorInfo !== '';
		},
		isError () {
			return this.errorInfo !== '';
		},
		getAmountPHolder() {
			return `min. ${this.wdMin}`;
		},
		fee() {
			if (this.isOverThreshold) {
				return '0.00';
			}
			const amount = parseInt(this.amount, 10);
			const range = this.feeRange;
			const item = range.find(item => amount >= item.lower && amount <= item.upper) || { amount: '33' };
			return item.amount;
		},
		numberFee() {
			return parseFloat(this.fee, 10);
		},
		isOverThreshold() {
			const amount = parseInt(this.amount, 10);
			return amount >= this.freeThreshold;
		},
		showAdditionalFee() {
			return this.amount && !this.isError;
		}
	},
	methods: {
		clearAllInput () {
			this.amount = '';
			this.validatorAmount({ value: '' });
		},
		validatorAmount (data) {
			const amount = data.value;
			if (amount) {
				// replace space
				if (/\s/.test(amount)) {
					this.amount = amount.replace(/\s/g, '');
				} else if (/\d*\.+\d*/.test(amount)) {
					this.errorInfo = 'Due to M-pesa\'s Policy, your withdrawal amount must be an integer. ';
				} else if (/[^0-9]/.test(amount)) {
					this.errorInfo = 'Please enter a valid number.';
				} else	if (amount > this.wdMax) {
					this.errorInfo = `Maximum per transaction is ${this.showCurrency}${this.showWdMax}`;
				} else if (+amount > +this.canDrawAmount) {
					this.errorInfo = 'Your balance is insufficient.';
				} else {
					this.errorInfo = '';
				}
			} else {
				this.errorInfo = '';
			}
		},
		// 当输入框内小数点前数字全部删除后剩 .00时，光标失去聚焦后，输入框清空
		// 目前应该是不支持小数的
		handleBlur () {
			const mount = this.amount;
			if (Number(mount) === 0) {
				this.amount = '';
				this.errorInfo = '';
			} else if (/^\.\d{0,2}$/.test(mount)) {
				this.amount = Number(mount);
			}
		},
		// submit button click
		submitHandler () {
			if (!checkWithdrawBlock(this.auditStatus)) {
				return;
			}
			if (this.amount === '') {
				this.errorInfo = 'Amount is required.';
			} else if (this.amount < this.wdMin) {
				this.errorInfo = `Please enter a value no less than ${this.wdMin}`;
			} else if (!this.submitStatus) {
				this.showConfirmPop();
			}
		},
		submitPost (isConfirmAudit) {
			// console.log(`${this.wholeMobile};${this.amount * 10000};`);
			return new Promise((resolve, reject) => {
				fetch('/pocket/v1/bankTrades/bankTrade/withdraw', {
					method: 'POST',
					headers: new Headers({
						'Content-Type': 'application/json'
					}),
					body: JSON.stringify({
						phoneNo: this.wholeMobile,
						payAmount: this.amount * 10000,
						isConfirmAudit: isConfirmAudit || 0,
						payChId: 10   // 付款渠道（10-Mpesa） 暂时只有10
					})
				})
				.then(res => res.json())
				.then(data => {
					let code = data.bizCode;
					if (isConfirmAudit === 1) {
						code = 10000;
					}

					if (code === 10000) {
						if (data.data.status === 72) { // risk audit
							this.showErrorPop(code, data.message);
							return resolve(true);
						}

						if (status === 20 || status === 71) { // 成功
							this.$emit('success', {
								tradeId: this.tradeId,
								isSubmitSuccess: !!isConfirmAudit,
								amount: formatNumber(this.amount, 2)
							});
						}

						this.tradeId = data.data.tradeId;
						return resolve(new Promise((res, rej) => {
							window.setTimeout(() => {
								res(this.queryInfo());
							}, 2000);
						}));
					} else if (code === 62200) {
						this.dealManualResult(data.data.auditLimit, data.message);
					} else {
						this.showErrorPop(code, data.message);
					}
					resolve(true);
				})
				.catch(err => reject(err));
			});
		},
		queryInfo (isConfirmAudit) {
			return new Promise((resolve, reject) => {
				fetch('/pocket/v1/bankTrades/bankTrade/' + this.tradeId, {
					method: 'GET',
				})
				.then(res => res.json())
				.then(data => {
					const code = data.bizCode;
					const status = (data.data || {}).status;
					if (code === 10000) {
						if (status === 20 || status === 71) { // 成功
							this.$emit('success', {
								tradeId: this.tradeId,
								isSubmitSuccess: !!isConfirmAudit,
								additionalFee: this.fee,
								amount: formatNumber(this.amount, 2)
							});
						} else if (status === 10) { // 等待支付
							this.showMsgPop({
								msg: 'Your withdrawal request has been submitted, awaiting for confirmation. You can check the withdrawal records in a short while.'
							}).onClose(this.goToBizQueryPage);
						} else { // 30-FAIL, 90-CLOSED
							const msgTitle = 'Error during transaction';
							const msg = 'M-PESA account is unable to accept your payment at this time. Please try again later.';
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
		showErrorPop (code, message) {
			let msg;
			let msgTitle = '';
			let className = '';
			if (code === 62100) {
				msg = `Maximum daily transaction value is ${this.showCurrency}${this.showTransThreshold}. The maximum you can send in a day is ${this.showCurrency}${this.showTransThreshold}.`;
			} else if (code === 61100) {
				msg = 'The amount has exceeded your available balance, please check and confirm again.';
			} else if (code === 11000) {
				msgTitle = 'Error during transaction';
				msg = 'M-PESA account is unable to accept your payment at this time. Please try again later.';
				className = 'm-mpesa-long-tit';
			} else if (code === 61300) {
				msg = 'This account has been temporarily locked for security concern. If you need any help, please contact us at: ' + withdrawContactPhone;
			} else if (code === 64001 || code === 64002) { // 超时
				msg = 'Your withdrawal request has been submitted, awaiting for confirmation. You can check the withdrawal records in a short while.';
			} else {
				msg = message || 'Sorry，something went wrong. Please try again later.';
			}
			const epop = this.showMsgPop({ msg, msgTitle, className });
			if (code !== 61300) {
				epop.onClose(this.reloadPage);
			}
		},
		// 查询交易
		showConfirmPop () {
			// 提交让input失去焦点，这样防止用户ajax回来以及快速按enter键弹出多个弹出层
			document.querySelector('.m-fm-wrap .m-input').blur();
			// 防止快速点击显示两个框
			this.confirmPop && this.confirmPop.close();
			this.confirmPop = dialog({
				title: '&nbsp;',
				content: confirmPop,
				css: 'm-cfm-dialog',
				position: 'b',
				width: '100%',
				contentData: {
					// showCurrency: this.showCurrency,
					amount: formatNumber(this.amount, 2),
					mobile: this.mobile,
					remainAmount: formatNumber(this.remainAmount - this.amount - this.numberFee, 2),
					additionalFee: this.fee
				},
				button: ['*Cancel', 'Confirm']
			}).onBtnClick(this.confirmPopBtnClick).onBeforeClose(() => {
				if (this.loading) {
					return false;
				}
			});
		},
		confirmPopBtnClick (index) {
			// 请求ajax过程禁止按钮点击
			if (this.loading) return;
			if (index === 0) {
				this.confirmPop.close();
			} else {
				const currentBtn = document.querySelectorAll('.es-dialog-btn')[1];
				currentBtn.addClass('m-alpha80');
				currentBtn.innerHTML = '<i class="m-icon--loading"></i><span>Loading...</span>';
				this.loading = true;
				this.submitPost().then(() => {
					currentBtn.innerHTML = '<span>Confirm</span>';
					this.loading = false;
					this.confirmPop.close();
				}).catch(() => {
					this.loading = false;
					this.confirmPop.close();
					this.showToast('No internet connection, try again.');
				});
			}
		},
		reloadPage () {
			window.location.reload();
		},
		// 处理需要人工审核的情况
		dealManualResult (amount = '', msg = '') {
			const apop = this.showMsgPop({
				msg: (!amount && msg) ? msg : `The amount exceeds  ${this.showCurrency}${amount / 10000}, manual process would be applied. You can expect the result in 3 working days.`,
				buttonList: ['*CANCEL', 'CONTINUE']
			}, idx => {
				if (idx === 1) {
					this.submitPost(1).then(() => {
						this.loadPop.close();
					}).catch(() => {
						this.loadPop.close();
					});
					apop.close();
					this.loadPop = this.showLoading('<i class="m-icon--loading"></i>Being processed...');
				} else {
					this.reloadPage();
				}
			});
		},
		openFeeDialog() {
			dialog({
				title: 'Additional Fee',
				content: `An additional Carrier Fee of ${this.showCurrency}${this.showFee} will be applied when processing withdrawal requests.`,
				layout: true,
				button: ['OK']
			});
		}
	}
};
</script>
<style lang="less">
@import '~base/styles/variable.less';
@import '~base/styles/icon.less';
.m-withdraw-balance{
	display: flex;
	align-items: center;
	margin: 16/@rem 0 22/@rem;
	line-height: 30/@rem;
	.m-fm-balance{
		font-size: 12/@rem;
		padding: 0;
	}
	.balance-label{
		.m-icon-light2();
		&::before{
			color: #0d9737;
			margin-right: 6/@rem;
		}
	}
}
.m-fm-balance{
	position: relative;
}
.m-withdraw-wrap{
	.m-fm-row{
		font-size: 14/@rem;
		.m-fm-right{
			text-align: left;
		}
	}
}

.m-alpha80{
	opacity:.8;
}
.m-icon-tips {
	.m-icon-tips();
	color: @darkGray;

	&:before {
		display: inline-block;
		margin-right: 4px;
		font-size: 14px;
	}
}
.m-fee-row{
	margin-top: 20/@rem;
	.m-fm-left{
		width: 50%;
	}
	.m-fm-right{
		width: 49%;
	}
}

.withdraw-to-wrap{
	display: flex;
	justify-content: space-between;
	color: #353a45;
	margin-bottom: 16/@rem;
}
.withdraw-to-label{
	font-weight: bold;
}
.withdraw-to-value{
	.m-mpesa-img{
		margin-left: 13/@rem;
		width: 44/@rem;
	}
}
.withdraw-additional-fee-wrap{
	margin: 10/@rem 0 22/@rem;
	font-size: 12/@rem;
	line-height: 16/@rem;
}
.additional-fee-label{
	color: #353a45;
}
.free-charge-label{
	color: #9ca0ab;
}
</style>
