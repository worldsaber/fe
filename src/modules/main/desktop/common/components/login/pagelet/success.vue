<template lang="html">
	<div class="m-page m-page--success">
		<AfHeader
			v-if="hasHeader"
			:backIcon="canBack"
			@back="goPrev"
			@close="closePop"/>
		<section class="m-page-main">
			<h3 class="m-icon-success">Registration Successful</h3>
			<div class="m-desc-wrapper">
				<p class="m-t-big">{{sucTips.main}}</p>
				<p class="m-t-min">{{sucTips.desc}}</p>
			</div>
			<div class="m-btn-wrapper">
				<AfButton
					@click="deposit"
				>Go to Deposit {{dpDesc}}</AfButton>
			</div>
		</section>
		<section class="m-page-footer">
			<template v-if="referralCode">
				<div class="m-page-opt">
					<p class="m-text-tips">Referral code</p>
					<p class="m-code m-border">{{referralCode}}</p>

					<div class="m-opt-wrapper">
						<AfButton
						extraType="text"
						@click="goHome"
					>Back<i class="m-icon-arrow-right"></i></AfButton>
					</div>
				</div>
			</template>

			<template v-else>
				<div class="m-page-opt">
					<p class="m-text-tips">Have a referral code?</p>

					<div class="m-opt-wrapper m-border">
						<AfInput
							v-model="code"
							placeholder="Referral Code (OPTIONAL)"
							icon="delete"
							:iconClick="clearAllInput"
							:error="codeError || isCodeError"/>
						<AfButton
							extraType="info"
							@click="apply"
							:loading="loading"
							:disabled="submitStatus"
						>Apply</AfButton>
						<p
							v-if="showError"
							class="m-error-tips"
						>{{showError}}</p>
					</div>
					<div class="m-opt-wrapper">
						<AfButton
						extraType="text"
						@click="goHome"
					>Back<i class="m-icon-arrow-right"></i></AfButton>
					</div>
				</div>
			</template>

			<!-- <template v-if="hasPromotion">
				<div class="m-image-wrapper m-promotion" @click="deposit">
					<img :src="promotionAd.imgUrl" alt="" />
				</div>
			</template> -->
		</section>
	</div>
</template>

<script>
import { userCenterConfig } from 'config/order/userCenterConfig';
import { pagePath } from 'config/pageConfig';
import { getSucTips, getDpFee } from 'config/regConfig';
// import { showCurrency } from 'config/currencyConfig';
import pageMixins from '../js/mixins';
// import codeValidator from '../js/codeValidator';

export default {
	mixins: [pageMixins/* , codeValidator*/],
	props: {
		hasHeader: {
			type: Boolean,
			'default': true
		},
		canBack: {
			type: Boolean,
			'default': false
		},
		errorInfo: {
			type: Object,
			'default': null
		},
		promotionAd: {
			type: Object,
			'default': null
		},
		referralCode: {
			type: String,
			'default': ''
		},
		sucCfg: {
			type: String,
			'default': ''
		}
	},
	data() {
		return {
			code: this.referralCode,
			codeError: false,
			isCodeReady: false,
			sucTips: getSucTips(),
			dpDesc: getDpFee(),
			// showCurrency
		};
	},
	computed: {
		/*
		show error message which not dialoging
		 */
		showError() {
			const err = this.errorInfo || {};
			return err.msg || '';
		},

		// hasPromotion() {
		// 	const promotionAd = this.promotionAd || {};
        //
		// 	return promotionAd.imgUrl;
		// },

		isCodeError() {
			const err = this.errorInfo || {};

			return err.isReferralError || false;
		},

		submitStatus() {
			return !this.isCodeReady;
		}
	},

	watch: {
		code(val) {
			if (val.length) {
				this.isCodeReady = true;
			} else {
				this.isCodeReady = false;
			}
		}
	},

	methods: {
		clearAllInput() {
			this.code = '';
		},
		goPrev() {
			this.code = '';
			this.codeError = false;

			this.$emit('back');
		},
		deposit() {
			location.href = userCenterConfig.Deposit;
		},
		goHome() {
			location.href = pagePath.home;
		},
		apply() {
			if (this.submitStatus) {
				return;
			}

			this.$emit('submit', {
				from: 'referralCode',
				params: {
					code: this.code
				}
			});
		},
		closePop() {
			location.reload();
		},
		handleEnterPress(event) {
			if (event.keyCode && event.keyCode === 13) {
				this.apply();
			}
		}
	},
	mounted() {
		document.querySelector('.m-page--success').addEventListener('keyup', e => {
			this.handleEnterPress(e);
		});

		this.isCodeReady = !!this.code;
	},
	beforeDestory() {
		document.querySelector('.m-page--success').removeEventListener('keyup', e => {
			this.handleEnterPress(e);
		});
	}
};
</script>

<style lang="less">
@import 'base/style/mixin.less';
@import 'base/style/variable.less';
@import 'base/style/icon.less';

@import '../style/button.less';
@import '../style/input.less';
@import '../style/error.less';

.m-page--success {
	.m-header-bar {
		height: 97px;
	}

	.m-page-main {
		height: 242px;

		.m-desc-wrapper {
			margin-top: 35px;
			text-align: center;
			color: @dark;
		}

		.m-t-big {
			font-size: 20px;
			line-height: 21px;
			font-weight: bold;
		}

		.m-t-min {
			font-size: 16px;
			line-height: 21px;
		}

		.m-btn-wrapper {
			margin-top: 25px;
			text-align: center;

			.af-button {
				width: 300px;
				font-weight: bold;
			}
		}
	}

	.m-icon-success {
		line-height: 33px;
		font-size: 30px;
		font-weight: bold;
		text-align: center;
		color: @dark;

		.m-icon-success-bg();

		&:before {
			display: inline-block;
			color: @green;
			font-size: 34px;
			line-height: 34px;
			margin-right: 16px;
			font-size: 32px;
			line-height: 34px;
			font-weight: bold;
			border-radius: 50%;
			vertical-align: top;
		}
	}

	.m-page-footer {
		height: 102px;
		border-top: 1px solid @fogGrayBorder;
		padding-top: 24px;
		box-sizing: border-box;
	}

	.m-page-opt {
		font-size: 0;
		text-align: center;

		> * {
			display: inline-block;
			vertical-align: top;
		}

		.m-text-tips {
			font-size: 14px;
			margin-right: 10px;
			color: @dark;
			line-height: 30px;
		}

		.m-code {
			font-size: 20px;
			line-height: 30px;
			color: @dark;
			text-align: center;
			padding-right: 25px;
			box-sizing: border-box;
		}

		.m-border {
			border-right: 1px solid @fogGrayBorder;

			& + .m-opt-wrapper {
				padding-left: 25px;
    			box-sizing: border-box;
				line-height: 30px;
			}
		}

		.m-opt-wrapper {
			font-size: 0;

			&:nth-of-type(1) {
				position: relative;
				padding-right: 25px;
				box-sizing: border-box;
			}

			&:only-of-type {
				padding-right: none;
			}
		}

		.m-input-wrapper,
		.af-button {
			display: inline-block;
			vertical-align: middle;
		}

		.m-input-wrapper {
			width: 210px !important;
			height: 30px;
			margin-right: 10px;
			background: @white;

			.m-input {
				height: 30px !important;
				font-size: 12px;
			}
		}

		.af-button--info {
			height: 30px;
		    width: 66px;
		    font-size: 12px !important;
			line-height: 30px;
			padding: 0;
		}

		.af-button--text {
			color: @drakBlue;
			text-align: right;
			font-size: 13px !important;
			height: 30px;
    		padding: 0 !important;
			box-sizing: border-box;
		}

		.m-icon-arrow-right {
			.m-icon-arrow--right();
			&:before {
				display: inline-block;
				vertical-align: middle;
				color: @drakBlue;
				margin-left: 5px;
				font-size: 12px;
			}
		}

		.m-error-tips {
			top: 34px !important;
		}

		.af-icon-loading {
			vertical-align: middle !important;
		}
	}

	.m-image-wrapper {
		margin: 0 auto;

		.m-image-wrapper();
		width: 680px;
		height: 84px;
	}

	.m-promotion {
		cursor: pointer;
	}
}
</style>
