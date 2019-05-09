<template>
		<form class="m-psw-wrap">
			<h1>Reset Password</h1>
			<p>Your password must be 6-14 character long and contain at least one letter and one number.</p>
			<AfInput
				v-model="password"
				type="password"
				:minlength="6"
				:maxlength="50"
				showTextIcon="Show"
				hideTextIcon="Hide"
				placeholder="New Password"
				:toggleShowText="true"
				:error="isPasswordError"
				@blur="validPassword"
				@change="changeHanlderPsw"
				>
			</AfInput>
			<span class="m-error-infos">{{passwordErrInfo}}</span>
			<div class="m-btn-wrapper">
				<AfButton
					extraType="primary"
					:loading="loading"
					:disabled="submitStatus"
					@click.prevent="submitHandler"
					><template v-if='!loading'>Confirm</template><template v-else>Loading...</template></AfButton>
				</div>
		</form>
</template>
<script>
import md5 from 'blueimp-md5';
import { userCenterUrl } from 'config/mycenter/dataConfig';
import { AfInput } from 'packages/input';
import AfButton from 'packages/button/button.vue';
import popMsg from '../../deposit/ke/js/popMsg';
import { isValidPsw } from '../js/helper';
import '../../mockData/myAccount/index?debug';

export default {
	mixins: [popMsg],
	components: {
		AfInput,
		AfButton
	},
	props: ['token', 'oldPassword'],
	computed: {
		isPasswordError () {
			return this.passwordErrInfo !== '';
		},
		submitStatus () {
			return !this.password || this.isPasswordError;
		}
	},
	data () {
		return {
			password: '',
			loading: false,
			passwordErrInfo: '',
			forgetPasswordUrl: userCenterUrl.forgetPassword,
		};
	},
	methods: {
		changeHanlderPsw (data) {
			const val = data.value;
			if (val) {
				// replace space
				// if (/\s/.test(val)) {
				// 	this.password = val.replace(/\s/g, '');
				// } else {
				this.passwordErrInfo = '';
				// }
			}
		},
		validPassword () {
			this.passwordErrInfo = isValidPsw(this.password);
			if (this.password === this.oldPassword) {
				this.passwordErrInfo = 'New Password cannot be same as Old Password.';
			}
		},
		submitHandler () {
			this.validPassword();

			if (this.passwordErrInfo) {
				return;
			}

			if (!this.submitStatus && !this.loading) {
				this.loading = true;
				// console.log(this.password + '|' + this.token);
				fetch('/patron/password/changeWithToken', {
					method: 'PUT',
					body: {
						password: md5(this.password),
						token: this.token
					}
				})
				.then(res => res.json())
				.then(data => {
					this.loading = false;
					const code = data.bizCode;
					if (code === 10000) {
						this.showToast('Password Reset Succeeded.');
						window.setTimeout(() => {
							window.location.reload();
						}, 2000);
					} else {
						this.showMsgPop({ msg: 'Sorry，something went wrong. Please try again later.' });
					}
				})
				.catch(() => {
					this.loading = false;
					this.showToast('No internet connection, try again.');
				});
			}
		}
	}
};
</script>
