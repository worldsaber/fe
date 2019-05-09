<template>
		<form class="m-fm-wrap">
			<div class="m-fm-row">
				<div class="m-fm-left">Withdraw To</div>
				<div class="m-fm-right withdraw-mpesa"><em class="icon-mpesa"></em>M-PESA (****{{mobile.slice(-4)}})</div>
			</div>
			<div class="m-fm-row">
				<div class="m-fm-left">Amount({{showCurrencyOrigin}})</div>
				<div class="m-fm-right">
					<AfInput
						v-model="amount"
						icon="delete"
						:maxlength="18"
						:error="isError"
						:iconClick="clearAllInput"
						@change="validatorAmount"
						@blur="handleBlur"
						:placeholder="getAmountPlaceholder"
						>
					</AfInput>
					<span class="m-error-infos">{{errorInfo}}</span>
				</div>
			</div>
			<div class="withdraw-charge-wrap" v-if="showAdditionalFee">
				<div class="withdraw-charge">Additional Fee ({{showCurrencyOrigin}}): {{fee}}</div>
				<div class="withdraw-free">(Free of charge on amount {{showCurrencyOrigin}} {{freeThreshold}} or more)</div>
			</div>
			<div class="m-fm-row m-withdrwa-btn-wrap">
				<div class="m-fm-left">&nbsp;</div>
				<div class="m-fm-right">
					<div class="m-btn-wrapper">
						<AfButton
							extraType="primary"
							:disabled="submitStatus"
							@click.prevent="submitHandler"
							>Withdraw</AfButton>
						</div>
				</div>
			</div>
		</form>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { EventBus } from 'kernel/js/eventBus.js';
import { formatNumber } from 'utils';
import AfButton from 'packages/button/button.vue';
import { AfInput } from 'packages/input';
import dialog from 'components/dialog';
import { withdrawContactPhone, userCenterConfig } from 'config/order/userCenterConfig';
import { getShowCurrency, showCurrencyOrigin } from 'config/currencyConfig';
import { checkWithdrawBlock } from 'components/withdrawBlockTip/withdrawDialog.js';
import { wdMax, wdFee, wdMin, showTransThreshold, showWdMax, showFee } from '../js/config';

import confirmPop from './confirmPop';
import popMsg from '../../../deposit/ke/js/popMsg';

import '../../../mockData/withdraw/index?debug';

export default {
	mixins: [popMsg],
	components: {
		AfButton,
		AfInput,
		confirmPop
	},
	props: {
		freeThreshold: {
			type: Number,
		},
		feeRange: {
			type: Array,
		},
		additionalFee: {
			type: String,
		}
	},
	data () {
		return {
			amount: '',
			errorInfo: '',
			loading: false,  // 确认弹窗comfirm按钮的loading状态
			isSuccess: false,
			tradeId: '',
			showCurrency: getShowCurrency(),
			showCurrencyOrigin,
			wdMin,
			wdFee,
			wdMax,
			showTransThreshold,
			showFee,
			showWdMax
		};
	},
	watch: {
		loading (val) {
			EventBus.$emit('loadingChange', val);
		}
	},
	computed: {
		...mapState('userCenter', {
			mobile: 'phone',
			remainAmount: 'balance',
			auditStatus: 'auditStatus'
		}),
		...mapGetters('userCenter', {
			wholeMobile: 'wholePhone'
		}),
		canDrawAmount () {
			return Math.max((this.remainAmount - this.numberFee).toFixed(2), 0);
		},
		submitStatus () {
			return this.amount === '' || this.errorInfo !== '';
		},
		isError () {
			return this.errorInfo !== '';
		},
		getAmountPlaceholder() {
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
				} else if (amount > this.wdMax) {
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
					const code = data.bizCode;
					if (code === 10000) {
						this.tradeId = data.data.tradeId;

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
			window.location = userCenterConfig.Transactions;
		},
		showErrorPop (code, message) {
			let msg;
			let msgTitle = '';
			if (code === 62100) {
				msg = `Maximum daily transaction value is ${this.showCurrency}${this.showTransThreshold}. The maximum you can send in a day is ${this.showCurrency}${this.showTransThreshold}.`;
			} else if (code === 61100) {
				msg = 'The amount has exceeded your available balance, please check and confirm again.';
			} else if (code === 11000) {
				msgTitle = 'Error during transaction';
				msg = 'M-PESA account is unable to accept your payment at this time. Please try again later.';
			} else if (code === 61300) {
				msg = 'This account has been temporarily locked for security concern. If you need any help, please contact us at: ' + withdrawContactPhone;
			} else if (code === 64001 || code === 64002) { // 超时
				msg = 'Your withdrawal request has been submitted, awaiting for confirmation. You can check the withdrawal records in a short while.';
			} else {
				msg = message || 'Sorry，something went wrong. Please try again later.';
			}
			const epop = this.showMsgPop({ msg, msgTitle });
			if (code !== 61300) {
				epop.onClose(this.reloadPage);
			}
		},
		// 查询交易
		showConfirmPop () {
			// 提交让input失去焦点，这样防止用户ajax回来以及快速按enter键弹出多个弹出层
			document.querySelector('.m-fm-wrap .m-input').blur();
			this.confirmPop = dialog({
				title: '&nbsp;',
				content: confirmPop,
				css: 'm-fm-dialog',
				width: 650,
				contentData: {
					// showCurrency: this.showCurrency,
					amount: formatNumber(this.amount, 2),
					mobile: this.mobile,
					remainAmount: formatNumber(this.remainAmount - this.amount - this.numberFee, 2),
					callback: this.confirmPopBtnClick,
					additionalFee: this.fee
				},
				button: []
			}).onBeforeClose(() => {
				// 如果确认弹框正在请求ajax，则不允许关闭
				if (this.loading) {
					return false;
				}
			});
		},
		confirmPopBtnClick (index) {
			if (index === 0) {
				this.confirmPop.close();
			} else if (!this.loading) {
				this.loading = true;
				this.submitPost().then(() => {
					this.loading = false;
					this.confirmPop.close();
				}).catch(() => {
					this.loading = false;
					this.confirmPop.close();
					this.showMsgPop({
						msg: 'Please check your internet connection and try again.'
					});
				});
			}
		},
		reloadPage () {
			window.location.reload();
		},
		// 处理需要人工审核的情况
		dealManualResult (amount = '', msg = '') {
			const apop = this.showMsgPop({
				msg: (!amount && msg) ? msg : `The amount exceeds ${this.showCurrency}${amount / 10000}, manual process would be applied. You can expect the result in 3 working days.`,
				buttonList: [{
					type: 'text',
					text: 'Cancel'
				}, {
					type: 'primary',
					text: 'Continue'
				}]
			}, idx => {
				if (idx === 1) {
					this.submitPost(1);
					apop.close();
				} else {
					this.reloadPage();
				}
			});
		}
	}
};
</script>
<style lang="less">
.withdraw-mpesa{
	height: 40px;
	line-height: 40px;
	.icon-mpesa{
		display: inline-block;
		width: 43px;
		height: 40px;
		vertical-align: middle;
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
.m-withdrwa-btn-wrap{
	margin-top: 40px;
}
.withdraw-charge-wrap{
	margin-left: 160px;
	font-size: 12px;
	color: #1b1e25;
}
</style>
