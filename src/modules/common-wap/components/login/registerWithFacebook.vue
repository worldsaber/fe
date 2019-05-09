<template>
<div id="addPhone">
	<div class="add-phone-container">
		<form>
			<div class="add-phone-label">
				<p>Add Mobile Number</p>
			</div>
			<div class="action-label">Adding your mobile number helps you easily deposite / withdraw your money</div>
			<af-input class="verifyInputs" type="tel" placeholder="Mobile Number" icon="delete" :iconClick="iconCLick" :maxlength="18" v-model="phone" :error="showError">
				<div slot="prepend">+{{countryCode}}</div>
			</af-input>
			<div class="error-message">
				<p v-if="showError">{{errorMsg}}</p>
			</div>
			<af-button @click.prevent="addPhone" class="add-phone-btn" :disabled="disabled" :loading="loading">{{loading ? 'Loading' : 'Next'}}</af-button>
		</form>
	</div>
</div>
</template>

<script>
import {
	AfInput
} from 'components/input';
import afButton from 'packages/button/index';
import dialog from 'components/dialog';
import { fixPhone } from 'base/js/utils';

export default {
	name: 'addPhone',
	components: {
		AfInput,
		afButton
	},
	props: {
		bizType: {
			type: String,
			'default': ''
		}
	},
	data () {
		return {
			phone: '',
			disabled: true,
			loading: false,
			errorMsg: '',
			showError: false,
			countryCode: window.countryCode || '254'
		};
	},
	created () {

	},
	watch: {
		phone () {
			this.disabled = this.phone === '';
			if (this.showError) {
				this.showError = false;
			}
		}
	},
	methods: {
		iconCLick () {
			this.phone = '';
		},
		addPhone () {
			if (this.loading) {
				return;
			}

			const phone = this.phone,
				tempPhone = fixPhone(phone);
			if (tempPhone !== phone) {
				this.phone = tempPhone;
			}

			this.loading = true;

			fetch('/patron/phone/checkStatus', {
				method: 'GET',
				body: {
					phone: this.phone
				}
			})
				.then(res => res.json())
				.then(res => {
					this.loading = false;
					const bizCode = res.bizCode;
					if (bizCode === 11601) { // 未注册手机号码，去获取验证码
						this.$emit('goVeriry', {
							phone: this.phone,
							bizType: 'THIRD_PARTY_BIND',
							remainMsgNum: ''
						});
					} else if ([11600, 11602, 11605].indexOf(bizCode) > -1) {
						// dialog.alert('The mobile number is already associated with an account. A mobile number can be associated with one account only. If you have any questions, please contact us for more information.', ['OK']);
						dialog.alert(res.message, ['OK']);
					} else {
						// this.errorMsg = addPhoneErr[bizCode] ? addPhoneErr[bizCode].text : 'Unknown error.'
						this.errorMsg = res.message;
						this.showError = true;
					}
				})
				.catch(res => {
					window.__debug__ && console.log(res);
					this.loading = false;
					dialog.alert('No internet connection, try again.', ['OK']);
				});
		}
	}
};
</script>

<style lang='less'>
@import "~base/styles/variable.less";
@import "iconfont/iconfont-mixin.less";
@import "base/styles/icon.less";

#addPhone {
  margin-top: -42/@rem;
  .add-phone-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    .add-phone-label {
      width: 100%;
      height: 17/@rem;
      font-size: 22/@rem;
      font-weight: bold;
      line-height: 0.77;
      text-align: center;
      color: @dark;
    }
    .m-input-wap-wrapper--active {
      border: 1px solid #0d9737;
    }
    .action-label {
      width: 100%;
      margin-top: 7.8/@rem;
      margin-bottom: 37/@rem;
      height: 20/@rem;
      font-size: 12/@rem;
      line-height: 20/@rem;
      text-align: center;
      color: @dark;
    }
    .verifyInputs {
      height: 48/@rem;
      width: 100%;
      padding-left: 1px;
      padding-right: 1px;
      box-sizing: border-box;
      font-size: 14/@rem;
      .m-loading-circle-icon {
        .m-icon-loading-circle();
      }

      input {
        height: 100%;
        padding: 17/@rem 10px;
      }
    }

    .error-message {
      margin-top: 1/@rem;
      width: 100%;
      font-size: 12/@rem;
      line-height: 1.67;
      text-align: left;
      min-height: 20/@rem;
      color: @red;
    }

    .add-phone-btn {
      margin-top: 8/@rem;
      width: 100%;
      padding-left: 1px;
      padding-right: 1px;
      box-sizing: border-box;
      background-color: @green;
      border: none;
      height: 47.5/@rem;
      font-size: 14/@rem;
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
}
</style>
