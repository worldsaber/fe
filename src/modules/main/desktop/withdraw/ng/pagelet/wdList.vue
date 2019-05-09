<template lang="html">

<div class="m-bank-list" id="j_ngBank">
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
					'l-item-checked': historyRdCount === checkedIndex
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
				<span class="f-label">Bank Account Info</span>
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
		...mapState('withdraw', [
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
		...mapActions('withdraw', [
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
@import 'base/style/variable.less';
@import '../style/addBankMixin.less';
@import '../style/delPopMixin.less';

.m-bank-list {
	padding: 28px 0 40px;
	box-sizing: border-box;

	.f-title {
		height: 22px;
		line-height: 22px;
		font-size: 0;
		color: @dark;
		padding: 0 9px;
		box-sizing: border-box;

		.l-col1 {
			padding-left: 36px;
			box-sizing: border-box;
		}

		.l-col1,
		.l-col2 {
			font-size: 14px;
			font-weight: 500;
		}
	}

	.l-col1,
	.l-col2,
	.l-col3{
		display: inline-block;
		vertical-align: top;
	}

	.l-col1 {
		width: 274px;
	}

	.l-col2 {
		width: 190px;
	}

	.l-col3 {
		display: none;
	}

	.l-item {
		padding: 0 9px;
		box-sizing: border-box;
		font-size: 0;
		color: @dark;

		&:hover {
			background-color: @lighterGray;

			.l-col3 {
				display: inline-block;
			}

			.f-content {
				background: @white;
			}
		}

		.l-col1,
		.l-col2,
		.l-col3 {
			height: 46px;
			padding: 13px 0;
			box-sizing: border-box;
		}

		.m-image-wrapper {
			display: inline-block;
			vertical-align: top;
			width: 30px;
			height: 19px;
			margin-right: 14px;

			> img {
				width: 100%;
				height: 100%;
			}
		}

		.f-text {
			line-height: 20px;
			font-size: 14px;
			font-weight: bold;

			&:first-of-type {
				margin-right: 5px;
			}
		}

		.l-col3 .m-fix-input {
			margin-top: 3px;
			width: 80px;
			background: @white;
			display: inline-block;

			.m-input {
				width: 100%;
			}
		}

		.f-tips {
			margin-left: 10px;
		}

		.f-line {
			margin-top: -2px;
		}
	}

	.i-icon-check {
		display: inline-block;
		vertical-align: top;
		margin-top: 2px;
		margin-right: 20px;
		cursor: pointer;

		&:before {
			content: '';
			display: inline-block;
			width: 14px;
			height: 14px;
			border: 1px solid @grayBorder;
			border-radius: 50%;
		}
	}

	.l-item-checked {
		background-color: @fogGray;

		.f-content {
			background: @white;
		}

		.m-fix-input {
			background-color: @white;
		}
		.i-icon-check {
			.m-icon-success-bg();
			&:before {
				border: none;
				line-height: 1;
				font-size: 18px;
			}

			color: @green;
		}

		&.l-item-fix {
			padding-bottom: 28px;
			box-sizing: border-box;
			font-size: 16px;
		}
	}

	.delPop();
	.addBank();

	.f-list {
		width: 540px;
	}

	.f-line {
		.f-label {
			width: 184px;
		}
	}

	&>.f-line {
		padding-left: 12px;

		&:first-of-type {
			margin-top: 16px;
		}
	}

	.i-amount {
		.m-input-wrapper {
			width: 170px;
		}
	}
}


</style>
