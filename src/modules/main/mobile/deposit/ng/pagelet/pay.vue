<template>
  <div id="deposit">
	<navbar><img slot="right" src="../img/help.svg" @click="depositHelp"></navbar>
	<form>
  	  <af-tabs :value="currentTab" @change="handleTabChange">
		<Notification type="info" :text="notifyContent"/>
	    <af-tab-pane label="Card" name="card">
	      <div class="deposit-account">
		    <af-input ref="cardInput" type="tel" class="deposit-card" v-show="!usingExistCard" v-model="showCardNum" placeholder="Visa, Mastercard, Verve" transformText="Card Number" icon="delete" :iconClick="clearCard" :error="!!cardErr">
			  <img slot="prepend" src="../img/ic-credit-card.svg">
			</af-input>
			<div :class="'deposit-card static' + (!!cardErr ? ' error' : '')" v-show="usingExistCard" @click="clearExistCard('card')">
			  <img class="static-prepend" src="../img/ic-credit-card.svg">
			  <div class="static-content">
			    <div class="static-card-label">Card Number</div>
				<div class="static-card-number">{{existCardNum}}</div>
			  </div>
			  <span class="static-card-name">{{cardBrandName}}</span>
			  <img class="static-card-icon" :src="cardIconUrl">
			  <i class="static-clear"></i>
			</div>
			<div class="error-msg">{{cardErr}}</div>
			<div class="expiryAndCvv">
			  <div class="expiry-container">
				<af-input class="deposit-expiry" ref="expiryInput" v-show="!usingExistCard" type="tel" v-model="expiry" placeholder="MM/YY" transformText="Expiry" icon="delete" :iconClick="clearExpiry" :error="!!expiryErr">
        		  <img slot="prepend" src="../img/ic-date-range.svg">
        		</af-input>
				<div :class="'deposit-expiry static' + (!!expiryErr ? ' error' : '')" v-show="usingExistCard" @click="clearExistCard('expiry')">
  			      <img class="static-prepend" src="../img/ic-credit-card.svg">
  				  <div class="static-content">
  				    <div class="static-card-label">Expiry</div>
      			    <div class="static-card-number">{{existExpiry}}</div>
  				  </div>
  				  <i class="static-clear"></i>
  			    </div>
				<div class="error-msg">{{expiryErr}}</div>
			  </div>
			  <div class="cvv-container">
				<af-input class="deposit-cvv" type="tel" v-model="cvv" placeholder="3 digits" transformText="CVV" icon="delete" :iconClick="clearCvv" :error="!!cvvErr">
        		  <img slot="prepend" src="../img/ic-lock-outline.svg">
        		</af-input>
				<div class="error-msg">{{cvvErr}}</div>
			  </div>
			  <div class="help-container">
			    <img class="cvv-help" @click="handleHelp" src="../img/help-green.svg">
			  </div>
			</div>
			<div class="switch-container">
			  <div class="switch-card" v-if="existCards.length > 0" @click="toggleList('card', true)">Switch Card<i class="switch-icon"/></div>
			</div>
		  </div>
	    </af-tab-pane>

	    <af-tab-pane label="Bank" name="bank">
		  <div class="deposit-bank">
		    <div :class="'deposit-bank-static' + (!!bankErr ? ' error' : '')" @click="toggleList('bank', true)">
			  <img class="bank-static-prepend" src="../img/bank.svg">
			  <div class="bank-static-name" v-if="currentBankIndex > -1 || currentAccountIndex > -1">{{bankName}}</div>
			  <div class="bank-static-name blank" v-if="currentBankIndex < 0 && currentAccountIndex < 0">Select a Bank</div>
			  <img class="bank-static-icon" v-if="currentBankIndex > -1 || currentAccountIndex > -1" :src="bankIconUrl">
			  <i class="bank-static-arrow"/>
			</div>
			<div class="error-msg">{{bankErr}}</div>
			<div v-show="usingExistAccount" :class="'deposit-bank-number static' + (!!accountErr ? ' error' : '')" @click="clearExistAccount(false)">
			  <img class="static-prepend" src="../img/account.svg">
			  <div class="static-content">
			    <div class="static-label">Account Number</div>
				<div class="static-input">{{existbankAccNum}}</div>
			  </div>
			</div>
			<af-input v-show="!usingExistAccount" type="tel" ref="accountInput" class="deposit-bank-number" v-model="bankAccNum" :maxlength="10" placeholder="10 digits" transformText="Account Number" icon="delete" :iconClick="clearAccount" :error="!!accountErr">
  			  <img slot="prepend" src="../img/account.svg">
  		    </af-input>
			<div class="error-msg">{{accountErr}}</div>
			<div class="switch-container">
			  <div class="switch-bank" v-if="existAccounts.length > 0" @click="toggleList('account', true)">Switch Bank Account<i class="switch-icon"/></div>
			</div>
		  </div>
		</af-tab-pane>

        <af-tab-pane label="Dial (USSD)" name="ussd" v-if="showUssd">
         <div class="deposit-bank">
           <div :class="'deposit-bank-static' + (!!ussdBankErr ? ' error' : '')" @click="toggleList('ussd', true)">
             <img class="bank-static-prepend" src="../img/bank.svg">
             <div class="bank-static-name" v-if="currentUssdBankIndex > -1 || currentUssdAccountIndex > -1">{{ussdBankName}}</div>
             <div class="bank-static-name blank" v-if="currentUssdBankIndex < 0 && currentUssdAccountIndex < 0">Select a Bank</div>
             <img class="bank-static-icon" v-if="currentUssdBankIndex > -1 || currentUssdAccountIndex > -1" :src="ussdBankIconUrl">
             <i class="bank-static-arrow"/>
           </div>
           <div class="error-msg">{{ussdBankErr}}</div>

           <div v-show="usingExistUssdAccount" :class="'deposit-bank-number static' + (!!ussdAccountErr ? ' error' : '')" @click="clearExistUssdAccount(false, 'account')">
			 <img class="static-prepend" src="../img/account.svg">
             <div class="static-content">
               <div class="static-label">Account Number</div>
               <div class="static-input">{{existUssdBankAccNum}}</div>
             </div>
           </div>
           <af-input v-show="!usingExistUssdAccount" type="tel" ref="ussdAccountInput" class="deposit-bank-number" v-model="ussdBankAccNum" :maxlength="10" placeholder="10 digits" transformText="Account Number" icon="delete" :iconClick="clearUssdAccount" :error="!!ussdAccountErr">
             <img slot="prepend" src="../img/account.svg">
           </af-input>
           <div class="error-msg">{{ussdAccountErr}}</div>

		   <div v-show="usingExistUssdAccount" :class="'deposit-bank-number static' + (!!ussdPhoneErr ? ' error' : '')" @click="clearExistUssdAccount(false, 'phone')">
			 <i class="static-prepend m-icon-phone"></i>
			 <div class="static-content">
			   <div class="static-label">Phone Number</div>
			   <div class="static-input">{{existUssdPhone}}</div>
			 </div>
		   </div>
		   <af-input v-show="!usingExistUssdAccount" type="tel" ref="ussdPhoneInput" class="deposit-bank-number" v-model="ussdPhone" placeholder="" transformText="Phone Numbe" icon="delete" :iconClick="clearUssdPhone" :error="!!ussdPhoneErr" @focus="handleUssdPhoneFocus($event)">
			  <i slot="prepend" class="static-prepend m-icon-phone"></i>
		   </af-input>
		   <div class="error-msg">{{ussdPhoneErr}}</div>

           <div class="switch-container">
             <div class="switch-bank" v-if="existUssdAccounts.length > 0" @click="toggleList('ussdAccount', true)">Switch Bank Account<i class="switch-icon"/></div>
           </div>
         </div>
       </af-tab-pane>
	   <af-tab-pane label="Quickteller" name="quick">
		   <Quickteller @goStep="goStep"/>
	   </af-tab-pane>
	    <af-tab-pane label="GT Bank" name="gt">
			<GTBank />
		</af-tab-pane>
	  </af-tabs>
	  <div class="deposit-footer" v-show="!['quick', 'gt'].includes(currentTab)">
		<div class="balance-container">
    	  <img src="../img/light-green.svg"><span class="balance-text">Balance ({{currency}})    {{fomatBalance}}</span>
    	</div>
		<af-input class="deposit-amount" type="tel" v-model="amount" :placeholder="'min.' + minAmountHolder" @blur="blurAmount" icon="delete" :iconClick="clearAmount" :error="!!amountErr" @focus="handleAmountFocus($event)">
		  <span class="amount-prepend" slot="prepend">Amount({{currency}})</span>
		</af-input>
		<div class="error-msg">{{amountErr}}</div>
		<af-button class="deposit-submit" :autofocus="false" @click.prevent="handleDeposit" :disabled="depositDisabled" :loading="depositLoading">
			<span>{{depositLoading ? 'Loading' : 'Top Up Now'}}</span>
		</af-button>
		<div class="deposit-promotion" v-if="giftTxt.length > 0">
			<i class="promotion-icon"/>
			<div class="promotion-text">{{giftTxt}}</div>
		</div>
		<div class="example-cards-container">
			<template v-if="currentTab === 'card'">
					<img class="example-card" src="../img/card-master.png">
					<img class="example-card" src="../img/card-verve.png">
					<img class="example-card" src="../img/card-visa.png">
			</template>
			<template v-else-if="currentTab === 'ussd'">
				<div class="card-row" v-for="i in Math.ceil(supportUssdBanks.length/8)">
					<img class="example-card" v-for="bank in supportUssdBanks.slice((i-1)*8, i*8 < supportUssdBanks.length ? i*8 : supportUssdBanks.length )" :src="bank.bankIconUrl">
				</div>
			</template>
			<template v-else>
				<div class="card-row" v-for="i in Math.ceil(supportBanks.length/8)">
				<img class="example-card" v-for="bank in supportBanks.slice((i-1)*8, i*8 < supportBanks.length ? i*8 : supportBanks.length )" :src="bank.bankIconUrl">
				</div>
			</template>
		</div>
	  </div>
		<div class="deposit-footer"><DepositRules :lines="lines"></DepositRules></div>
    </form>
	<popupSelect
	:isShow="showCardList"
	@close="toggleList('card', false)"
	:list="existCards"
	v-model="currentCardIndex"
	:showActionBar="true"
	@change="changeHandle('card')"
	@delete="deleteExistCard"
	ref="card"
	:propertyName="cardProps">
		<div class="select-prepend" slot="prepend"><button class="new-pay" @click="clearAll('card')">Add New</button></div>
	</popupSelect>

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
		<div class="select-prepend" slot="prepend"><button class="new-pay" @click="clearAll('account')">Add New</button></div>
	</popupSelect>

	<popupSelect
	:isShow="showBankList"
	@close="toggleList('bank', false)"
	:list="supportBanks"
	v-model="currentBankIndex"
	@change="changeHandle('bank')"
	:propertyName="bankProps">
		<div class="refresh-container" slot="prepend" v-if="supportBanks.length === 0">
			<p class="error-text">Failed to load data. Please refresh the  page.</p>
			<af-button class="refresh-banks" :autofocus="false" @click.prevent="getSupportBanks" :loading="fetchingBanks">
				<span>{{fetchingBanks ? 'Loading' : 'Refresh'}}</span>
			</af-button></div>
	</popupSelect>

	<popupSelect
	:isShow="showUssdAccountList"
	@close="toggleList('ussdAccount', false)"
	:list="existUssdAccounts"
	v-model="currentUssdAccountIndex"
	:showActionBar="true"
	@change="changeHandle('ussdAccount')"
	@delete="deleteExistUssdAccount"
	ref="ussd"
	:propertyName="ussdAccountProps">
		<div class="select-prepend" slot="prepend"><button class="new-pay" @click="clearAll('ussd')">Add New</button></div>
	</popupSelect>

	<popupSelect
	:isShow="showUssdBankList"
	@close="toggleList('ussd', false)"
	:list="supportUssdBanks"
	v-model="currentUssdBankIndex"
	@change="changeHandle('ussd')"
	:propertyName="ussdBankProps">
		<div class="refresh-container" slot="prepend" v-if="supportUssdBanks.length === 0">
			<p class="error-text">Failed to load data. Please refresh the  page.</p>
			<af-button class="refresh-banks" :autofocus="false" @click.prevent="getSupportUssdBanks" :loading="fetchingUssdBanks">
				<span>{{fetchingUssdBanks ? 'Loading' : 'Refresh'}}</span>
			</af-button></div>
	</popupSelect>
  </div>
</template>

<script>
import Vue from 'vue';
import URL from 'packages/fe.url';
import AfButton from 'packages/button';
import dialog from 'components/dialog';
import navbar from 'components/navbar';
import { AfInput } from 'components/input';
import { AfTabs, AfTabPane } from 'packages/tabs';
import { EventBus } from 'kernel/js/eventBus';
import { mapGetters, mapActions, mapMutations } from 'vuex';
import * as mutationTypes from 'store/deposit/ng/mutationTypes';
import { formatNumber } from 'utils';
import { getAdConfig } from 'utils/getAdConfig';
import { getConfig } from 'deposit/index';
import { pagePath } from 'config/pageConfig.js';
import cookie from 'storage/cookie';
import 'components/login/popupLogin';
import Notification from 'components/notification';
import commonEvent from 'config/eventConfig/commonEvent';
import { showCurrency } from 'config/currencyConfig';
import amountMixin from '../js/amountMixin.js';
import cardNumMixin from '../js/cardNumMixin.js';
import cvvMixin from '../js/cvvMixin.js';
import expiryMixin from '../js/expiryMixin.js';
import bankMixin from '../js/bankMixin.js';
import accountMixin from '../js/accountMixin.js';
import ussdBankMixin from '../js/ussdBankMixin.js';
import ussdAccountMixin from '../js/ussdAccountMixin.js';
import cvvDialog from './cvvDialog.vue';
import bridge from './bridge.vue';
import popupSelect from './popupSelect';
import defaultIcon from '../img/default-card.png';
import GTBank from './gtBank';
import { formatDate,
	formatDateFromApi,
	validateCard,
	validateDate,
	validateCvv,
	validateBank,
	validateAccount,
	validateAmount,
	validatePhone
} from '../js/commonFun.js';
import { statusToDialog } from '../js/config.js';
import DepositRules from './rules';
import Quickteller from './quickteller';

const listMap = {
	card: 'showCardList',
	bank: 'showBankList',
	account: 'showAccountList',
	ussd: 'showUssdBankList',
	ussdAccount: 'showUssdAccountList'
};

const tabMap = {
	card: 4,
	bank: 5,
	quick: 8,
	gt: 13
};

export default {
	components: {
		AfButton,
		AfInput,
		AfTabs,
		AfTabPane,
		navbar,
		cvvDialog,
		popupSelect,
		DepositRules,
		Notification,
		GTBank,
		Quickteller
	},
	mixins: [
		amountMixin,
		cardNumMixin,
		cvvMixin,
		expiryMixin,
		bankMixin,
		accountMixin,
		ussdBankMixin,
		ussdAccountMixin
	],
	data () {
		return {
			currentTab: 'card',
			depositLoading: false,
			minAmountHolder: formatNumber(+window.depositCfg.min, 0),
			giftTxt: '',
			showCurrency,
			currency: window.currency,
			showUssd: false,
			phoneNumber: cookie('phone'),
			notifyFn: () => {},
			notifyContent: '',
			linesFn: () => {},
			lines: [],
		};
	},
	created () {
		this.fetchAcountInfo();
		EventBus.$on(commonEvent.UPDATE_LOGIN_STATUS, this.handleLoginStatus);
		EventBus.$on(commonEvent.UPDATE_ACCOUNT_BALANCE, this.fetchAcountInfo);
		getAdConfig('depositBanner').then(obj => {
			if (obj[0] && obj[0].text) {
				this.giftTxt = obj[0].text;
			}
		});
		// amount
		try {
			let amount = URL.getPara(location.href, 'amount');
			amount = parseInt(amount, 10);
			if (amount) {
				this.amount = amount;
			}
		} catch (err) {
			console.log(err);
		}
		getConfig().then(data => {
			if (data.notifyContent) {
				this.notifyFn = data.notifyContent;
				this.notifyContent = this.notifyFn(4);
			}
			if (data.lines) {
				this.linesFn = data.lines;
				this.lines = this.linesFn(4);
			}
		});
	},
	destroyed() {
		EventBus.$off(commonEvent.UPDATE_LOGIN_STATUS, this.handleLoginStatus);
		EventBus.$off(commonEvent.UPDATE_ACCOUNT_BALANCE, this.fetchAcountInfo);
	},
	mounted() {
		const loading = document.querySelector('#pageLoading');
		loading && (loading.style.display = 'none');
	},
	computed: {
		...mapGetters('assetsInfo', ['fomatBalance']),
		depositDisabled() {
			switch (this.currentTab) {
			case 'card':
				return this.cardErr !== '' || this.expiryErr !== '' || this.cvvErr !== '' || this.amountErr !== '';
			case 'bank':
				return this.bankErr !== '' || this.accountErr !== '' || this.amountErr !== '';
			case 'ussd':
				return this.ussdBankErr !== '' || this.ussdPhoneErr !== '' || this.ussdAccountErr !== '' || this.amountErr !== '';
			default:
			}
		}
	},
	methods: {
		...mapActions('assetsInfo', ['fetchAcountInfo']),
		...mapMutations('deposit', {
			updateDisplayMsg: mutationTypes.UPDATE_DISPLAY_MSG
		}),
		clearAll(type) {
			switch (this.currentTab) {
			case 'card':
				this.clearExistCard();
				// this.clearExpiry();
				this.clearCvv();
				break;
			case 'bank':
				this.clearBank();
				this.clearExistAccount(true);
				break;
			case 'ussd':
				this.clearUssdBank();
				this.clearExistUssdAccount(true);
			default:
			}

			this.$refs[type].close();
			// this.toggleList(type, false);
		},
		createDialog(key, tradeId) {
			this.$dialog();
			let options = Object.prototype.toString.call(key) === '[object Object]' ? key : statusToDialog[key];
			if (options.component) {
				if (options.type === 'otp' && this.currentTab === 'bank') {
					options = {
						type: 'token',
						css: 'show-close',
						title: 'One Time Setup',
						component: true
					};
				}
				// 记录当前状态
				const status = typeof key === 'string' ? key : '';
				const extraData = options.status === 77 ?
					options :
				{
					bankIconUrl: options.type === 'ussd' ? this.ussdBankIconUrl : this.bankIconUrl,
					bankAccNum: this.formatAccount()
				};

				const d = dialog({
					title: options.title,
					content: Vue.extend(bridge).mixin({
						store: window.v_store
					}),
					css: options.css ? options.css : '',
					contentData: {
						tradeId,
						status,
						type: options.type,
						verifyType: options.verifyType,
						extraData
					},
					button: options.button || []
				});

				d.onMounted(() => {
					d.$content.$on('dialog', params => {
						this.createDialog(params.options, params.tradeId);
					});

					d.$content.$on('refresh', message => {
						dialog.alert(message, ['OK'], () => {
							this.deleteObsoleteAsset();
						});
					});

					d.$content.$on('goStep', params => {
						this.$dialog();
						const originData = params.originData || {};
						this.$emit('goStep', params.step, {
							amount: formatNumber(this.amount, 2),
							tradeId: originData.tradeId || this.tradeId,
							account: this.formatAccount(),
							icon: originData.counterIconUrl || this.getBankShowInfo().icon,
							name: originData.counterAuthority || this.getBankShowInfo().name
						});
					});
				});
			} else {
				const d = dialog(options.dialog);
				options.addEvent && options.addEvent(d);
			}
		},
		formatAccount() {
			let num;
			switch (this.currentTab) {
			case 'card':
				num = this.usingExistCard ? this.existCardNum : this.cardNum;
				break;
			case 'bank':
				num = this.usingExistAccount ? this.existbankAccNum : this.bankAccNum;
				break;
			case 'ussd':
				num = this.usingExistUssdAccount ? this.existUssdBankAccNum : this.ussdBankAccNum;
			default:

			}

			if (num.indexOf('*') === -1) {
				num = '****' + num.substr(num.length - 4, 4);
			}
			return num;
		},
		handleLoginStatus() {
			this.$popupLogin && this.$popupLogin.close();
			// fetch banks/assets
			this.fetchAcountInfo();
			this.getSupportBanks();
			this.getSupportUssdBanks();
			this.getExistList();
			this.phoneNumber = cookie('phone');
		},
		submitCheck() {
			let checkList;
			switch (this.currentTab) {
			case 'card':
				{
					const cardNum = this.usingExistCard ? this.existCardNum : this.showCardNum;
					const expiry = this.usingExistCard ? this.existExpiry : this.expiry;
					/* eslint-disable */
					checkList = [
						() => this.cardErr = validateCard(cardNum) || '',
						() => this.expiryErr = validateDate(formatDate(expiry)) || '',
						() => this.cvvErr = validateCvv(this.cvv) || '',
						() => this.amountErr = validateAmount(this.amount, 'deposit', true, true) || ''];
					break;
				}
			case 'bank':
				{
					const bankAccNum = this.usingExistAccount ? this.existbankAccNum : this.bankAccNum;
					/* eslint-enable */
					checkList = [
						() => this.bankErr = validateBank(this.bankCode) || '',
						() => this.accountErr = validateAccount(bankAccNum) || '',
						() => this.amountErr = validateAmount(this.amount, 'deposit', true, true) || ''];
					break;
				}
			case 'ussd':
				{
					const ussdbankAccNum = this.usingExistUssdAccount ? this.existUssdBankAccNum : this.ussdBankAccNum;
					const phoneNo = this.usingExistUssdAccount ? this.existUssdPhone : this.ussdPhone;
					/* eslint-enable */
					checkList = [
						() => this.ussdBankErr = validateBank(this.ussdBankCode) || '',
						() => this.ussdAccountErr = validateAccount(ussdbankAccNum) || '',
						() => this.ussdPhoneErr = validatePhone(phoneNo) || '',
						() => this.amountErr = validateAmount(this.amount, 'deposit', true, true) || ''];
					break;
				}
			default:
			}
			for (let i = 0; i < checkList.length; i++) {
				if (checkList[i]().length > 0) {
					return false;
				}
			}
			return true;
		},
		getBankShowInfo(data = {}) {
			const currentTab = this.currentTab;
			let icon,
				name;

			switch (currentTab) {
			case 'card':
				icon = this.cardIconUrl;
				name = this.cardBrandName;
				break;
			case 'bank':
				icon = this.bankIconUrl;
				name = this.bankName;
				break;
			case 'ussd':
				icon = this.ussdBankIconUrl;
				name = data.counterAuthority || this.ussdBankName;
			default:
			}

			return {
				icon,
				name
			};
		},
		handleDeposit() {
			if (!this.submitCheck()) {
				return;
			}
			this.depositLoading = true;
			const params = {
				phoneNo: cookie('phone'),
				currency: window.currency,
				payAmount: this.amount * 10000
			};

			switch (this.currentTab) {
			case 'card':
				if (this.usingExistCard) {
					Object.assign(params, {
						payChId: 1,
						bankAssetId: this.existCards[this.currentCardIndex].id,
						cardCvv: this.cvv
					});
				} else {
					Object.assign(params, {
						payChId: 20,
						cardNum: this.cardNum,
						cardCvv: this.cvv,
						cardExpDate: formatDate(this.expiry)
					});
				}
				break;
			case 'bank':
				if (this.usingExistAccount) {
					Object.assign(params, {
						payChId: 1,
						bankAssetId: this.existAccounts[this.currentAccountIndex].id
					});
				} else {
					Object.assign(params, {
						payChId: 21,
						bankCode: this.bankCode,
						bankAccNum: this.bankAccNum,
					});
				}
				break;
			case 'ussd':
				if (this.usingExistUssdAccount) {
					Object.assign(params, {
						payChId: 1,
						bankAssetId: this.existUssdAccounts[this.currentUssdAccountIndex].id
					});
				} else {
					Object.assign(params, {
						payChId: 32,
						bankCode: this.ussdBankCode,
						bankAccNum: this.ussdBankAccNum,
						phoneNo: this.ussdPhone
					});
				}
				break;
			default:
			}

			this.tradeId = '';
			fetch('/pocket/v1/bankTrades/bankTrade/deposit', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(params),

			}).then(res => {
				this.depositLoading = false;
				return res.json();
			}).then(res => {
				console.log('res', res);
				if (res.login === false) {
					this.$popupLogin.show();
					return;
				}
				const { bizCode, data } = res;

				if (bizCode === 10000) {
					this.tradeId = data.tradeId;
					if (data.status === 20 || data.status === 71) {
						const counterInfo = this.getBankShowInfo(data);
						this.$emit('goStep', 'success', {
							amount: formatNumber(this.amount, 2),
							tradeId: this.tradeId,
							account: this.formatAccount(),
							icon: counterInfo.icon,
							name: counterInfo.name
						});
					} else if (data.status === 87) {
						location.href = data.jumpUrl;
						// this.createDialog(data.status, data.tradeId);
					} else if (data.status === 30) {
						const options = statusToDialog[data.status];
						options.dialog.content = res.message ? res.message : options.dialog.content;
						this.createDialog(options, data.tradeId);
					} else if (data.status === 77) {
						let ussdInfo = statusToDialog[data.status];

						ussdInfo = Object.assign(ussdInfo, {
							counterPart: data.counterPart || `****${this.ussdAccount.substr(this.ussdAccount.length - 4, 4)}`,
							dialNumber: data.dialNumber,
							transactionRef: data.transactionRef,
							status: data.status,
							amount: this.amount,
							bankIconUrl: data.counterIconUrl || this.getBankShowInfo(data).icon,
							bankAccNum: data.counterAuthority || this.getBankShowInfo(data).name,
							phoneNo: this.usingExistUssdAccount ? this.existUssdPhone : `****${this.ussdPhone.substr(this.ussdPhone.length - 4, 4)}`
						});
						this.createDialog(ussdInfo, data.tradeId);
					} else {
						if (data.displayMsg) {
							this.updateDisplayMsg(data.displayMsg);
						}
						this.createDialog(data.status, data.tradeId);
					}
				} else if (bizCode === 62100) { // 超过后台配置日交易限额，使用后台错误信息
					dialog.alert(res.message, ['OK']);
				} else if (bizCode === 11000 || bizCode === 19000) {
					const status = 30; // 11000同样提示失败
					const options = statusToDialog[status];
					options.dialog.content = res.message ? res.message : options.dialog.content;
					this.createDialog(options, data.tradeId);
				} else if (bizCode === 65001) { // 所选资产不存在
					dialog.alert(res.message, ['OK'], () => {
						this.deleteObsoleteAsset();
					});
				} else {
					const msg = res.message ? res.message : 'We are unable to accept your payment at this time. Please check your payment information and try again later.';
					dialog.alert(msg, ['OK']);
				}
			}).catch(e => {
				this.depositLoading = false;
				if (!navigator.onLine) {
					dialog.alert('No internet connection, try again.');
				} else {
					dialog.alert('Sorry，something went wrong. Please try again later.');
				}
			});
		},
		deleteObsoleteAsset() {
			switch (this.currentTab) {
			case 'card':
				this.existCards.splice(this.currentCardIndex, 1);
				this.clearExistCard('card');
				break;
			case 'bank':
				this.existAccounts.splice(this.currentAccountIndex, 1);
				this.clearExistAccount(false);
				break;
			case 'ussd':
				this.existUssdAccounts.splice(this.currentUssdAccountIndex, 1);
				this.clearExistUssdAccount(false);
				break;
			default:

			}
		},
		handleHelp() {
			dialog({
				title: null,
				css: 'deposit-dialog-wap',
				content: cvvDialog,
				button: ['OK']
			});
		},
		depositHelp() {
			location.href = pagePath.help + '#/how-to-play/others/how-to-deposit';
		},
		handleTabChange(tab) {
			this.currentTab = tab;
			this.notifyContent = this.notifyFn(tabMap[tab]);
			this.lines = this.linesFn(tabMap[tab]);
		},
		changeHandle(type) {
			this.toggleList(type, false);
			switch (type) {
			case 'card':
				this.useExistCard(this.existCards[this.currentCardIndex]);
				break;
			case 'account':
				this.useExistAccount(this.existAccounts[this.currentAccountIndex]);
				break;
			case 'bank':
				this.useBank(this.supportBanks[this.currentBankIndex]);
				if (this.usingExistAccount) {
					this.clearExistAccount(true);
				}
				break;
			case 'ussd':
				this.useUssdBank(this.supportUssdBanks[this.currentUssdBankIndex]);
				if (this.usingExistUssdAccount) {
					this.clearExistUssdAccount(true);
				}
				break;
			case 'ussdAccount':
				this.useExistUssdAccount(this.existUssdAccounts[this.currentUssdAccountIndex]);
				break;
			default:
				break;

			}
		},
		toggleList(type, val) {
			this[listMap[type]] = val;
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
						if (res.bizCode === 10000) {
							this.existAccounts.splice(index, 1);

							if (this.existAccounts.length === 0) {
								this.clearExistAccount(true);
							} else if (index === this.currentAccountIndex) { // 删除选中的，选中第一个
								this.currentAccountIndex = 0;
								this.useExistAccount(this.existAccounts[0]);
							} else if (index < this.currentAccountIndex) { // 删除前面的，维护当前index
								this.currentAccountIndex = this.currentAccountIndex - 1;
							}
						} else {
							this.$toast(res.message);
						}
					}).catch(e => {
						this.$toast('Sorry，something went wrong. Please try again later.');
					});
				} else {
					d.close();
				}
			});
		},
		deleteExistUssdAccount(index) {
			const d = this.$dialog({
				title: null,
				content: 'Are you sure you want to delete this account information?',
				button: ['NO', 'YES']
			});
			d.onBtnClick(btn => {
				if (btn === 1) {
					fetch('/pocket/v1/wallet/bankAssets/' + this.existUssdAccounts[index].id, {
						method: 'DELETE'
					}).then(res => res.json()).then(res => {
						if (res.bizCode === 10000) {
							this.existUssdAccounts.splice(index, 1);

							if (this.existUssdAccounts.length === 0) {
								this.clearExistUssdAccount(true);
							} else if (index === this.currentUssdAccountIndex) { // 删除选中的，选中第一个
								this.currentUssdAccountIndex = 0;
								this.useExistUssdAccount(this.existUssdAccounts[0]);
							} else if (index < this.currentUssdAccountIndex) { // 删除前面的，维护当前index
								this.currentUssdAccountIndex = this.currentUssdAccountIndex - 1;
							}
						} else {
							this.$toast(res.message);
						}
					}).catch(e => {
						this.$toast('Sorry，something went wrong. Please try again later.');
					});
				} else {
					d.close();
				}
			});
		},
		clearExistCard(type) {
			this.clearCard();
			this.clearExpiry();
			this.usingExistCard = false;
			this.existCardNum = '';
			this.existExpiry = '';
			this.currentCardIndex = -1;
			if (type === 'card') {
				this.$nextTick(() => {
					this.$refs.cardInput.$refs['transform-input'].focus();
				});
			} else if (type === 'expiry') {
				this.$nextTick(() => {
					this.$refs.expiryInput.$refs['transform-input'].focus();
				});
			}
		},
		deleteExistCard(index) {
			const d = this.$dialog({
				title: null,
				content: 'Are you sure you want to delete this card?',
				button: ['NO', 'YES']
			});
			d.onBtnClick(btn => {
				if (btn === 1) {
					fetch('/pocket/v1/wallet/bankAssets/' + this.existCards[index].id, {
						method: 'DELETE'
					}).then(res => res.json()).then(res => {
						if (res.bizCode === 10000) {
							this.existCards.splice(index, 1);

							if (this.existCards.length === 0) {
								this.clearExistCard();
							} else if (index === this.currentCardIndex) { // 删除选中的，选中第一个
								this.currentCardIndex = 0;
								this.useExistCard(this.existCards[0]);
							} else if (index < this.currentCardIndex) { // 删除前面的，维护当前index
								this.currentCardIndex = this.currentCardIndex - 1;
							}
						} else {
							this.$toast(res.message);
						}
					}).catch(e => {
						this.$toast('Sorry，something went wrong. Please try again later.');
					});
				} else {
					d.close();
				}
			});
		},
		useExistCard(card) {
			this.existCardNum = card.cardNumber;
			this.cardBrandName = card.cardBrand;
			this.cardIconUrl = card.cardBrandIconUrl ? card.cardBrandIconUrl : defaultIcon;
			this.usingExistCard = true;
			this.cardErr = '';
			this.cardAssetId = card.id;
			this.existExpiry = formatDateFromApi(card.cardExpDate);
			// this.expiry = formatDateFromApi(card.cardExpDate);
			this.expiryErr = '';
			this.cvv = '';
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
		},
		useUssdBank(bank) {
			this.ussdBankName = bank.bankName;
			this.ussdBankCode = bank.bankCode;
			this.ussdBankIconUrl = bank.bankIconUrl ? bank.bankIconUrl : defaultIcon;
			this.ussdBankErr = '';
		},
		useExistUssdAccount(account) {
			this.useUssdBank(account);
			this.currentUssdBankIndex = this.localUssdBanksMap.indexOf(account.bankName);

			this.existUssdBankAccNum = account.accountNumber;
			this.bankUssdAssetId = account.id;
			this.usingExistUssdAccount = true;
			this.ussdAccountErr = '';

			this.existUssdPhone = account.phoneNo;
			this.ussdPhone = '';
			this.ussdPhoneErr = '';
		},
		goStep(payload) {
			this.$emit('goStep', payload);
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
		  display: block;
	  }
  }
  .es-dialog.reset-dislog-title {
  	 .es-dialog-head {
  	 	h1 {
  	 		height: auto;
  	 	}
  	 }
  }
  #deposit {
	  .m-tabs-nav {
		  border-bottom: 1px solid @lightGray;
		  width: 100%;
		  width: 100vw;
		  .m-tabs-tab {
			  font-size: 14px;
			  line-height: 16px;
			  text-align: center;
			  padding: 20/@rem 0 14/@rem;
			  box-sizing: border-box;
			  width: 33.33%;
			  &.m-tabs-tab-active {
				  font-weight: bold;
			      color: @dark;
		      }
		  }
	  }
	  .m-tabs-ink-bar {
		  background-color: @green;
	  }
	  .error-msg {
		  min-height: 12px;
		  line-height: 12px;
		  font-size: 10px;
		  text-align: left;
		  color: @red;
		  margin-top: 2px;
	  }
	  .deposit-account {
		  padding: 0 16/@rem;
		  .deposit-card {
			  box-sizing: border-box;
			  margin-top: 22/@rem;
			  //width: 100%;
		  }
		  .static {
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
				  margin: 0 10px;
			  }
			  .static-content {
				  flex: 1;
				  padding: 8px 0;
				  .static-card-label {
					  font-size: 10px;
					  line-height: 12px;
					  height: 12px;
					  margin-bottom: 4px;
					  text-align: left;
					  color: @green;
				  }
				  .static-card-number {
					  font-size: 14px;
					  line-height: 16px;
					  height: 16px;
				  }
			  }
			  .static-card-name {
				  flex: 0;
			  }
			  .static-card-icon {
				  flex: 0;
				  height: 20px;
				  margin-left: 8/@rem;
			  }
			  .static-clear {
				  .m-icon-delete();
				  color: @defaultTextColor;
				  margin: 0 9/@rem;
			  }
		  }

		  .expiryAndCvv {
			  margin-top: 5/@rem;
			  display: flex;
			  flex-direction: row;
			  justify-content: center;
			  .expiry-container {
				  flex: 1 1 auto;
				  width: 155/@rem;
				  margin-right: 18/@rem;
				  .deposit-expiry {
					  box-sizing: border-box;
				  }
			  }
			  .cvv-container {
				  flex: 1 1 auto;
				  width: 130/@rem;
				  margin-right: 7/@rem;
				  .deposit-cvv {
					  box-sizing: border-box;
				  }
			  }
			  .help-container {
				  flex: 0 0 auto;
				  width: 18/@rem;
				  padding-bottom: 14px;
				  line-height: 50/@rem;

				  img {
					width: 18/@rem;
					vertical-align: middle;
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
			  .switch-card {
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

	  .deposit-bank {
	      padding: 0 16/@rem;
		  .deposit-bank-static {
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
		  .deposit-bank-number {
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

		  .m-icon-phone {
			  .m-icon-phone();
			  color: fadeout(@green, 40%);

			  &:before {
				  font-size: 21/@rem;
				  line-height: 1;
			  }
		  }
	  }

	  .deposit-footer {
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

		  .deposit-amount {
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

		  .deposit-submit {
			  width: 100%;
			  background-color: @green;
			  border: none;
			  height: 48/@rem;
			  margin-top: 18/@rem;
			  margin-bottom: 8/@rem;
		  }

		  .deposit-promotion {
			  width: 100%;
			  padding: 0 17/@rem;
			  box-sizing: border-box;
			  display: flex;
			  justify-content: center;
			  align-items: center;
			  .promotion-icon {
				  flex: 0 0 auto;
				  margin-right: 8/@rem;
				  .m-icon-dollar2();
				  color: #f2af00;
				  &:before {
					  font-size: 16/@rem;
				  }
			  }
			  .promotion-text {
				  flex: 1 1 auto;
				  line-height: 16/@rem;
				  font-size: 12/@rem;
				  text-align: left;
				  color: @green;
			  }
		  }

		  .example-cards-container {
			  margin-top: 10/@rem;
			  margin-bottom: 10/@rem;
			  text-align: center;
			  .example-card {
				  margin-right: 6/@rem;
				  vertical-align: center;
				  height: 20/@rem;
				  width: 30/@rem;
			  }
			  .card-row {
				margin-bottom: 12/@rem;
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
	  .refresh-container {
		  text-align: center;
		  .error-text {
			  margin-top: 50/@rem;
			  text-align: center;
			  color: @dark;
			  font-size: 14/@rem;
		  }

		  .refresh-banks {
			  margin-top: 40/@rem;
			  width: 120/@rem;
			  border: none;
			  background-color: @green;
		  }
	  }

	.m-input-wap-wrapper {
		&--active {
			border: 1px solid #0d9737;
		}
	}
  }


</style>
