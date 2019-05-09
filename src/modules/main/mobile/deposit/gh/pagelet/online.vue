<template lang="html">

<div class="m-dp-gh-online">
    <div class="deposit-bank">
        <div
			class="deposit-bank-static f-flex"
			@click="toggleList(true)"
		>
			<div class="bank-static-prepend">
				<img :src="channelIconUrl" />
			</div>
            <div class="bank-static-name f-flex-item">{{channelShowName}}</div>

			<div class="bank-switch">
				<span>Switch</span>
				<i class="bank-static-arrow" />
			</div>
        </div>

		<template v-if="needVCode">
			<af-input
    			type="tel"
    			ref="vCodeInput"
    			v-model="vCode"
    			placeholder=""
    			transformText="Voucher Code"
    			icon="delete"
    			:iconClick="clearVCode"
    			:error="!!vCodeErr"
    		>
				<i class="m-icon-code" slot="prepend"></i>
            </af-input>
            <div class="error-msg">{{vCodeErr}}</div>

    		<p class="m-desc">{{vCodeTips}}<span class="m-t-light" @click="showVCodeDesc">Details></span></p>
		</template>
		<!-- icon="delete" :iconClick="clearPhone"-->

        <af-input
			type="tel"
			ref="phoneInput"
			v-model="phoneNo"
			placeholder=""
			transformText="Mobile Number"
			:disabled="true"
			:error="!!phoneErr"
			@focus="chgPhone"
		>
			<div slot="prepend">
				<i class="m-icon-phone"></i>
			</div>
			<div slot="transform-prepend" class="m-cCode">{{countryCode}}</div>
        </af-input>
        <div class="error-msg">{{phoneErr}}</div>
    </div>

	<div class="deposit-footer">
		<div class="balance-container">
			<i class="m-icon-tips"></i>
			<span class="balance-text">Balance ({{showCurrency}})		{{fomatBalance}}</span>
		</div>

		<af-input
			class="deposit-amount"
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
			class="deposit-submit"
			:autofocus="false"
			@click.prevent="handleDeposit"
			:disabled="depositDisabled"
			:loading="depositLoading"
		>
			<span>{{depositLoading ? 'Loading' : 'Top Up Now'}}</span>
		</af-button>
		<GiftTips />
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

</template>

<script>
import {
	mapActions,
	mapState,
	mapGetters
} from 'vuex';
import {
	showCurrency,
	showCurrencyOrigin
} from 'config/currencyConfig';

import {
	LS,
	cookie
} from 'storage';

import AfButton from 'packages/button';
import {
	AfInput
} from 'components/input';

import {
	vCodeTips,
	chgPhoneTips
} from '../js/config';

import {
	validateBankUnion,
	modifyPhone
} from '../js/commonFun';

import bankMixin from '../js/bankMixin';
import amountMixin from '../js/amountMixin';
import phoneMixin from '../js/phoneMixin';
import vCodeMixin from '../js/vCodeMixin';
import popupSelect from '../../ng/pagelet/popupSelect';

import GiftTips from './giftTip.vue';

const showChgPTips = LS.get('h5_gh_dp_pTip') || '0';
const regPhone = cookie('phone') || '';

export default {
	components: {
		popupSelect,
		GiftTips,
		AfButton,
		AfInput
	},
	mixins: [
		amountMixin,
		bankMixin,
		phoneMixin,
		vCodeMixin
	],
	data() {
		return {
			depositLoading: false,
			showCurrency,
			vCodeTips,
			currency: showCurrencyOrigin,
			showDiffPhoneTips: +showChgPTips
		};
	},
	computed: {
		...mapGetters('assetsInfo', [
			'fomatBalance'
		]),
		...mapState('deposit', [
			'reqLoading',
			'bankHistory'
		]),
		depositDisabled() {
			if (this.hasError) {
				return true;
			}

			let validateRet = this.amount && !this.amountErr ||
				this.phoneNo && !this.phoneErr;

			if (this.needVCode) {
				validateRet = validateRet || this.vCode && !this.vCodeErr;
			}
			return !validateRet;
		},
		hasError() {
			const isHistoryPhone = this.isHistoryPhone || false;

			let validateRet = !!this.amountErr;

			if (this.needVCode) {
				validateRet = !!this.vCodeErr || validateRet;
			}

			if (!isHistoryPhone) {
				validateRet = !!this.phoneErr || validateRet;
			}

			return validateRet;
		}
	},
	watch: {
		reqLoading(val) {
			if (!val) {
				this.depositLoading = false;
			}
		}
	},
	methods: {
		...mapActions('deposit', [
			'deposit'
		]),
		toggleList(val) {
			this.showBankList = val;
		},
		changeHandle() {
			// this.clearPhone();
		},
		handleDeposit() {
			if (this.depositLoading) {
				return;
			}

			const params = {
				payAmount: this.amount || '',
				channel: this.channelSendName || '',
				channelIconUrl: this.channelIconUrl,
				channelShowName: this.channelShowName
			};

			if (this.isHistoryPhone) {
				const bankHistory = this.bankHistory || {};
				params.phoneNo = bankHistory.phoneNo || '';
			} else {
				params.phoneNo = this.originPhoneNo;
			}

			if (this.needVCode) {
				params.token = this.vCode;
			}

			const validateRet = validateBankUnion(Object.assign({},
				params,
				{
					needVCode: this.needVCode,
					isHistoryPhone: this.isHistoryPhone
				}
			));

			if (validateRet) {
				this.phoneErr = validateRet.phoneRet || '';
				this.amountErr = validateRet.amountRet || '';
				this.vCodeErr = validateRet.vCodeRet || '';
				return;
			}

			if (!this.showDiffPhoneTips && regPhone.replace(/^0/, '') !== this.originPhoneNo.replace(/^0/, '')) {
				this.$dialog({
					css: 'm-dp-tips',
					width: '80%',
					title: 'Note',
					content: `${chgPhoneTips} (${modifyPhone(regPhone)})`,
					button: ['Continue Depositing', 'Cancel']
				}).onBtnClick(btnType => {
					if (btnType === 0) {
						this.depositLoading = true;
						this.deposit(params);
					}
				});

				LS.set('h5_gh_dp_pTip', 1);
				this.showDiffPhoneTips = 1;
			} else {
				this.depositLoading = true;
				this.deposit(params);
			}
		}
	}
};
</script>

<style lang="less">
@import '../style/online.less';
</style>
