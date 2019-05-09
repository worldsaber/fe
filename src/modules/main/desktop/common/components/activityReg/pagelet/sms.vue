<template lang="html">
	<div class="m-pagelet-sms" :style="getPageStyle" id="j_pageSms">
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
						<span>Please send SMS to {{smsNumber}} from {{countryCode}} {{account}} with the verification code below.  </span>
					</p>

					<div class="m-sms-con">{{msgContent}}</div>
				</div>

				<div class="m-error-wrapper" v-if="hasError">
					<p>{{errorInfo.msg}}</p>
				</div>

				<!-- 按钮 -->
				<af-button
					class="m-btn"
					:autofocus="false"
					@click.prevent="handleClick"
					:loading="reqLoading"
				>
					<span>{{btnText}}</span>
				</af-button>
			</div>
		</div>
	</div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import { objType } from 'utils';
import 'packages/button';
import * as mutationTypes from 'store/activityRegister/mutationTypes';

import CommonPop from 'components/popDialog/commonPop';
import { showCurrency } from 'config/currencyConfig';

const defaultImg = require('../image/bg.jpg');

let timerId = null;

let popDialog;

export default {
	name: 'ActivityRegSMS',
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
			'default': `Get ${showCurrency}50 bet for free`
		},
		tips: {
			type: String,
			'default': 'Oops! We\'re sorry that we can only send you the verification code 3 times within 24 hours'
		},
		hasBack: {
			type: Boolean,
			'default': true
		},
		backText: {
			type: String,
			'default': 'Back'
		},
		bgImg: {
			type: String,
			'default': ''
		}
	},
	data() {
		return {
			bgImage: objType(this.bgImg) === 'null' ? '' : this.bgImg || defaultImg,
			hasError: false
		};
	},
	computed: {
		...mapState('activityRegister', [
			'countryCode',
			'account',
			'smsNumber',
			'msgContent',
			'reqLoading',
			'errorInfo'
		]),
		getPageStyle() {
			// if (this.bgImage) {
			// 	return {
			// 		background: `url(${this.bgImage}) no-repeat`
			// 	};
			// }
			return '';
		}
	},
	watch: {
		errorInfo(val) {
			if (val) {
				if (val.type === 'dialog') {
					this.$dialog();

					popDialog = this.$dialog({
						title: null,
						contentData: {
							title: val.title || '',
							msg: val.msg || ''
						},
						content: CommonPop,
						button: []
					}).onBtnClick(btnType => {
						popDialog && popDialog.close();
						popDialog = null;

						if (val.moduleName) {
							this.chgModule(val.moduleName);
						}
						return false;
					});
				}

				this.hasError = val.type === 'inline' || val.type === 'inline_toast';
			} else {
				this.hasError = false;
			}
		},

		hasError(val) {
			const errorInfo = this.errorInfo || {};

			if (timerId) {
				clearTimeout(timerId);
				timerId = null;
			}

			if (val && errorInfo.type === 'inline' && errorInfo.moduleName) {
				timerId = setTimeout(() => {
					this.chgModule(errorInfo.moduleName);
				}, 2000);
				return;
			}

			if (val && errorInfo.type === 'inline_toast') {
				timerId = setTimeout(() => {
					this.hasError = false;
				}, 5000);
			}
		}
	},
	methods: {
		...mapMutations('activityRegister', {
			chgModule: mutationTypes.UPDATE_NEXT_PAGE
		}),
		...mapActions('activityRegister', [
			'verfiySms'
		]),
		handleBack() {
			this.chgModule('index');
		},
		handleClick() {
			this.verfiySms().catch(err => {}); // eslint-disable-line
		},
		handleEnterPress(event) {
			if (event.keyCode && event.keyCode === 13) {
				this.handleClick();
			}
		}
	},
	mounted() {
		this.timer && this.startTimer();
		document.querySelector('#j_pageSms').addEventListener('keyup', e => {
			this.handleEnterPress(e);
		});
	},
	beforeDestory() {
		document.querySelector('#j_pageSms').removeEventListener('keyup', e => {
			this.handleEnterPress(e);
		});
	}
};
</script>

<style lang="less">
@import 'base/style/variable.less';
@import 'base/style/icon.less';
@import 'components/login/style/buttonMixin.less';
@import '../style/pageBack.less';
@import '../style/reset.less';

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
		height: 20px;
		line-height: 20px;
		font-size: 12px;
		color: @red;
		padding-top: 5px;
		box-sizing: border-box;
	}
}
</style>
