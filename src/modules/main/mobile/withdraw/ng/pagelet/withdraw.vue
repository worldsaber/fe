<template>
  <div id="withdraw">
	<navbar :backClick="goHome"><img slot="right" src="../img/help.svg" @click="withdrawHelp"></navbar>
	<withdrawTip from="withdraw"/>
	<af-tabs :value="currentTab" @change="handleTabChange">
		<Notification type="info" :text="notifyContent"/>
	    <af-tab-pane label="Online" name="online">	
			<form>
				<div class="withdraw-bank">
					<div :class="'withdraw-bank-static' + (!!bankErr ? ' error' : '')" @click="toggleList('bank', true)">
					<img class="bank-static-prepend" src="../img/bank.svg">
					<div class="bank-static-name" v-if="currentBankIndex > -1 || currentAccountIndex > -1">{{bankName}}</div>
					<div class="bank-static-name blank" v-if="currentBankIndex < 0 && currentAccountIndex < 0">Select a Bank</div>
					<img class="bank-static-icon" v-if="currentBankIndex > -1 || currentAccountIndex > -1" :src="bankIconUrl">
					<i class="bank-static-arrow"/>
					</div>
					<div class="error-msg">{{bankErr}}</div>
					<div v-show="usingExistAccount" :class="'withdraw-bank-number static' + (!!accountErr ? ' error' : '')" @click="clearExistAccount(false)">
					<img class="static-prepend" src="../img/account.svg">
					<div class="static-content">
						<div class="static-label">Account Number</div>
						<div class="static-input">{{existbankAccNum}}</div>
					</div>
					</div>
					<af-input v-show="!usingExistAccount" type="tel" ref="accountInput" class="withdraw-bank-number" v-model="bankAccNum" :maxlength="10" placeholder="10 digits" transformText="Account Number" icon="delete" :iconClick="clearAccount"
					>
					<img slot="prepend" src="../img/account.svg">
					</af-input>
					<div class="error-msg">{{accountErr}}</div>
					<div class="switch-container">
					<div class="switch-bank" v-if="existAccounts.length > 0" @click="toggleList('account', true)">Switch Bank Account<i class="switch-icon"/></div>
					</div>
				</div>
				<div class="withdraw-footer">
					<div class="balance-container">
					<img src="../img/light-green.svg"><span class="balance-text">Balance ({{currency}})    {{fomatBalance}}</span>
					</div>
					<!-- 1.3 提现amount输入框placeholder最小值改成Enter Withdrawal Amount -->
					<af-input class="withdraw-amount" type="tel" v-model="amount" :placeholder="getAmountPlaceHolder" @blur="blurAmount" icon="delete" :iconClick="clearAmount" :error="!!amountErr">
					<span class="amount-prepend" slot="prepend">Amount({{currency}})</span>
					</af-input>
					<div class="error-msg">{{amountErr}}</div>
					<af-button class="withdraw-submit" :autofocus="false" @click.prevent="confirm" :disabled="withdrawDisabled" :loading="withdrawLoading">
						<span>{{withdrawLoading ? 'Loading' : 'Withdraw'}}</span>
					</af-button>
					
				</div>
			</form>
			<popupSelect
				:isShow="showAccountList"
				@close="toggleList('account', false)"
				:list="existAccounts"
				v-model="currentAccountIndex"
				:showActionBar="true"
				@change="changeHandle('account')"
				@delete="deleteExistAccount"
				ref="account"
				:propertyName="accountProps">
				<div class="select-prepend" slot="prepend"><button class="new-pay" @click="clearAll('account')">Pay with a new bank account</button></div>
			</popupSelect>
			<popupSelect
				:isShow="showBankList"
				@close="toggleList('bank', false)"
				:list="supportBanks"
				v-model="currentBankIndex"
				@change="changeHandle('bank')"
				:propertyName="bankProps">
			</popupSelect>
	    </af-tab-pane>
		<af-tab-pane  label="Offline Partner" name="offline">
			<offlineWithdraw></offlineWithdraw>
		</af-tab-pane>
	</af-tabs>
	<div class="withdraw-rule">
		<div v-for="(line,i) in lines" :key="i">
			<!-- <span>1. </span> -->
			<div>{{line}}</div>
		</div>
		<!-- <div><span>2. </span><div>An additional Carrier Fee of {{currency}} {{fee}} will be applied when withdraw less than {{currency}} {{feeThreshold}}.</div></div>
		<div><span>3. </span><div>Maximum per transaction is {{currency}} {{maxAmount}} - you can withdraw up to {{currency}} {{maxAmount}} in one transaction.</div></div>
		<div><span>4. </span><div>We do not share your payment information. It is used for transaction verification only.</div></div> -->
	</div> 
  </div>
</template>

<script>
import AfButton from 'packages/button';
import dialog from 'components/dialog';
import { AfInput } from 'components/input';
import { AfTabs, AfTabPane } from 'packages/tabs';
import navbar from 'components/navbar';
import Notification from 'components/notification';
import withdrawTip from 'components/withdrawBlockTip';
import checkWithdrawBlock from 'components/withdrawBlockTip/withdrawDialog.js';
import cookie from 'storage/cookie';
import { mapState, mapActions, mapGetters } from 'vuex';
import { formatNumber } from 'utils';
import { pagePath } from 'config/pageConfig.js';
import { showCurrencyOrigin, showCurrency } from 'config/currencyConfig';
import 'components/login/popupLogin';
import commonEvent from 'config/eventConfig/commonEvent';
import { EventBus } from 'kernel/js/eventBus';
import { getConfig } from 'deposit/index';
import popupSelect from '../../../deposit/ng/pagelet/popupSelect';
import bankMixin from '../js/bankMixin.js';
import accountMixin from '../js/accountMixin.js';
import amountMixin from '../js/amountMixin.js';
import bridge from './bridge.vue';
import offlineWithdraw from './offline/offlineWithdraw';
import defaultIcon from '../../../deposit/ng/img/default-card.png';
import { statusToDialog } from '../js/config.js';
import { validateBank, validateAccount, validateAmount } from '../../../deposit/ng/js/commonFun.js';

const listMap = {
	bank: 'showBankList',
	account: 'showAccountList'
};
const tabMap = {
	online: 6,
	offline: 12,
};
export default {
	components: {
		AfButton,
		AfInput,
		AfTabs,
		AfTabPane,
		navbar,
		popupSelect,
		offlineWithdraw,
		Notification,
		withdrawTip
	},
	mixins: [bankMixin, accountMixin, amountMixin],
	data () {
		return {
			withdrawLoading: false,
			tradeId: '',
			minAmount: formatNumber(+withdrawCfg.min, 2),
			maxAmount: formatNumber(+withdrawCfg.max, 2),
			fee: formatNumber(+withdrawCfg.fee, 2),
			feeThreshold: formatNumber(+withdrawCfg.feeThreshold, 2),
			manual: false,
			showCurrency,
			currency: showCurrencyOrigin,
			showOffline: false,
			currentTab: URL.getPara('is_offline') ? 'offline' : 'online',
			notifyFn: () => {},
			notifyContent: '',
			linesFn: () => {},
			lines: [],
		};
	},
	created() {
		this.fetchAcountInfo();
		EventBus.$on(commonEvent.UPDATE_LOGIN_STATUS, this.handleLoginStatus);
		EventBus.$on(commonEvent.UPDATE_ACCOUNT_BALANCE, this.fetchAcountInfo);
		getConfig().then(data => {
			if (data.notifyContent) {
				this.notifyFn = data.notifyContent;
				this.notifyContent = this.notifyFn(6);
			}
			if (data.lines) {
				this.linesFn = data.lines;
				this.lines = this.linesFn(6);
			}
		});
	},
	mounted() {

	},
	destroyed() {
		EventBus.$off(commonEvent.UPDATE_LOGIN_STATUS, this.handleLoginStatus);
		EventBus.$off(commonEvent.UPDATE_ACCOUNT_BALANCE, this.fetchAcountInfo);
	},
	computed: {
		...mapState('assetsInfo', ['auditStatus']),
		...mapGetters('assetsInfo', ['fomatBalance']),
		withdrawDisabled() {
			return this.bankErr !== '' || this.accountErr !== '' || this.amountErr !== '';
		},
		getAmountPlaceHolder() {
			const wdMin = +withdrawCfg.min;
			return wdMin ? `min.${wdMin}` : 'Enter Withdrawal Amount';
		}
	},
	methods: {
		goHome() {
			location.href = pagePath.home;
		},
		handleTabChange(tab) {
			this.currentTab = tab;
			if (URL.getPara('is_offline')) {
				location.href = URL.removePara('is_offline');
			}
			this.notifyContent = this.notifyFn(tabMap[tab]);
			this.lines = this.linesFn(tabMap[tab]);
		},
		...mapActions('assetsInfo', ['fetchAcountInfo']),
		clearAll(type) {
			this.clearBank();
			this.clearExistAccount(true);
			this.$refs[type].close();
			// this.toggleList(type, false);
		},
		handleLoginStatus() {
			this.$popupLogin && this.$popupLogin.close();
			// fetch banks/assets
			this.fetchAcountInfo();
			this.getSupportBanks();
			this.getExistList();
		},
		confirm() {
			if (!checkWithdrawBlock(this.auditStatus)) {
				return;
			}
			// 校验todo
			if (!this.submitCheck()) {
				return;
			}
			this.manual = false;
			if (this.usingExistAccount) {
				const extraData = {
					bankName: this.bankName,
					amount: formatNumber(this.amount, 2),
					bankAccNum: this.existbankAccNum,
					bankAccName: this.existAccounts[this.currentAccountIndex].accountName,
					originAmount: this.amount
				};
				this.createDialog({
					title: 'Confirm to Withdraw',
					component: true,
					css: 'withdraw-confirm',
					type: 'confirm',
					extraData,
					button: []
				});
			} else {
				this.withdrawLoading = true;
				fetch('/pocket/v1/bankTrades/bankTrade/resolve?bankCode=' + this.bankCode + '&bankAccNum=' + this.bankAccNum, {
					method: 'GET'
				}).then(res => {
					this.withdrawLoading = false;
					return res.json();
				}).then(res => {
					if (res.login === false) {
						this.$popupLogin.show();
						return;
					}
					const { bizCode, data } = res;
					if (bizCode === 10000) {
						const extraData = {
							bankName: this.bankName,
							amount: formatNumber(this.amount, 2),
							bankAccNum: this.bankAccNum,
							bankAccName: data.bankAccName,
							originAmount: this.amount
						};
						this.createDialog({
							title: 'Confirm to Withdraw',
							component: true,
							css: 'withdraw-confirm',
							type: 'confirm',
							extraData,
							button: []
						});
					} else {
						// this.$dialog.alert(res.message, ['OK']);
						this.accountErr = res.message; // 此处不使用弹窗错误
					}
				}).catch(e => {
					this.$dialog.alert('No internet connection, try again.', ['OK']);
				});
			}
		},
		createDialog(key) {
			this.$dialog();
			const options = Object.prototype.toString.call(key) === '[object Object]' ? key : statusToDialog[key];
			if (options.component) {
				 this.dialog = dialog({
					title: options.title,
					content: bridge,
					css: options.css ? options.css : '',
					contentData: {
						type: options.type,
						extraData: options.extraData ? options.extraData : {}
					},
					button: options.button || []
				});

				this.dialog.onMounted(() => {
					this.dialog.$content.$on('dialog', params => {
						this.createDialog(params.options);
					});
					this.dialog.$content.$on('withdraw', params => {
						this.handleWithdraw();
					});
					this.dialog.$content.$on('goStep', params => {
						this.$dialog();
						this.$emit('goStep', params.step, {
							amount: formatNumber(this.amount, 2),
							tradeId: this.tradeId,
							account: this.formatAcount(),
							icon: this.bankIconUrl,
							name: this.bankName
						}, this.manual);
					});
				});
			} else {
				this.dialog = dialog(options.dialog);
				options.addEvent && options.addEvent(this.dialog);
			}
		},
		submitCheck() {
			const bankAccNum = this.usingExistAccount ? this.existbankAccNum : this.bankAccNum;
			const checkList = [
				() => this.bankErr = validateBank(this.bankCode) || '',
				() => this.accountErr = validateAccount(bankAccNum) || '',
				() => this.amountErr = validateAmount(this.amount, 'withdraw', true, true, this.balance) || ''];

			for (let i = 0; i < checkList.length; i++) {
				if (checkList[i]().length > 0) {
					return false;
				}
			}
			return true;
		},
		formatAcount() {
			let num = this.usingExistAccount ? this.existbankAccNum : this.bankAccNum;
			if (num.indexOf('*') === -1) {
				num = '****' + num.substr(num.length - 4, 4);
			}
			return num;
		},
		withdrawHelp() {
			location.href = pagePath.help + '#/how-to-play/others/how-to-withdraw';
		},
		handleWithdraw() {
			if (!this.submitCheck()) {
				return;
			}
			const params = {
				phoneNo: cookie('phone'),
				currency: window.currency,
				payAmount: this.amount * 10000,
				isConfirmAudit: this.manual ? 1 : 0
			};
			if (this.usingExistAccount) {
				Object.assign(params, {
					payChId: 1,
					bankAssetId: this.existAccounts[this.currentAccountIndex].id
				});
			} else {
				Object.assign(params, {
					payChId: 21,
					bankCode: this.bankCode,
					bankAccNum: this.bankAccNum
				});
			}
			this.tradeId = '';
			this.dialog.$content && this.dialog.$content.$emit('loading', true);
			fetch('/pocket/v1/bankTrades/bankTrade/withdraw', {
				headers: {
					'content-type': 'application/json'
				},
				method: 'POST',
				body: JSON.stringify(params)
			}).then(res => {
				this.dialog.$content && this.dialog.$content.$emit('loading', false);
				return res.json();
			}).then(res => {
				if (res.login === false) {
					this.$popupLogin.show();
					return;
				}

				const { bizCode, data } = res;
				this.$dialog();
				if (bizCode === 10000) {
					this.tradeId = data.tradeId;
					if (data.status === 20 || data.status === 71) {
						this.$emit('goStep', 'success', {
							amount: formatNumber(this.amount, 2),
							tradeId: this.tradeId,
							account: this.formatAcount(),
							icon: this.bankIconUrl,
							name: this.bankName
						}, this.manual);
					} else if (data.status === 81) {
						this.needSmsVerify();
					} else if (data.status === 72) {
						this.$emit('goStep', 'success', {
							amount: formatNumber(this.amount, 2),
							tradeId: this.tradeId,
							account: this.formatAcount(),
							icon: this.bankIconUrl,
							name: this.bankName
						}, true);
					} else if (data.status === 30) {
						const options = statusToDialog[data.status];
						options.dialog.content = res.message ? res.message : options.dialog.content;
						this.createDialog(options);
					} else {
						this.createDialog(statusToDialog[data.status]);
					}
				} else if (bizCode === 61100) {
					this.$dialog.alert('The amount has exceeded your available balance, please check and confirm again.', ['OK']);
				} else if (bizCode === 61300) {
					this.$dialog.alert('This account has been temporarily locked for security concern. If you need any help, please contact us at: 0207640825', ['OK']);
				} else if (bizCode === 62100) {
					this.$dialog.alert(res.message, ['OK']); // `Maximum Daily Transaction Value is ${this.showCurrency}XXXXXXXX. The maximum you can send in a day is ${this.showCurrency}XXXXXXXX.`
				} else if (bizCode === 62200) { // 手动流程
					const d = this.$dialog({
						title: null,
						content: res.message,
						button: ['CANCEL', 'CONTINUE']
					});
					d.onBtnClick(btn => {
						if (btn === 1) {
							this.manual = true;
							this.handleWithdraw();
						} else {
							d.close();
						}
					});
				} else if (bizCode === 11000) {
					const status = 30; // 11000同样提示失败
					const options = statusToDialog[status];
					options.dialog.content = res.message ? res.message : options.dialog.content;
					this.createDialog(options);
				} else if (bizCode === 65001) { // 资产不存在
					dialog.alert(res.message, ['OK'], () => {
						this.deleteObsoleteAsset();
					});
				} else {
					this.$dialog.alert(res.message || 'Sorry，something went wrong. Please try again later.', ['OK']);
				}
			}).catch(e => {
				this.$dialog.alert('No internet connection, try again.', ['OK']);
			});
		},
		deleteObsoleteAsset() {
			this.existAccounts.splice(this.currentAccountIndex, 1);
			this.clearExistAccount();
		},
		needSmsVerify() {
			const params = {
				phone: cookie('phone'),
				bizType: 'WITHDRAW_CONFIRM'
			};
			fetch('/patron/verifyCode/sms', {
				method: 'POST',
				body: params
			}).then(res => res.json()).then(res => {
				if (res.login === false) {
					this.$popupLogin.show();
					return;
				}
				const { bizCode } = res;
				if (bizCode === 10000) {
					this.createDialog({
						title: 'Verify Identity',
						content: bridge,
						type: 'codeVerify',
						css: 'show-close',
						component: true,
						extraData: {
							tradeId: this.tradeId
						}
					});
				} else if (bizCode === 11705) { // 超三次
					this.createDialog({
						title: 'Verify Identity',
						content: bridge,
						type: 'sms',
						css: 'show-close',
						component: true
					});
				} else {
					this.$dialog.alert(res.message, ['OK']);
				}
			}).catch(res => {
				this.$dialog.alert('No internet connection, try again.', ['OK']);
			});
		},
		changeHandle(type) {
			this.toggleList(type, false);
			switch (type) {
			case 'account':
				this.useExistAccount(this.existAccounts[this.currentAccountIndex]);
				break;
			case 'bank':
				this.useBank(this.supportBanks[this.currentBankIndex]);
				if (this.usingExistAccount) {
					this.clearExistAccount(true);
				}
				break;
			default:
				break;

			}
		},
		deleteExistAccount(index) {
			const d = this.$dialog({
				title: null,
				content: 'Are you sure you want to delete this bank account?',
				button: ['NO', 'YES']
			});
			d.onBtnClick(btn => {
				if (btn === 1) {
					fetch('/pocket/v1/wallet/bankAssets/' + this.existAccounts[index].id, {
						method: 'DELETE'
					}).then(res => res.json()).then(res => {
						if (res.login === false) {
							this.$popupLogin.show();
							return;
						}
						if (res.bizCode === 10000) {
							this.existAccounts.splice(index, 1);

							if (this.existAccounts.length === 0) {
								this.clearExistAccount(true);
							} else if (index === this.currentAccountIndex) { // 删除选中的，选中第一个
								this.currentAccountIndex = 0;
								this.useExistCard(this.existAccounts[0]);
							} else if (index < this.currentAccountIndex) { // 删除前面的，维护当前index
								this.currentAccountIndex = this.currentAccountIndex - 1;
							}
						} else {
							this.$dialog.alert(res.message, ['OK']);
						}
					}).catch(e => {
						this.$dialog.alert('Sorry，something went wrong. Please try again later.', ['OK']);
					});
				} else {
					d.close();
				}
			});
		},
		toggleList(type, val) {
			this[listMap[type]] = val;
		},
		useExistAccount(account) {
			this.useBank(account);
			this.currentBankIndex = this.localBanksMap.indexOf(account.bankName);
			this.existbankAccNum = account.accountNumber;
			this.bankAssetId = account.id;
			this.usingExistAccount = true;
			this.accountErr = '';
		},
		useBank(bank) {
			this.bankName = bank.bankName;
			this.bankCode = bank.bankCode;
			this.bankIconUrl = bank.bankIconUrl ? bank.bankIconUrl : defaultIcon;
			this.bankErr = '';
		}
	}
};
</script>

<style lang="less">
@import "~base/styles/variable.less";
@import "base/styles/icon.less";
@defaultTextColor: #bbb; //input 图标颜色
@placeHolderColor: #9da1ac; //模拟placeholder颜色
@errorColor: #f1828f; //模拟input错误边框颜色

.show-close {
	.es-dialog-close {
		display: inline-block;
	}
}

.es-dialog.m-dialog.withdraw-confirm {
	width: 90%!important;
	.es-dialog-close {
		display: inline-block;
	}
}
#withdraw {
	.m-tabs-nav {
		  border-bottom: 1px solid @lightGray;
		  .m-tabs-tab {
			  font-size: 14px;
			  font-weight: bold;
			  line-height: 16px;
			  text-align: center;
			  padding-top: 20/@rem;
			  padding-bottom: 14/@rem;
			  &.m-tabs-tab-active {
			      color: @dark;
		      }
		  }
	  }
	  .m-tabs-ink-bar {
		  background-color: @green;
		//   width: 125/@rem !important;
		//   left: 208/@rem !important;
			transform: scale(0.78, 1.5);
			margin-left: 17/@rem;
	  }
	.error-msg {
		min-height: 12px;
		line-height: 12px;
		font-size: 10px;
		text-align: left;
		color: @red;
		margin-top: 2px;
	}

	.withdraw-bank {
		padding: 0 16/@rem;
		.withdraw-bank-static {
			display: flex;
			align-items: center;
			justify-content: center;
			border: 1px solid @inputBorder;
			margin-top: 22/@rem;
			box-sizing: border-box;
			&.error {
				border-color: @errorColor;
			}
			.bank-static-prepend {
				flex: 0;
				padding: 0 12px;
			}
			.bank-static-name {
				flex: 1;
				color: @dark;
				font-size: 14px;
				text-align: left;
				line-height: 48px;
				&.blank {
					color: @placeHolderColor;
				}
			}
			.bank-static-icon {
				flex: 0;
				margin-left: 16/@rem;
				height: 20px;
			}
			.bank-static-arrow {
				flex: 0;
				margin: 0 16/@rem;
				color: @darkGray;
				.m-icon-arrow--right();

			}
		}
		.withdraw-bank-number {
			margin-top: 5/@rem;

			&.static {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 100%;
				border: 1px solid @inputBorder;
				box-sizing: border-box;
				&.error {
					border-color: @errorColor;
				}
				.static-prepend {
					flex: 0;
					margin: 0 10/@rem;
				}
				.static-content {
					flex: 1;
					padding: 8px 0;
					.static-label {
						font-size: 10px;
						line-height: 12px;
						height: 12px;
						margin-bottom: 4px;
						text-align: left;
						color: @green;
					}
					.static-input {
						font-size: 14px;
						line-height: 16px;
						height: 16px;
					}
				}
			}
		}
		.switch-container {
			margin-top: 9/@rem;
			margin-bottom: 14/@rem;
			height: 14px;
			display: flex;
			align-items: center;
			justify-content: center;
			.switch-bank {
				flex: 0 0 auto;
				color: @green;
				font-size: 14px;
				line-height: 14px;
				.switch-icon {
					margin-left: 8/@rem;
					.m-icon-arrow--right();
					&:before{
						font-size: 14px;
					}
				}
			}
		}
	}

	.withdraw-footer {
		padding: 0 16/@rem;

		.balance-container {
			line-height: 19px;
			text-align: right;
			margin-bottom: 5/@rem;
			.balance-text {
				vertical-align: middle;
				margin-left: 8/@rem;
				font-size: 12px;
				color: @dark;
			}
		}

		.withdraw-amount {
			box-sizing: border-box;
			padding: 8/@rem 0;
			.amount-prepend {
				font-weight: 500;
				font-size: 14px;
				line-height: 14px;
			}
			input {
				text-align: right;
			}
		}

		.withdraw-submit {
			width: 100%;
			background-color: @green;
			border: none;
			height: 48/@rem;
			margin-top: 18/@rem;
			margin-bottom: 60/@rem;
		}

		.example-cards-container {
			margin-top: 18/@rem;
			margin-bottom: 22/@rem;
			text-align: center;
			.example-card {
				margin-right: 6/@rem;
				vertical-align: center;
				height: 20/@rem;
				width: 30/@rem;
			}
		}

		
	}

	.select-prepend {
		width: 100%;
		padding: 0 16/@rem;
		box-sizing: border-box;

		.new-pay {
			width: 100%;
			border: 1px solid @green;
			text-align: center;
			font-size: 14px;
			font-weight: bold;
			color: @green;
			background-color: @white;
			line-height: 42/@rem;
		}
	}
	.withdraw-rule {
			color: @darkGray;
			text-align: left;
			font-size: 12px;
			line-height: 1.33;
			padding: 0 16/@rem 20/@rem;
			div {
				display: flex;
				flex-direction: row;

			}
			span {
				width: 16px;
				flex: 0 0 auto;
			}
			p {
				flex: 1 1 auto;
			}
		}
}
</style>
