<template>
	<form class="withdraw-code-verify">
		<p class="code-message">We've sent you a 6-digit code to +{{countryCode}} {{phone}}.</p>
		<af-input class="code" v-model="code" placeholder="Verification Code" :iconClick="clearcode" :error="submitErr"></af-input>
		<div class="error-msg">{{errText}}</div>
		<div class="action-wrap">
			<span v-if="!loadingCode" class="send-again" @click="sendSms">Send Again</span>
			<span v-if="!loadingCode">{{(timer===0 ? '':' (' + timer + 's)')}}</span>
			<i v-else class="af-icon-loading"></i>
		</div>
		<af-button class="submit" :autofocus="false" @click.prevent="submit" :disabled="submitDisabled" :loading="submitLoading">{{submitLoading ? 'Loading...' : 'Complete Withdrawal'}}</af-button>
	</form>
</template>

<script>
import AfButton from 'packages/button';
import { AfInput } from 'components/input';
import cookie from 'storage/cookie';
import bridge from './bridge.vue';
import { statusToDialog } from '../js/config.js';

export default {
	props: {
		extraData: {
			type: Object,
			'default': () => ({})
		}
	},
	components: {
		AfInput,
		AfButton
	},
	data() {
		return {
			countryCode: window.countryCode,
			phone: cookie('phone'),
			code: '',
			submitErr: false,
			submitLoading: false,
			loadingCode: false,
			errText: '',
			timer: 0,
			timerId: '',
			sendCodeDisabled: false
		};
	},
	created() {
		console.log(this);
		this.loadingCode = false;
		this.sendCodeDisabled = true;
		this.runTimer();
	},
	methods: {
		submit() {
			const params = {
				sms: this.code,
				type: 1,
				tradeId: this.extraData.tradeId
			};
			this.submitLoading = true;

			fetch('/pocket/v1/bankTrades/bankTrade/' + this.extraData.tradeId + '/additional', {
				headers: {
					'content-type': 'application/json'
				},
				method: 'POST',
				body: JSON.stringify(params)
			}).then(res => {
				this.submitLoading = false;
				return res.json();
			}).then(res => {
				if (res.login === false) {
					this.$popupLogin.show();
					return;
				}
				const { bizCode, data } = res;
				if (bizCode === 10000) {
					if (data.status === 20) {
						this.$emit('trigger', 'goStep', {
							step: 'success'
						});
					} else if (data.status === 30) {
						const options = statusToDialog[data.status];
						options.dialog.content = res.message ? res.message : options.dialog.content;
						this.$emit('trigger', 'dialog', {
							options
						});
					} else {
						this.$emit('trigger', 'dialog', {
							options: statusToDialog[data.status]
						});
					}
				} else if (bizCode === 11000) { // 同失败
					const status = 30;
					const options = statusToDialog[status];
					options.dialog.content = res.message ? res.message : options.dialog.content;
					this.$emit('trigger', 'dialog', {
						options
					});
				} else if (bizCode === 61100) {
					this.$dialog();
					this.$dialog.alert('The amount has exceeded your available balance, please check and confirm again.', ['OK']);
				} else {
					this.errText = res.message;
					this.submitErr = true;
				}
			}).catch(e => {
				console.log(e);
				this.$dialog();
				this.$dialog.alert('No internet connection, try again.', ['OK']);
			});
		},
		clearcode() {
			this.code = '';
		},
		sendSms() {
			if (this.sendCodeDisabled) {
				return;
			}
			this.loadingCode = true;
			this.sendCodeDisabled = true;
			const params = {
				phone: cookie('phone'),
				bizType: 'WITHDRAW_CONFIRM'
			};
			fetch('/patron/verifyCode/sms', {
				method: 'POST',
				body: params
			}).then(res => {
				this.loadingCode = false;
				return res.json();
			}).then(res => {
				if (res.login === false) {
					this.$dialog();
					this.$popupLogin.show();
					return;
				}
				const { bizCode } = res;
				if (bizCode === 10000) {
					this.runTimer();
				} else if (bizCode === 11705) { // 超三次
					clearInterval(this.timerId);
					this.$emit('trigger', 'dialog', {
						options: {
							title: 'Verify Identity',
							content: bridge,
							type: 'sms',
							component: true
						}
					});
				} else {
					clearInterval(this.timerId);
					this.sendCodeDisabled = false;
					this.$dialog();
					this.$dialog.alert(res.message, ['OK']);
				}
			}).catch(e => {
				console.log(e);
				clearInterval(this.timerId);
				this.sendCodeDisabled = false;
				this.$dialog();
				this.$dialog.alert('No internet connection, try again.', ['OK']);
			});
		},
		runTimer() {
			this.timer = 60;
			this.timerId = setInterval(() => {
				this.timer--;
				if (this.timer === 0) {
					clearInterval(this.timerId);
					this.sendCodeDisabled = false;
				}
			}, 1000);
		},
	},
	computed: {
		submitDisabled() {
			return this.code === '' || this.submitErr;
		}
	},
	watch: {
		code(val) {
			this.code = val.replace(/[^0-9.]/g, '');
			this.errText = '';
			this.submitErr = false;
		}
	}
};
</script>

<style lang="less">
@import "~base/styles/variable.less";
@import "base/styles/icon.less";
.withdraw-code-verify {
	.code-message {
		margin-top: 8/@rem;
		font-size: 16/@rem;
		line-height: 1.5;
		text-align: left;
		color: @dark;
	}
	.code {
		margin-top: 16/@rem;
		width: 100%;
		&.m-input-wap-wrapper {
			.m-input-wap {
				height: 44/@rem;
			}
		}
	}
	.error-msg {
		min-height: 12px;
		line-height: 12px;
		font-size: 10px;
		text-align: left;
		color: @red;
		margin-top: 2/@rem;
		margin-bottom: 15/@rem;
	}
	.action-wrap{
		margin-bottom: 38/@rem;
		text-align: center;
		span {
			font-size: 16px;
			line-height: 1;
		}
		.send-again {
			color: @green;
		}
		.af-icon-loading:before {
			content: "\e648";
			.iconfont();
		}
		.af-icon-loading {
			display: inline-block;
			animation: loading-rotate 2s linear infinite;
		}
	}
	.submit {
		width: 100%;
		height: 42/@rem;
		margin-bottom: 16/@rem;
		background-color: @green;
		text-align: center;
		border: none;
	}
}
</style>
