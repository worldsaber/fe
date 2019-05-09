<template lang="html">
	<div class="m-page m-page--phone">
		<AfHeader
			:backIcon="false"
			:closeIcon="false"
			title="Find Account"/>
		<section class="m-page-main">
			<Tips
				v-if="showTipsError"
				:type="tipsInfo.type || ''"
				:msg="tipsInfo.msg"/>
			<p class="m-text-tips">To reset your password, please confirm your account first.</p>
			<div class="m-page-opt">
				<div class="m-label">
					<span class="m-text-label">Mobile number</span>
				</div>
				<div class="m-opt-wrapper">
					<AfInput
						v-model="phone"
						placeholder="Enter mobile number"
						icon="delete"
						:error="phoneError || isPhoneError"
						@change="validatorPhone"
						:iconClick="clearAllInput">
						<span slot="prepend">{{countryCode}}</span>
					</AfInput>
					<p v-if="showAdjError" class="m-error-tips">{{tipsInfo.msg}}</p>
					<div class="m-btn-wrap">
						<AfButton
							type='primary'
							:disabled="submitStatus"
							:loading="loading"
							@click="goNext"
							>Next</AfButton>
					</div>
				</div>
			</div>
		</section>
	</div>
</template>

<script>
import { fixPhone } from 'base/js/utils';
import 'components/tips/index';
import pageMixins from '../js/mixins';
import phoneValidator from '../js/phoneValidator';

export default {
	name: 'LoginHome',

	mixins: [pageMixins, phoneValidator],

	props: {
		errorInfo: {
			type: Object,
			'default': null
		}
	},

	computed: {
		submitStatus() {
			return !this.isPhoneReady;
		},
		showAdjError() {
			const err = this.errorInfo || {};
			return err.type === 'error' || err.type === '';
		},
		showTipsError() {
			const err = this.tipsInfo || {};
			return err.type === 'info';
		},
		tipsInfo() {
			const errorInfo = this.errorInfo;

			if (errorInfo && errorInfo.msg) {
				return errorInfo;
			}

			return null;
		},
		isPhoneError() {
			const errorInfo = this.errorInfo || {};

			return errorInfo.isPhoneError || false;
		}
	},
	methods: {
		clearAllInput() {
			this.phone = '';
		},
		goNext() {
			if (this.submitStatus) {
				return;
			}

			const phone = this.phone,
				tempPhone = fixPhone(phone);
			if (tempPhone !== phone) {
				this.phone = tempPhone;
			}

			this.$emit('submit', {
				from: 'phone',
				params: {
					phone: this.phone
				}
			});
		},
		handleEnterPress(event) {
			if (event.keyCode && event.keyCode === 13) {
				this.goNext();
			}
		}
	},
	mounted() {
		document.querySelector('.m-page--phone').addEventListener('keyup', e => {
			this.handleEnterPress(e);
		});
	},
	beforeDestory() {
		document.querySelector('.m-page--phone').removeEventListener('keyup', e => {
			this.handleEnterPress(e);
		});
	}
};
</script>

<style lang="less">
@import 'base/style/variable.less';

@import '../style/button.less';
@import '../style/input.less';
@import '../style/error.less';

.m-page--phone {
	.m-header-bar {
		width: 100%;
		padding: 0 30px;
		box-sizing: border-box;
		height: 57px;
		line-height: 57px;
		font-size: 20px;
		color: @dark;
		border-bottom: 1px solid @fogGrayBorder;

		.m-header-bar-title {
			font-size: 20px;
			line-height: 56px;
			text-align: left;
		}
	}

	.m-page-main {
		position: relative;
		text-align: left;
    	padding: 77px 182px;
		box-sizing: border-box;
		background: @lighterGray;
	}

	.m-text-tips {
		font-size: 20px;
		color: @dark;
		line-height: 27px;
		padding-bottom: 35px;
		box-sizing: border-box;
	}

	.m-page-opt {
		.m-label {
			display: inline-block;
			margin-right: 38px;
			vertical-align: top;
		}

		.m-text-label {
			font-size: 20px;
			color: @dark;
			display: inline-block;
			line-height: 27px;
			vertical-align: middle;
		}

		.m-opt-wrapper {
			display: inline-block;
			vertical-align: top;
			position: relative;
		}

		.m-input-wrapper, .m-btn-wrap {
			width: 300px;
		}

		.m-input-wrapper {
			height: 40px;
			font-size: 14px;

			.m-input {
				height: 40px !important;
			}
		}

		.m-btn-wrap {
			margin-top: 44px;
		}
	}

	.m-error-wrap {
		position: absolute;
		top: 25px;

		.m-error {
			margin: 0;
			min-width: 475px;
		}

		.m-icon--info {
			color: @red;
		}

		.m-text-highlight {
			color: @linkBlue;
		}
	}
}
</style>
