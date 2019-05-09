<template lang="html">

<div class="m-dp-pop m-pop--bank">
	<i
		:class="[
			'f-btn',
			{
				'is-loading': isLaterClick,
				'f-btn--disabled': loading
			}
		]"
		@click="seeResult('later')"
	>{{laterText}}</i>
	<h3 class="f-title">Bank Authorization</h3>
	<section>
		<p class="f-tips">For your convenience, please finish the verification as soon as possible.</p>
		<div class="f-line">
			<div class="l-col1">
				<af-button
					extraType="text"
					@click="seeResult('failed')"
					:disabled="isDisabled('failed')"
					:loading="isFailedClick"
				>{{failedText}}</af-button>
				<p class="f-info">Click here if the verification is unsuccessful.</p>
			</div>
			<div class="l-col2">
				<af-button
					extraType="primary"
					@click="seeResult('complate')"
					:disabled="isDisabled('complate')"
					:loading="isComplateClick"
				>{{complateText}}</af-button>
				<p class="f-info">Click here if the verification is successful.</p>
			</div>
		</div>

		<p class="f-line t-note">Note: Before re-verifying please close the previous verification page.</p>
	</section>

</div>

</template>

<script>
import {
	mapActions,
	mapState
} from 'vuex';
import 'packages/button';

export default {
	data() {
		return {
			loading: false,
			clickBtn: 'complate'
		};
	},
	computed: {
		...mapState('deposit', [
			'reqLoading'
		]),
		isComplateClick() {
			return this.loading && this.clickBtn === 'complate';
		},
		isFailedClick() {
			return this.loading && this.clickBtn === 'failed';
		},
		isLaterClick() {
			return this.loading && this.clickBtn === 'later';
		},
		complateText() {
			return this.isComplateClick ? 'Loading...' : 'Verification Completed';
		},
		failedText() {
			return this.isFailedClick ? 'Loading...' : 'Failed to Verify';
		},
		laterText() {
			return this.isLaterClick ? '' : 'Later';
		}
	},
	watch: {
		reqLoading(val) {
			if (!val) {
				this.loading = false;
				this.clickBtn = '';
			}
		}
	},
	methods: {
		...mapActions('deposit', [
			'tradeAddtional'
		]),
		isDisabled(type) {
			return this.loading && this.clickBtn !== type;
		},
		seeResult(type) {
			if (this.loading) {
				return;
			}

			this.clickBtn = type;
			this.loading = true;
			this.tradeAddtional();
		}
	}
};

</script>

<style lang="less">
@import 'base/style/variable.less';
@import 'base/style/icon.less';
@import 'base/style/refreshAnimation.less';
@import '../style/popDialog.less';

.m-pop--bank {

	.f-btn {
		margin: 5px 5px 0;
		text-align: right;
		color: @linkBlue;
		display: inline-block;
		vertical-align: top;
		width: 100%;
		cursor: pointer;

		&.f-btn--disabled {
			cursor: not-allowed;
		}

		&.is-loading {
			.m-icon-loading();
			&:before {
				display: inline-block;
				animation: rotating 2s linear infinite;
			}
		}
	}

	.f-title {
		padding-top: -9px;
	}

	.f-line {
		margin-top: 46px;

		.l-col1,
		.l-col2 {
			display: inline-block;
			vertical-align: top;
			width: 180px;
		}

		.l-col1 {
			margin-right: 57px;
		}

		.f-info {
			margin-top: 11px;
			font-size: 12px;
			line-height: 14px;
		}

		.af-button {
			width: 180px;
		}
	}

	.t-note {
		margin-top: 40px;
		font-size: 12px;
		line-height: 14px;
		color: @darkGray
	}
}
</style>
