<template>
	<form class="deposit-account-verify">
		<div class="account-detail">
			<img :src="extraData.bankIconUrl" class="bank-icon">
			<span class="bank-num">{{extraData.bankAccNum}}</span>
		</div>
		<p class="account-message">Your account has been registered. We've sent another token to your phone to complete the payment.</p>
		<af-input class="account" type="tel" v-model="account" placeholder="Enter Token" :toggleShowText="true" icon="delete" :iconClick="clearAccount"></af-input>
		<div class="error-msg">{{errText}}</div>
		<af-button class="submit" :autofocus="false" @click.prevent="submit" :disabled="submitDisabled" :loading="submitLoading" :error="submitErr">{{submitLoading ? 'Loading...' : 'Continue'}}</af-button>
	</form>
</template>

<script>
import { mapMutations } from 'vuex';
import * as mutationTypes from 'store/deposit/ng/mutationTypes.js';
import dialog from 'components/dialog';
import AfButton from 'packages/button';
import { AfInput } from 'components/input';
import { statusToDialog } from '../js/config.js';

export default {
	props: {
		tradeId: {
			type: [Number, String],
			'default': ''
		},
		extraData: {
			type: Object,
			'default': () => ({
				bankIconUrl: '',
				bankAccNum: ''
			})
		}
	},
	components: {
		AfInput,
		AfButton
	},
	data() {
		return {
			account: '',
			submitErr: false,
			submitLoading: false,
			errText: ''
		};
	},
	methods: {
		...mapMutations('deposit', {
			updateDisplayMsg: mutationTypes.UPDATE_DISPLAY_MSG
		}),
		clearAccount() {
			this.account = '';
		},
		submit() {
			this.submitLoading = true;
			const params = {
				tradeId: this.tradeId,
				type: 4,
				otp: this.account
			};
			fetch('/pocket/v1/bankTrades/bankTrade/' + this.tradeId + '/additional', {
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
					this.$dialog();
					this.$popupLogin.show();
					return;
				}
				const { bizCode, data } = res;
				if (bizCode === 10000) {
					if (data.status === 20) {
						console.log('deposit success');
						this.$emit('trigger', 'goStep', {
							step: 'success'
						});
					} else if (data.status === 87) {
						location.href = data.jumpUrl;
						// this.$emit('trigger', 'dialog', {
						// 	options: statusToDialog[data.status],
						// 	tradeId: this.tradeId
						// });
					} else if (data.status === 30) {
						const options = statusToDialog[data.status];
						options.dialog.content = res.message ? res.message : options.dialog.content;
						this.$emit('trigger', 'dialog', {
							options,
							tradeId: this.tradeId
						});
					} else {
						if (data.displayMsg) {
							this.updateDisplayMsg(data.displayMsg);
						}
						this.$emit('trigger', 'dialog', {
							options: statusToDialog[data.status],
							tradeId: this.tradeId
						});
					}
				} else if (bizCode === 62100) { // 超过后台配置日交易限额，使用后台错误信息
					this.$dialog();
					dialog.alert(res.message, ['OK']);
				} else if (bizCode === 11000 || bizCode === 19000) {
					const status = 30; // 11000同样提示失败
					const options = statusToDialog[status];
					options.dialog.content = res.message ? res.message : options.dialog.content;
					this.$emit('trigger', 'dialog', {
						options,
						tradeId: this.tradeId
					});
				} else if (bizCode === 65001) { // 所选资产不存在
					this.$emit('trigger', 'refresh', res.message);
				} else {
					this.submitErr = true;
					this.errText = res.message || 'We are unable to accept your payment at this time. Please check your payment information and try again later.';
				}
			}).catch(e => {
				this.submitLoading = false;
				this.$dialog();
				if (!navigator.onLine) {
					dialog.alert('No internet connection, try again.');
				} else {
					dialog.alert('Sorry，something went wrong. Please try again later.');
				}
			});
		}
	},
	computed: {
		submitDisabled() {
			return this.account === '' || this.submitErr;
		}
	},
	watch: {
		account(val) {
			this.account = val.replace(/[^0-9]/g, '');
			this.errText = '';
			this.submitErr = false;
		}
	}
};
</script>

<style lang="less">
@import "~base/styles/variable.less";
.deposit-account-verify {
	.account-detail {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 17/@rem;
		margin-bottom: 12/@rem;
		.bank-icon {
			height: 20px;
		}
	}
	.account-message {
		font-size: 16/@rem;
		line-height: 1.5;
		text-align: left;
		color: @dark;
	}
	.account {
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
	.submit {
		width: 100%;
		height: 42/@rem;
		margin-bottom: 18/@rem;
		background-color: @green;
		text-align: center;
		border: none;
	}
}
</style>
