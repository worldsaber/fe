<template>
	<div class="deposit-bank-auth">
		<div class="auth-later"><span @click="request('later')">Later</span></div>
		<h1 class="auth-title">Bank Authorization</h1>
		<p class="auth-message">For your convenience, please finish the verification as soon as possible.</p>
		<div class="auth-action">
		  <af-button class="auth-fail" :autofocus="false" @click.prevent="request('fail')" :loading="failLoading" :disabled="failLoading || completeLoading || laterLoading">{{failLoading ? 'Loading...' : 'Failed to Verify'}}</af-button>
		  <af-button class="auth-complete" :autofocus="false" @click.prevent="request('complete')" :loading="completeLoading" :disabled="failLoading || completeLoading || laterLoading">{{completeLoading ? 'Loading...' : 'Verification Completed'}}</af-button>
		</div>
		<p class="auth-note">Note: Before click here if the verification is unsuccessful,
please close the previous verification page.</p>
	</div>
</template>

<script>
import { mapMutations } from 'vuex';
import * as mutationTypes from 'store/deposit/ng/mutationTypes.js';
import AfButton from 'packages/button';
import { statusToDialog } from '../js/config.js';

export default {
	props: {
		tradeId: {
			type: [Number, String],
			'default': ''
		}
	},
	components: {
		AfButton
	},
	data() {
		return {
			failLoading: false,
			completeLoading: false,
			laterLoading: false
		};
	},
	methods: {
		...mapMutations('deposit', {
			updateDisplayMsg: mutationTypes.UPDATE_DISPLAY_MSG
		}),
		handleLoading(val, type) {
			if (type === 'fail') {
				this.failLoading = val;
			} else if (type === 'complete') {
				this.completeLoading = val;
			} else {
				this.laterLoading = val;
			}
		},
		request(type) {
			this.handleLoading(true, type);
			fetch('/pocket/v1/bankTrades/bankTrade/' + this.tradeId + '/additional', {
				headers: {
					'content-type': 'application/json'
				},
				method: 'POST',
				body: JSON.stringify({
					tradeId: this.tradeId,
					type: 7
				})
			}).then(res => {
				this.handleLoading(false, type);
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
					this.$dialog.alert(res.message, ['OK']);
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
					this.$dialog();
					this.$dialog.alert(res.message || 'We are unable to accept your payment at this time. Please check your payment information and try again later.', ['OK']);
				}
			}).catch(e => {
				this.handleLoading(false, type);
				this.$dialog();
				if (!navigator.onLine) {
					dialog.alert('No internet connection, try again.');
				} else {
					dialog.alert('Sorry，something went wrong. Please try again later.');
				}
			});
		}
	}
};
</script>

<style lang="less">
@import "~base/styles/variable.less";

@authNoteGray: #9ea0ad;
.deposit-bank-auth {
	&.m-dialog {
		width: 90%!important;
	}
	&.es-dialog .es-dialog-body .es-dialog-main {
		padding: 0 10/@rem;
	}
	.auth-later {
		margin-bottom: 30/@rem;
		text-align: right;
		span {
			color: @green;
			font-size: 16px;
			line-height: 19px;
		}
	}
	.auth-title {
  		font-size: 20px;
  		font-weight: bold;
  		text-align: center;
		line-height: 1.4;
  		color: @dark;
	}
	.auth-message {
		font-size: 16px;
  		line-height: 1.5;
  		text-align: center;
  		color: @dark;
		padding: 16.5/@rem 0;
	}
	.auth-action {
		display: flex;
		align-items: center;
		justify-content: center;
		.auth-fail {
			flex: 1 1 auto;
			height: 48/@rem;
			width: 131/@rem;
			margin-right: 10/@rem;
			border: 1px solid @green;
			font-size: 14px;
  			color: @green;
			background-color: @white;
		}
		.auth-complete {
			flex: 1 1 auto;
			height: 48/@rem;
			width: 179/@rem;
			border: 1px solid @green;
			font-size: 14px;
  			color: @white;
			background-color: @green;
		}
	}
	.auth-note {
		margin-top: 30/@rem;
		margin-bottom: 71/@rem;
		padding: 0 6.5/@rem;
		font-size: 12px;
		color: @authNoteGray
	}
}
</style>
