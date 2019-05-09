<template>
		<form class="m-psw-wrap">
			<h1>Verify Your Identity</h1>
			<p>Before  accessing sensitive info, you need to verify your identity by entering old password.</p>
			<AfInput
				v-model="password"
				type="password"
				:minlength="6"
				:maxlength="50"
				showTextIcon="Show"
				hideTextIcon="Hide"
				:toggleShowText="true"
				placeholder="Old Password"
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
					><template v-if='!loading'>Next</template><template v-else>Loading...</template></AfButton>
				</div>
			<div class="m-link-awrap"><a :href="forgetPasswordUrl">Forgot Password?</a></div>
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
			this.passwordErrInfo = isValidPsw(this.password, 1);
		},
		submitHandler () {
			if (!this.submitStatus && !this.loading) {
				this.loading = true;
				// console.log(this.password);
				fetch('/patron/password/check', {
					method: 'GET',
					body: {
						oldPassword: md5(this.password),
					}
				})
				.then(res => res.json())
				.then(data => {
					this.loading = false;
					const code = data.bizCode;
					if (code === 10000) {
						this.$emit('stepOneBackHandler', {
							token: data.data.token,
							password: this.password
						});
					} else { // The password is incorrect
						this.passwordErrInfo = 'The password is incorrect. Please try again.';
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
