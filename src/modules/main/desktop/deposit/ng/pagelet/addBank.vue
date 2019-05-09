<template lang="html">
	<div class="m-bank">
		<div class="f-line">
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
import 'packages/button/button.vue';
import 'components/transformInput/inputLabel';
import { showCurrencyOrigin } from 'config/currencyConfig';

import bankNumMixin from '../js/bankNumMixin';
import amountMixin from '../js/amountMixin';
import bankDataMixin from '../js/bankDataMixin';
import bankCodeMixin from '../js/bankCodeMixin';
import pageMixin from '../js/pageMixin';

import giftTip from './giftTip.vue';

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
			showFocusTips: true,
			showCurrency: showCurrencyOrigin
		};
	}
};
</script>

<style lang="less">
@import '../style/addBank.less';
</style>
