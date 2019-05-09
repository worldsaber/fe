<template lang="html">
	<div class="m-pagelet-sms">
		<div class="m-pagelet">
			<!-- back banner -->
			<div class="m-page-back" v-if="hasBack">
				<span @click="handleBack"><i class="m-icon-back"></i>{{backText}}</span>
			</div>

			<div class="m-main">
				<!-- site log -->
				<div class="m-logo-wrapper" v-if="showLogo">
					<i class="m-icon-logo"></i>
				</div>

				<!-- page title -->
				<h3 class="m-title" v-if="title">{{title}}</h3>

				<!-- page content -->
				<div class="m-content">
					<p>
						<span v-html="tips"></span>
						<span>Please send SMS to {{smsNumber}} from +{{countryCode}} {{account}} with the verification code below.  </span>
					</p>

					<div class="m-sms-con">{{msgContent}}</div>
				</div>
				<div class="m-error-wrapper" v-if="pageError">
					<p>{{pageError}}</p>
				</div>

				<!-- 按钮 -->
				<af-button
					class="m-btn"
					:autofocus="false"
					@click.prevent="handleClick"
					:loading="isLoading"
				>
					<span>{{btnText}}</span>
				</af-button>
			</div>
		</div>
	</div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import 'packages/button';

let timerId = null;

export default {
	name: 'RegisterSms',
	props: {
		showLogo: {
			type: Boolean,
			'default': true
		},
		title: {
			type: String,
			'default': 'Verify Mobile Number'
		},
		btnText: {
			type: String,
			'default': 'Already Sent'
		},
		tips: {
			type: String,
			'default': 'Oops! We\'re sorry that we can only send you the verification code 3 times within 24 hours.'
		},
		hasBack: {
			type: Boolean,
			'default': true
		},
		backText: {
			type: String,
			'default': 'Back'
		}
	},
	data() {
		return {
			countryCode: window.countryCode,
			isLoading: false,
			pageError: ''
		};
	},
	computed: {
		...mapState('registerVerify', [
			'account',
			'smsNumber',
			'msgContent'
		])
	},
	methods: {
		...mapActions('registerVerify', [
			'verfiySms',
			'setReferralCode'
		]),
		handleBack() {
			this.$emit('back');
		},
		handleClick() {
			if (timerId) {
				clearTimeout(timerId);
				timerId = null;
			}
			this.isLoading = true;
			return this.verfiySms()
				.then(() => {
					this.setReferralCode();
					this.isLoading = false;
					this.$emit('success');
				})
				.catch(err => {
					this.isLoading = false;
					if (err.moduleName) {
						timerId = setTimeout(() => {
							// 跳转至目标页面
							this.$emit('jumpTo', err.moduleName);
						}, 2000);
					}
					switch (err.type) {
					case 'inline':
						this.pageError = err.msg;
						break;
					case 'inline_toast':
						this.pageError = err.msg;
						timerId = setTimeout(() => {
							this.pageError = '';
						}, 5000);
						break;
					case 'toast':
						return this.$toast(err.msg);
					case 'dialog':
						this.$dialog();
						this.$dialog({
							css: 'errMsg-dialog',
							width: 315,
							title: err.title || '',
							content: err.msg || '',
							button: ['*OK']
						}).onClose(() => {
							if (err.moduleName) {
								// 跳转至目标页面
								this.$emit('jumpTo', err.moduleName);
							}
							return false;
						});
						break;
					case 'invalidToken':
						this.$dialog({
							css: 'errMsg-dialog',
							width: 315,
							title: err.title || '',
							content: err.msg || '',
							button: ['*OK']
						}).onClose(() => {
							if (err.moduleName) {
								// 跳转至目标页面
								this.$emit('jumpTo', err.moduleName);
							} else {
								this.handleBack();
							}
							return false;
						});
						break;
					default:
						break;
					}
				});
		}
	}
};
</script>

<style lang="less">
@import 'base/styles/variable.less';
@import 'base/styles/icon.less';
@import '../style/btn.less';

.m-page-back {
	cursor: pointer;
	width: 100%;
	height: 40/@rem;
	line-height: 16/@rem;
	padding: 12/@rem 10/@rem;
	box-sizing: border-box;
	font-size: 14/@rem;
	color: @dark;
	background: @fogGray;

	.m-icon-back {
		.m-icon-wap-back();
		margin-right: 10/@rem;
	}
}

.m-pagelet-sms {
	height: 100%;

	.m-pagelet {
		position: relative;
		padding-top: 46px;
		box-sizing: border-box;
	}

	.af-button {
		width: 100%;
		height: 48px;
		.button();
		border-radius: 2px;
	}

	.af-button--primary {
		.button--primary();
	}

	.m-page-back {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		width: 100%;

		.m-page-back();
	}

	.m-main {
		padding: 0 30px;
		box-sizing: border-box;
		text-align: center;
	}

	.m-logo-wrapper {
		.m-icon-logo {
			display: inline-block;
			.m-icon-sportbet();

			color: @red;
			&:before {
				font-size: 40px;
			}
		}
	}

	.m-title {
		margin-top: 15px;
		line-height: 17px;
		font-size: 20px;
		font-weight: bold;
		color: @dark;
	}

	.m-content {
		margin-top: 8px;
		font-size: 12px;
		line-height: 16px;
		color: @dark;

		.m-sms-con {
			margin-top: 17px;
			line-height: 33px;
			font-size: 20px;
		}
	}

	.m-btn {
		margin-top: 20px;
		font-size: 16px;
		font-weight: bold;
	}
	.m-error-wrapper {
		min-height: 20px;
		line-height: 20px;
		font-size: 12px;
		color: @red;
		padding-top: 5px;
		box-sizing: border-box;
	}
}
</style>
