<template lang="html">

<div class="m-card">
	<div class="f-line">
		<span class="f-label">Card Info</span>
		<div class="f-line-item i-card">
			<AfInputLabel
				v-model="showCardNum"
				:clear="clearCard"
				:showFocusTips="showFocusTips"
				:focusTips="cardFocusTips"
				:placeholder="cardPlaceholder"
				:hasError="isCardError" />
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
				:hasError="isDateError" />
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
				:hasError="isCvvError" />
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
			type="primary"
			:disabled="!submitStatus"
			@click="submit"
			:loading="loading"
		>{{subText}}</af-button>
	</div>
</div>

</template>

<script>
import 'packages/input';
import 'packages/button';
import 'components/transformInput/inputLabel';
import 'components/popOver';
import { showCurrencyOrigin } from 'config/currencyConfig';

import amountMixin from '../js/amountMixin';
import cardNumMixin from '../js/cardNumMixin';
import cvvMixin from '../js/cvvMixin';
import dateMixin from '../js/dateMixin';
import cardDataMixin from '../js/cardDataMixin';
import pageMixin from '../js/pageMixin';
import giftTip from './giftTip.vue';

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
			showCurrency: showCurrencyOrigin
		};
	}
};
</script>
<style lang="less">

@import '../style/addCard.less';

</style>
