<template lang="html">
	<div class="m-bank" id="j_ghBank">
		<div class="f-line m-phone" v-if="showPhone">
			<span class="f-label">Withdraw to</span>
			<div class="f-line-item">{{showPhone}}(mobile)</div>
		</div>
		<div class="f-line m-account">
			<span class="f-label">Account Info</span>
			<div class="f-line-item i-bank">
				<div
					:class="[
						'f-list-wrapper',
						{
							'on': showBankList
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
								<span class="m-error-msg">Failed to load data. <br/>Please refresh the page.</span>
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
			<!-- <div class="f-line-item i-name">
				<AfInputLabel
					v-model="usrName"
					:clear="clearUsrName"
					:showFocusTips="showFocusTips"
					:focusTips="nameFocusTips"
					:placeholder="namePlaceholder"
					:hasError="isNameError"
					@focus="chgName"
				/>
				<div class="f-error" v-if="isNameError">
					<p>{{nameError}}</p>
				</div>
			</div> -->
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
					@blur="checkAmount"
				/>
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
				:loading="wdLoading"
				>{{subText}}</af-button>
		</div>
	</div>
</template>

<script>
import 'packages/input';
import 'packages/button/button.vue';
import 'components/transformInput/inputLabel';
import { showCurrencyOrigin } from 'config/currencyConfig';

import amountMixin from '../js/amountMixin';
import bankDataMixin from '../js/bankDataMixin';
// import nameMixin from '../js/nameMixin';
import bankMixin from '../js/bankMixin';

import {
	modifyPhone
} from '../js/commonFun';

export default {
	mixins: [
		// nameMixin,
		amountMixin,
		bankDataMixin,
		bankMixin
	],
	data() {
		return {
			showFocusTips: true,
			showCurrency: showCurrencyOrigin,
			showPhone: modifyPhone()
		};
	}
};
</script>

<style lang="less">
@import '../style/addBankMixin.less';
.m-bank {
	padding: 14px 0 40px;
	box-sizing: border-box;
	.addBank();

	.m-phone {
		margin-bottom: 20px;

		.f-line-item {
			height: 40px;
			line-height: 40px;
			font-size: 14px;
			font-weight: bold;
			color: @black;
			padding-left: 4px;
			box-sizing: border-box;
		}

		.f-label {
			height: 24px;
			line-height: 24px;
		}
	}

	.m-account {
		margin-bottom: 32px;
	}

	.f-line--opt {
		margin-top: 37px;
	}

	.f-line-item {
		position: relative;

		.f-error {
			position: absolute;
			top: 45px;
			left: 0;
			white-space: nowrap;
		}
	}

	.i-amount {

		.f-error {
			white-space: normal;
			width: 500px;
			line-height: 1.2;
		}
	}
}
</style>
