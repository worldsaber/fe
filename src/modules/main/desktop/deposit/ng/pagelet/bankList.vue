<template lang="html">

<div class="m-bank-list">
	<ul class="f-title">
		<li class="l-col1">Bank Name</li>
		<li class="l-col2">Account Number</li>
	</ul>
	<ul class="f-wrapper">
		<li
			v-for="(item, index) in bankHistoryList"
			:key="item.id"
			:class="[
				'l-item',
				{
					'l-item-checked': isCurrent(index)
				}
			]"
			@click="changeSelBank(index)"
			@mousemove="handleMouseMove($event, index)"
		>
			<div class="l-col1">
				<i class="i-icon-check"></i>
				<div class="m-image-wrapper" v-if="item.bankIconUrl">
					<img :src="item.bankIconUrl" alt="" />
				</div>
				<span class="f-text">{{item.bankName}}</span>
			</div>

			<div class="l-col2">
				<span class="f-text">{{item.accountNumber}}</span>
			</div>

			<div class="l-col3 f-del-wrapper">
				<span class="f-text-del" @click.stop="handleDel">Delete</span>
				<div class="f-pop-wrapper" v-show="showDelTips">
					<span>{{delBankTips}}</span>
					<div class="f-line">
						<af-button extraType="text" @click.stop="cancelDel">No</af-button>
						<af-button extraType="primary" :loading="delLoading" @click.stop="subDel(index)">{{getDelText}}</af-button>
					</div>
					<i class="f-pop-arrow"></i>
				</div>
			</div>
		</li>

		<!-- a new card  -->
		<li :class="[
			  'l-item',
			  'l-item-fix',
			  {
				  'l-item-checked': !isHistoryBank
			  }
			]"
			@click="addBank"
			@mousemove="handleMouseMove($event)"
		>
			<div class="l-col1">
				<i class="i-icon-check"></i>
				<span class="f-text">Pay with a new bank account</span>
			</div>

			<div class="f-line" v-if="showAddPanel">
				<span class="f-label">Bank Account</span>
				<div class="f-line-item i-bank">
					<div
						:class="[
							'f-list-wrapper',
							{
								'on': showBankList,
								'is-error': isBankCodeError
							}
						]"
						tabindex="9"
						@click.stop="toggleBankList"
					>
						<div class="f-content">
							<div class="m-image-wrapper" v-show="backIconUrl">
								<img :src="backIconUrl" alt="">
							</div>
							<span :class="[
								'f-btn',
								{
									'f-btn--fix': backIconUrl
								}
							]">{{selectBank}}</span>
							<i :class="[
								'i-icon--more',
								{
									'on': showBankList
								}
							]"></i>
						</div>
						<template v-if="bankLoading">
							<div class="m-error-wrapper">
								<div>
									<i class="m-icon-loading"></i>
									<span class="m-text-msg">Loading...</span>
								</div>
							</div>
						</template>
						<template v-else-if="bankLoadError">
							<div class="m-error-wrapper m-error-wrapper-fix">
								<div>
									<span class="m-error-msg">Failed to load data. Please refresh the page.</span>
									<af-Button @click.stop="reload">ReLoad</af-Button>
								</div>
							</div>
						</template>
						<ul class="f-list" v-else>
							<li
								v-for="(item, index) in bankList"
								:key="item.bankCode"
								:class="[
									'l-item',
									{
										'l-item--checked': index === checkedBankIndex
									}
								]"
								@click="changeBank(index)"
							>
								<div class="m-bank-item">
									<div class="m-image-wrapper" v-if="item.bankIconUrl">
										<img :src="item.bankIconUrl" alt="">
									</div>
									<span class="f-text">{{item.bankName}}</span>
									<i class="i-icon-checked" v-if="index === checkedBankIndex"></i>
								</div>
							</li>
						</ul>
					</div>
					<div class="f-error" v-if="isBankCodeError">
						<p>{{bankCodeError}}</p>
					</div>
				</div>
				<div class="f-line-item i-num">
					<AfInputLabel
						v-model="bankNum"
						:clear="clearBankNum"
						:showFocusTips="showFocusTips"
						:focusTips="bankFocusTips"
						:placeholder="bankPlaceholder"
						:hasError="isBankNumError"
					/>
					<div class="f-error" v-if="isBankNumError">
						<p>{{bankNumError}}</p>
					</div>
				</div>
			</div>
		</li>
	</ul>
	<div class="f-line">
		<span class="f-label">Amount({{showCurrency}})</span>
		<div class="f-line-item i-amount">
			<AfInput
				v-model="amount"
				icon="delete"
				:placeholder="amountPlaceholder"
				:error="isAmountError"
				:iconClick="clearAmount"
			/>
			<giftTip />
			<div class="f-error" v-if="isAmountError">
				<p>{{amountError}}</p>
			</div>
		</div>
	</div>
	<div class="f-line f-line--opt">
		<span class="f-label"></span>
		<af-button
			extraType="primary"
			@click="submit"
			:disabled="!submitStatus"
			:loading="loading"
		>{{subText}}</af-button>
	</div>
</div>

</template>

<script>
import {
	mapState,
	mapActions
} from 'vuex';

import 'packages/input';
import 'packages/button';

import 'components/transformInput/inputLabel';
import { showCurrencyOrigin } from 'config/currencyConfig';

import {
	delBankTips
} from '../js/config';
import amountMixin from '../js/amountMixin';
import bankNumMixin from '../js/bankNumMixin';
import bankDataMixin from '../js/bankDataMixin';
import bankCodeMixin from '../js/bankCodeMixin';
import pageMixin from '../js/pageMixin';

import giftTip from './giftTip.vue';

let lastHoverBank;
let delBankIndex;

export default {
	mixins: [
		bankNumMixin,
		amountMixin,
		bankDataMixin,
		bankCodeMixin,
		pageMixin
	],
	components: {
		giftTip
	},
	data() {
		return {
			checkedIndex: '',
			showAddPanel: false,
			delBankTips,
			showDelTips: false,
			showFocusTips: true,
			showCurrency: showCurrencyOrigin,
			delLoading: false
		};
	},
	computed: {
		...mapState('deposit', [
			'bankHistoryList',
			'reqLoading'
		]),
		historyRdCount() {
			const list = this.bankHistoryList || [];
			return list.length;
		},
		isHistoryBank() {
			return this.checkedIndex < this.historyRdCount;
		},
		getDelText() {
			return this.delLoading ? '' : 'Yes';
		}
	},
	methods: {
		...mapActions('deposit', [
			'deleteBank'
		]),
		isCurrent(index) {
			return index === this.checkedIndex;
		},
		changeSelBank(index) {
			this.checkedIndex = index;
			this.showAddPanel = false;
		},
		addBank() {
			this.showAddPanel = true;
			this.checkedIndex = this.historyRdCount;
		},
		handleDel() {
			this.showDelTips = true;
		},
		cancelDel(isDelay) {
			this.showDelTips = false;
		},
		subDel(index) {
			if (this.delLoading) {
				return;
			}

			delBankIndex = index;
			this.delLoading = true;

			// 删除请求
			this.deleteBank({
				id: this.bankHistoryList[index].id,
				type: 'bank'
			})
			.catch(() => {});
		},
		handleMouseMove(event, index) {
			if (index !== lastHoverBank) {
				lastHoverBank = index;
				this.showDelTips = false;
			}
		}
	},
	watch: {
		bankHistoryList(val) {
			if (val &&
				(val.length === this.checkedIndex || delBankIndex === this.checkedIndex)) {
				this.checkedIndex = 0;
				delBankIndex = null;
			}
		},
		reqLoading(val) {
			if (!val) {
				this.delLoading = false;
			}
		}
	},
	mounted() {
		this.checkedIndex = 0;
		delBankIndex = null;
	}
};

</script>
<style lang="less">

@import '../style/bankList.less';
@import '../style/addBank.less';

</style>
