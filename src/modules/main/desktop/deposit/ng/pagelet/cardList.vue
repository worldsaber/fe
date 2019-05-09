<template lang="html">

<div class="m-card-list">
	<ul class="f-title">
		<li class="l-col1">Card Number</li>
		<li class="l-col2">Expiry</li>
	</ul>
	<ul class="f-wrapper">
		<li
			v-for="(item, index) in cardHistoryList"
			:key="item.id"
			:class="[
				'l-item',
				{
					'l-item-checked': isCurrent(index)
				}
			]"
			@click="changeCard(index)"
			@mousemove="handleMouseMove($event, index)"
		>
			<div class="l-col1">
				<i class="i-icon-check"></i>
				<div class="m-image-wrapper" v-if="item.bankIconUrl">
					<img :src="item.bankIconUrl" alt="" />
				</div>
				<span class="f-text">{{item.showCardName}}</span>
				<span class="f-text">{{item.cardNumber}}</span>
			</div>

			<div class="l-col2">
				<span class="f-text">{{item.showExpire}}</span>
			</div>

			<div class="l-col3">
				<div class="f-line-item i-cvv f-line--pos" v-if="isCurrent(index)">
					<AfInputLabel
						v-model="cvvItem"
						:clear="clearCvvItem"
						:showFocusTips="showFocusTips"
						:focusTips="cvvFocusTips"
						:placeholder="cvvPlaceholder"
						:hasError="isCvvItemError"
					/>
					<div class="f-tips">
						<i class="m-icon-tips"></i>
						<PopOver
							position="top"
							:isCenter="false"
							:arrowCenter="false"
							:content="cvvTips"></PopOver>
					</div>
					<div class="f-error" v-if="isCvvItemError">
						<p>{{cvvItemError}}</p>
					</div>
				</div>
			</div>
			<div class="l-col4 f-del-wrapper">
				<span
					class="f-text-del"
					@click.stop="handleDel"
				>Delete</span>
				<div
					class="f-pop-wrapper"
					v-show="showDelTips"
				>
					<span>{{delCardTips}}</span>
					<div class="f-line">
						<af-button
							extraType="text"
							@click.stop="cancelDel"
						>No</af-button>
						<af-button
							extraType="primary"
							:loading="delLoading"
							@click.stop="subDel(index)"
						>{{getDelText}}</af-button>
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
				  'l-item-checked': !isHistoryCard
			  }
			]"
			@click="addCard"
			@mousemove="handleMouseMove($event)"
		>
			<div class="l-col1">
				<i class="i-icon-check"></i>
				<span class="f-text">Pay with a new card</span>
			</div>

			<div class="f-line" v-if="showAddPanel">
				<span class="f-label">Card Info</span>
				<div class="f-line-item i-card">
					<AfInputLabel
						v-model="showCardNum"
						:clear="clearCard"
						:showFocusTips="showFocusTips"
						:focusTips="cardFocusTips"
						:placeholder="cardPlaceholder"
						:hasError="isCardError"
					/>
					<div class="f-error" v-if="isCardError">
						<p>{{cardError}}</p>
					</div>
				</div>

				<div class="f-line-item i-date">
					<AfInputLabel
						v-model="date"
						:clear="clearDate"
						:showFocusTips="showFocusTips"
						:focusTips="dateFocusTips"
						:placeholder="datePlaceholder"
						:hasError="isDateError"
					/>
					<div class="f-error" v-if="isDateError">
						<p>{{dateError}}</p>
					</div>
				</div>

				<div class="f-line-item i-cvv">
					<AfInputLabel
						v-model="cvv"
						:clear="clearCvv"
						:showFocusTips="showFocusTips"
						:focusTips="cvvFocusTips"
						:placeholder="cvvPlaceholder"
						:hasError="isCvvError"
					/>
					<div class="f-tips">
						<i class="m-icon-tips"></i>
						<PopOver
							position="top"
							:isCenter="false"
							:arrowCenter="false"
							:content="cvvTips"></PopOver>
					</div>
					<div class="f-error" v-if="isCvvError">
						<p>{{cvvError}}</p>
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
			:disabled="!submitStatus"
			@click="submit"
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

import {
	EventBus
} from 'kernel/js/eventBus.js';

import 'packages/input';
import 'packages/button';

import 'components/transformInput/inputLabel';
import 'components/popOver';
import { showCurrencyOrigin } from 'config/currencyConfig';

// import {
// 	validateCvv
// } from '../js/commonFun';
import {
	delCardTips
} from '../js/config';
import amountMixin from '../js/amountMixin';
import cardNumMixin from '../js/cardNumMixin';
import cvvMixin from '../js/cvvMixin';
import dateMixin from '../js/dateMixin';
import cardDataMixin from '../js/cardDataMixin';
import pageMixin from '../js/pageMixin';
import giftTip from './giftTip.vue';

let lastHoverBank;
let delBankIndex;

export default {
	mixins: [
		amountMixin,
		cardNumMixin,
		cvvMixin,
		dateMixin,
		cardDataMixin,
		pageMixin
	],
	components: {
		giftTip
	},
	data() {
		return {
			checkedIndex: '',
			showAddPanel: false,
			cvvItem: '',
			cvvItemError: '',
			delCardTips,
			showDelTips: false,
			showCurrency: showCurrencyOrigin,
			delLoading: false
		};
	},
	computed: {
		...mapState('deposit', [
			'cardHistoryList',
			'reqLoading'
		]),
		historyRdCount() {
			const list = this.cardHistoryList || [];
			return list.length;
		},
		isCvvItemError() {
			return !!this.cvvItemError || false;
		},
		isHistoryCard() {
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
		changeCard(index) {
			this.checkedIndex = index;
			this.showAddPanel = false;
		},
		addCard() {
			this.showAddPanel = true;
			this.checkedIndex = this.historyRdCount;
		},
		clearCvvItem() {
			this.CvvItemError = '';
			this.cvvItem = '';
		},
		handleDel() {
			this.showDelTips = true;
		},
		cancelDel() {
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
				id: this.cardHistoryList[index].id,
				type: 'card'
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
	mounted() {
		this.checkedIndex = 0;
		delBankIndex = null;

		EventBus.$on('clearCvv', () => {
			this.clearCvvItem();
		});
	},
	watch: {
		cvvItem(val) {
			const temp = val.replace(/[^0-9]/g, '');
			this.cvvItem = temp.length > 3 ? temp.slice(0, 3) : temp;
			this.cvvItemError = '';
			// this.cvvItemError = validateCvv(temp) || '';
		},
		checkedIndex(val) {
			this.clearCvvItem();
			this.clearCvv();
			this.clearDate();
			this.clearCard();
		},
		cardHistoryList(val) {
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
	}
};

</script>
<style lang="less">

@import '../style/cardList.less';
@import '../style/addCard.less';

</style>
