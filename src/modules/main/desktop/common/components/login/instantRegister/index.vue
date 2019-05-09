<template lang="html">
	<div :class=getWrapperStyle>
		<div class="m-title"><span>Instant Registration</span></div>
		<p class="m-pro-tips">{{tips}}</p>
		<AfInput
	  	  v-model="phone"
	  	  placeholder="Mobile Number"
	  	  @change="validatorPhone"
	  	  :iconClick="clearAllInput">
		  <span slot="prepend">+{{cCode}}</span>
	    </AfInput>
		<div class="m-btn-wrapper">
			<AfButton @click="register">Register</AfButton>
		</div>
		<div class="m-third-party" @click="openIDOAuth">
			<i class="m-icon-fb"></i>
			<span>Log In with Facebook</span>
		</div>
	</div>
</template>

<script>
import 'components/login/popLogin';

import { fbLogin } from 'base/js/fbLogin';
import { fixPhone } from 'base/js/utils';

import { thirdPartyLogin } from 'core/js/loginBar';
// import { showCurrency } from 'config/currencyConfig';

import pageMixins from '../js/psdMixins';
import phoneValidator from '../js/phoneValidator';

import { getTips } from './config';

export default {
	name: 'InstantRegister',

	componentName: 'InstantRegister',

	mixins: [phoneValidator, pageMixins],

	props: {
		theme: {
			type: String,
			'default': 'white',
			validator(val) {
				return ['white', 'dark', 'black'].includes(val);
			}
		}
	},

	data() {
		return {
// 			showCurrency,
			cCode: this.countryCode || window.countryCode || '254',
			tips: getTips
		};
	},

	computed: {
		getWrapperStyle() {
			return [
				'm-instant-reg',
				`m-instant-${this.theme}`
			];
		}
	},
	methods: {
		clearAllInput() {
			this.phone = '';
		},
		register() {
			const phone = this.phone,
				tempPhone = fixPhone(phone);
			if (tempPhone !== phone) {
				this.phone = tempPhone;
			}

			window.login({
				activeTab: 'Register',
				account: this.phone
			});
		},
		openIDOAuth() {
			fbLogin().then(res => {
				thirdPartyLogin(res && res.fbToken || '');
			}).catch(() => {});
		}
	}
};
</script>
