<template lang="html">
<div>
	<withdrawBlockTip from="withdraw"/>
	<Notification v-if="!auditStatus" type="info" :text="notifyContent"/>
	<div class="m-wd-gh-index">
		<div class="wd-bank">
			<p
				v-if="showPhone"
				class="m-tips"
			>Withdraw to mobile: {{showPhone}}</p>
			<div
				class="wd-bank-static f-flex"
				@click="toggleList(true)"
			>
				<div class="bank-static-prepend">
					<img
						class="bank-static-icon"
						:src="channelIconUrl" />
				</div>
				<div class="bank-static-name f-flex-item">{{channelShowName}}</div>

				<div class="bank-switch">
					<span>Switch</span>
					<i class="bank-static-arrow" />
				</div>
			</div>

			<!-- <af-input
				type="tel"
				ref="nameInput"
				v-model="usrName"
				placeholder=""
				transformText="Mobile Owner Full Name"
				icon="delete"
				:iconClick="clearUsrName"
				:error="!!nameErr"
				@focus="chgName"
			>
				<div slot="prepend">
					<i class="m-icon-usr"></i>
				</div>
			</af-input>
			<div class="error-msg">{{nameErr}}</div> -->
		</div>

		<div class="wd-footer">
			<div class="balance-container">
				<i class="m-icon-tips"></i>
				<span class="balance-text">Balance ({{showCurrency}})		{{fomatBalance}}</span>
			</div>

			<af-input
				class="wd-amount"
				type="tel"
				ref="amountInput"
				v-model="amount"
				:placeholder="'min.' + minAmountHolder"
				@blur="blurAmount"
				icon="delete"
				:iconClick="clearAmount"
				:error="!!amountErr"
			>
				<span
					class="amount-prepend"
					slot="prepend"
				>Amount({{currency}})</span>
			</af-input>
			<div class="error-msg">{{amountErr}}</div>
			<af-button
				class="wd-submit"
				:autofocus="false"
				@click.prevent="handleWithdraw"
				:disabled="withdrawDisabled"
			>
				<span>Withdraw</span>
			</af-button>

			<WithdrawTips :lines="lines"/>
		</div>

		<popupSelect
			:isShow="showBankList"
			@close="toggleList(false)"
			:list="supportBanks"
			v-model="currentBankIndex"
			@change="changeHandle"
			:propertyName="bankProps">
			<div
				class="refresh-container"
				slot="prepend"
				v-if="bankLoadError"
			>
				<p class="error-text">Failed to load data. Please refresh the page.</p>
				<af-button
					class="refresh-banks"
					:autofocus="false"
					@click.prevent="getSupportBanks"
					:loading="fetchingBanks"
				>
					<span>{{fetchingBanks ? 'Loading' : 'Refresh'}}</span>
				</af-button>
			</div>
		</popupSelect>
	</div>
</div>
</template>

<script>
import Vue from 'vue';
import {
	mapActions,
	mapState,
	mapGetters,
	mapMutations
} from 'vuex';
import {
	showCurrency,
	showCurrencyOrigin
} from 'config/currencyConfig';
import {
	cookie
} from 'storage';

import AfButton from 'packages/button';
import { AfInput } from 'components/input';
import Notification from 'components/notification';

import commonEvent from 'config/eventConfig/commonEvent';
import { EventBus } from 'kernel/js/eventBus';
import { getConfig } from 'deposit/index';
import * as mutationTypes from 'store/withdraw/gh/mutationTypes';
import 'components/login/popupLogin';
import withdrawBlockTip from 'components/withdrawBlockTip';
import checkWithdrawBlock from 'components/withdrawBlockTip/withdrawDialog.js';
import {
	validateBankUnion,
	modifyPhone
} from '../js/commonFun';

import bankMixin from '../js/bankMixin';
import amountMixin from '../js/amountMixin';
// import nameMixin from '../js/nameMixin';
import popupSelect from '../../../deposit/ng/pagelet/popupSelect';
import PopConfirm from './confirm.vue';
import aduitComfirm from './confirmPop.vue';
import WithdrawTips from './withdrawTips.vue';

export default {
	components: {
		popupSelect,
		AfButton,
		AfInput,
		Notification,
		WithdrawTips,
		withdrawBlockTip
	},
	mixins: [
		amountMixin,
		bankMixin,
		// nameMixin
	],
	data() {
		return {
			showCurrency,
			currency: showCurrencyOrigin,
			showPhone: modifyPhone(),
			notifyFn: () => {},
			notifyContent: '',
			linesFn: () => {},
			lines: [],
		};
	},
	computed: {
		...mapState('assetsInfo', [
			'balance',
			'auditStatus'
		]),
		...mapGetters('assetsInfo', [
			'fomatBalance'
		]),
		...mapState('withdraw', [
			'reqLoading',
			'errorInfo',
		]),
		withdrawDisabled() {
			if (this.hasError) {
				return true;
			}

			const validateRet = this.amount && !this.amountErr;
			 // || this.usrName && !!this.nameErr;

			return !validateRet;
		},
		hasError() {
			// const isHistoryName = this.isHistoryName || false;

			const validateRet = !!this.amountErr;

			// if (!isHistoryName) {
			// 	validateRet = !!this.nameErr || validateRet;
			// }

			return validateRet;
		}
	},
	watch: {
		errorInfo(val) {
			const type = val && val.type || '';

			switch (type) {
			case 'login':
				this.$dialog();
				this.$popupLogin.show();
				break;
			case 'dialog':
				this.$dialog();
				this.$dialog({
					title: val.title || null,
					width: '85%',
					content: val.msg,
					button: ['OK']
				}).onBtnClick(btnType => {
					if (val.jmp) {
						location.href = val.jmp;
					}

					if (val.clearAmount) {
						this.clearAmount();
						this.fetchAcountInfo();
					}

					if (val.refresh) {
						window.location.reload();
					}
				});
				break;
			case 'confirmAudit':
				this.$dialog();
				this.$dialog({
					title: null,
					width: '85%',
					content: Vue.extend(aduitComfirm).mixin({
						store: window.v_store
					}),
					button: []
				});
				break;
			default:
			}
		},
	},
	methods: {
		...mapActions('withdraw', [
			'getBankList',
			'getHistoryList'
		]),
		...mapActions('assetsInfo', [
			'fetchAcountInfo'
		]),
		...mapMutations('withdraw', {
			saveWdInfo: mutationTypes.UPDATEWITHDRAWINFO
		}),
		toggleList(val) {
			this.showBankList = val;
		},
		changeHandle() {
			// this.clearUsrName();
		},
		handleWithdraw() {
			if (!checkWithdrawBlock(this.auditStatus)) {
				return;
			}
			const params = {
				payAmount: this.amount || '',
				channel: this.channelSendName || '',
				channelIconUrl: this.channelIconUrl,
				phoneNo: cookie('phone') || ''
			};

			// if (this.isHistoryName) {
			// 	const bankHistory = this.bankHistory || {};
			// 	params.name = bankHistory.name || '';
			// } else {
			// 	params.name = this.usrName;
			// }

			const validateRet = validateBankUnion(Object.assign(
				params,
				{
					isHistoryPhone: this.isHistoryPhone
				}
			), this.balance);

			if (validateRet) {
				// this.nameErr = validateRet.nameRet || '';
				this.amountErr = validateRet.amountRet || '';
				return;
			}

			this.saveWdInfo(params);

			this.$dialog();
			this.$dialog({
				title: null,
				'class': 'm-wd-pop-cfm',
				content: Vue.extend(PopConfirm).mixin({
					store: window.v_store
				}),
				contentData: {
					channelShowName: this.channelShowName
				},
				position: {
					bottom: 0,
					left: 0,
					right: 0
				},
				width: '100%',
				button: []
			});
		},
		handleLoginStatus() {
			this.$popupLogin && this.$popupLogin.close();
			this.fetchAcountInfo();
			this.getHistoryList();
			this.getBankList();
		},
	},
	created() {
		this.fetchAcountInfo();
		this.getHistoryList();
		this.getBankList();
		getConfig().then(data => {
			if (data.notifyContent) {
				this.notifyFn = data.notifyContent;
				this.notifyContent = this.notifyFn(10);
			}
			if (data.lines) {
				this.linesFn = data.lines;
				this.lines = this.linesFn(10);
			}
		});
	},
	mounted() {
		EventBus.$on(commonEvent.UPDATE_LOGIN_STATUS, this.handleLoginStatus);
	},
	destroyed() {
		EventBus.$off(commonEvent.UPDATE_LOGIN_STATUS, this.handleLoginStatus);
	},
};
</script>

<style lang="less">
@import '../style/index.less';
</style>
