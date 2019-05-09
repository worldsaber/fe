<template>
	<form class="m-fm-wrap m-fm-wrap-psw">
		<div class="m-fm-row">
			<div class="m-fm-left">Old Password</div>
			<div class="m-fm-right">
				<AfInput
					v-model="oldPassword"
					type="password"
					:minlength="6"
					:maxlength="50"
					showTextIcon="Show"
					hideTextIcon="Hide"
					:toggleShowText="true"
					:error="isOldPswError"
					@change="changeHanlderOldPsw"
					>
				</AfInput>
				<a :href="resetPsdUrl" class="m-txt-link">Forgot Password?</a>
				<span class="m-error-infos">{{errOldPswInfo}}</span>
			</div>
		</div>
		<div class="m-fm-row">
			<div class="m-fm-left">New Password</div>
			<div class="m-fm-right">
				<AfInput
					v-model="password"
					type="password"
					:maxlength="50"
					:toggleShowText="true"
					:minlength="6"
					showTextIcon="Show"
					hideTextIcon="Hide"
					:error="isPswError"
					@change="changeHanlderPsw"
					>
				</AfInput>
				<p class="inputDesc">Length of 6-14 characters.<br/>At least one letter and one number.</p>
				<span class="m-error-infos">{{errPswInfo}}</span>
			</div>
		</div>
		<div class="m-fm-row">
			<div class="m-fm-left">&nbsp;</div>
			<div class="m-fm-right">
				<div class="m-btn-wrapper">
					<AfButton
						extraType="primary"
						:disabled="submitStatus"
						@click.prevent="submitHandler"
						:loading="loading"
						><template v-if='!loading'>Confirm</template><template v-else>Loading...</template></AfButton>
					</div>
			</div>
		</div>
	</form>
</template>

<script>
import md5 from 'blueimp-md5';
import AfButton from 'packages/button/button.vue';
import { AfInput } from 'packages/input';

import { pagePath } from 'config/pageConfig';

import { isValidPsw } from '../js/helper';
import popMsg from '../../deposit/ke/js/popMsg';

export default {
	mixins: [popMsg],
	components: {
		AfButton,
		AfInput,
	},
	computed: {
		isPswError () {
			return this.errPswInfo !== '';
		},
		isOldPswError () {
			return this.errOldPswInfo !== '';
		},
		submitStatus () {
			return !(this.oldPassword && this.password) || this.isPswError || this.isOldPswError;
		}
	},
	data () {
		return {
			password: '',
			oldPassword: '',
			currentInput: '',
			loading: false,
			errPswInfo: '',
			errOldPswInfo: '',
			resetPsdUrl: pagePath.resetPassword
		};
	},
	methods: {
		submitHandler () {
			const psw = this.password;
			this.errOldPswInfo = isValidPsw(this.oldPassword, true);
			this.errPswInfo = isValidPsw(psw);
			if (psw === this.oldPassword) {
				this.errPswInfo = 'New Password cannot be same as Old Password.';
			}
			if (!this.errOldPswInfo && !this.errPswInfo && !this.loading) {
				this.sumbitPost().catch(() => {
					this.loading = false;
					this.showMsgPop({
						msg: 'Please check your internet connection and try again.'
					});
				});
			}
		},
		changeHanlderOldPsw (data) {
			const val = data.value;
			if (val) {
				// replace space
				// if (/\s/.test(val)) {
				// 	this.oldPassword = val.replace(/\s/g, '');
				// } else {
				this.errOldPswInfo = '';
				// }
			}
		},
		changeHanlderPsw (data) {
			const val = data.value;
			if (val) {
				// replace space
				// if (/\s/.test(val)) {
				// 	this.password = val.replace(/\s/g, '');
				// } else {
				this.errPswInfo = '';
				// }
			}
		},
		sumbitPost () {
			this.loading = true;
			// console.log(md5(this.oldPassword) + ":" + md5(this.password));
			return new Promise((resolve, reject) => {
				fetch('/patron/password', {
					method: 'PUT',
					body: {
						oldPassword: md5(this.oldPassword),
						password: md5(this.password)
					}
				})
				.then(res => res.json())
				.then(data => {
					this.loading = false;
					const code = data.bizCode;
					if (code === 10000) {
						this.isSuccess = true;
						this.$emit('success', 1);
					} else if (code === 11606) { // The password is incorrect
						this.errOldPswInfo = 'The password is incorrect. Please try again.';
					} else if (code === 11609) { // The password is incorrect
						this.errPswInfo = 'New Password cannot be same as Old Password.';
					}
				})
				.catch(err => reject(err));
			});
		}
	}
};
</script>
<style lang="less">
@import 'base/style/variable.less';
.m-fm-wrap-psw{
	padding:22px 0 55px 41px!important;
	.m-fm-row{
		padding:20px 0;
		&:last-child{
			padding-top:26px;
		}
	}
	.m-fm-left{
		width: 145px;
	}
	.m-txt-link{
		color: @linkBlue;
		font-size: 14px;
		margin-left: 18px;
	}
}
.m-input-wrapper .m-input-text--icon{
	width: auto;
	right: 14px;
}
</style>
