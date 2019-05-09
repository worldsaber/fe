<template lang="html">
	<div class="m-bank">
		<div class="f-line">
			<span class="f-label">Payment Info</span>
			<div class="f-line-item i-bank">
				<div
					:class="[
						'f-list-wrapper',
						{
							'on': showBankList,
						}
					]"
					@click.stop="toggleBankList"
				>
					<div class="f-content">
						<span class="f-btn">{{channelShowName}}</span>
						<div class="bank-switch">
							<span>Switch</span>
							<i :class="[
								'i-icon--more',
								{
									'on': showBankList
								}
							]"></i>
						</div>
					</div>
					<template v-if="fetchingBanks">
						<div class="m-error-wrapper">
							<div>
								<i class="m-icon-loading"></i>
								<span class="m-text-msg">Loading...</span>
							</div>
						</div>
					</template>
					<template v-else-if="bankLoadError">
						<div class="m-error-wrapper">
							<div>
								<span class="m-error-msg">Failed to load data.<br/>Please refresh the page.</span>
								<af-Button extraType="text" @click.stop="reload">Refresh</af-Button>
							</div>
						</div>
					</template>
					<ul class="f-list" v-else>
						<li
							v-for="(item, index) in bankList"
							:key="item.channelShowName"
							:class="[
								'l-item',
								'f-flex',
								{
									'l-item--checked': index === currentBankIndex
								}
							]"
							@click="changeBank(index)"
						>
							<i class="i-check"></i>
							<span class="f-text f-flex-item">{{item.channelShowName}}</span>
							<div class="m-image-wrapper">
								<img
									class="bank-static-icon"
									v-if="item.channelIconUrl"
									:src="item.channelIconUrl" />
								<img
									v-else
									:src="defaultIcon" />
							</div>
						</li>
					</ul>
				</div>
			</div>
			<div class="f-line-item i-code" v-if="needVCode">
				<AfInputLabel
					v-model="vCode"
					:clear="clearVCode"
					:showFocusTips="showFocusTips"
					:focusTips="vCodeFocusTips"
					:placeholder="vCodePlaceholder"
					:hasError="isVCodeErr"
					:icon="''" />
				<div class="f-tips">
					<i
						class="m-icon-tips"
						@click="showVCodeTips"
					></i>
					<div :class="[
							'm-pop-tips',
							{
								'on': showVCTips
							}
						]"
					>
						<i class="m-icon-close" @click="hideVCodeTips"></i>
						<p>{{vCodeDesc}}</p>
					</div>
				</div>
				<div class="f-error" v-if="isVCodeErr">
					<p>{{vCodeErr}}</p>
				</div>
			</div>
			<!--  :clear="clearPhone" -->
			<div class="f-line-item i-num">
				<AfInputLabel
					v-model="phoneNo"
					:disabled="true"
					icon=""
					:showFocusTips="showFocusTips"
					:focusTips="phoneFocusTips"
					:placeholder="phonePlaceholder"
					:inputLable="countryCode"
					@focus="chgPhone"
					:hasError="isPhoneErr" />
				<div class="f-error" v-if="isPhoneErr">
					<p>{{phoneErr}}</p>
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
					@blur="blurAmount"
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
import 'packages/input';
import 'packages/button/button.vue';
import 'components/transformInput/inputLabel';
import { showCurrencyOrigin } from 'config/currencyConfig';
import defaultIcon from 'images/bankIcon.png';

import amountMixin from '../js/amountMixin';
import bankDataMixin from '../js/bankDataMixin';
import phoneMixin from '../js/phoneMixin';
import vCodeMixin from '../js/vCodeMixin';
import pageMixin from '../js/pageMixin';
import bankMixin from '../js/bankMixin';
import {
	vCodeDesc
} from '../js/config';

import giftTip from './giftTip.vue';

export default {
	mixins: [
		amountMixin,
		bankDataMixin,
		phoneMixin,
		vCodeMixin,
		pageMixin,
		bankMixin
	],
	components: {
		giftTip
	},
	data() {
		return {
			showFocusTips: true,
			showCurrency: showCurrencyOrigin,
			vCodeDesc,
			defaultIcon
		};
	}
};
</script>

<style lang="less">
@import '../style/addBank.less';
</style>
