<template>
<div id="smsSent">
	<div class="smsSent-message">
		<p>Please send an SMS to {{smsNumber}} from +{{countryCode}} {{phone}} with the verification code below</p>
	</div>
	<div class="smsSent-code">
		<p>{{msgContent}}</p>
	</div>
	<div class="smsSent-footer">
		<div class="back-btn" @click="back"><i class="icon-back"/></div>
		<af-button class="smsSent-btn" size="large" :autofocus="true" @click="smsClick" :loading="loading">
			<span>{{loading ? 'Loading' : btnLabel}}</span>
		</af-button>
	</div>
</div>
</template>

<script>
import dialog from 'components/dialog';
import cookie from 'storage/cookie';

export default {
	name: 'smsSent',
	data () {
		return {
			loading: false,
			countryCode: window.countryCode || '254'
		};
	},
	props: {
		phone: {
			type: String,
			'default': ''
		},
		smsNumber: {
			type: String,
			'default': ''
		},
		msgContent: {
			type: String,
			'default': ''
		},
		bizType: {
			type: String,
			'default': 'REGISTER'
		},
		token: {
			type: String,
			'default': ''
		},
		btnLabel: String
	},

	methods: {
		back() {
			this.$emit('goRegist');
		},
		// 验证短信完成注册
		smsClick (e) {
			if (this.loading) {
				return;
			}
			this.loading = true;
			// 如果是注册流程
			fetch('/patron/account/' + this.phone + '/completeBySms', {
				method: 'PUT',
				body: {
					token: this.token
				}
			}).then(res => res.json()).then(res => {
				this.loading = false;
				switch (res.bizCode) {
				case 10000:
					// 跳转到注册完成页面
					cookie('phone', this.phone, {
						path: '/',
						expires: 365
					});
					this.$emit('success', {
						phone: this.phone
					});
					// this.$router.push({
					// 	path: 'success'
					// });
					break;
				case 11800:
						// dialog.alert('We have not received your SMS. Please try again or contact us.', ['OK']);
					dialog({
						css: 'wap-register',
						content: res.message,
						title: 'Certificate validation failure',
						button: ['OK'],
						width: '26rem'
					});
					break;
				case 11810:
					dialog.alert(
						res.message, // 'Your session has timed out. Please try again.',
						['OK'],
						e => {
						// go register page
							this.$emit('goRegist');
						});
					break;
				default:
					dialog.alert(res.message, ['OK']);
					break;
				}
			}).catch(res => {
				console.log(res);
				this.loading = false;
				dialog.toast('No internet connection, try again.');
			});
		}
	}
};
</script>

<style lang="less">
@import "~base/styles/variable.less";
@import "base/styles/icon.less";
#smsSent {
  .smsSent-top {
    .title {
      width: 100%;
      font-size: 22/@rem;
      font-weight: bold;
    }
  }
  .m-input-wap-wrapper--active {
    border: 1px solid #0d9737;
  }
  .smsSent-message {
    margin-top: 16/@rem;
    font-size: 12/@rem;
    line-height: 1.33;
    text-align: center;
	color: @white;
  }

  .smsSent-code {
    margin-top: 28/@rem;
    margin-bottom: 35/@rem;
    font-size: 20/@rem;
    font-weight: bold;
	color: @white;
  }
  .smsSent-footer {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		.back-btn {
			margin-right: 8/@rem;
			flex: 0 0 auto;
			height: 46/@rem;
			line-height: 46/@rem;
			text-align: center;
			width: 46/@rem;
			border: 1px solid @white;
			border-radius: 2/@rem;
			.icon-back {
				.m-icon-wap-back();
				&::before {
					color: @white;
				}
			}
		}
    	.smsSent-btn {
			flex: 1 1 auto;
      		background-color: @lightGreen;
      		border: none;
      		width: 100%;
      		height: 48/@rem;
      		font-size: 14/@rem;
	  		color: @blueBlack;
	  		font-weight: bold;
    	}
  	}
}

.wap-register.es-dialog .es-dialog-head h1{
	font-size: 20/@rem;
	height: auto;
}
</style>
