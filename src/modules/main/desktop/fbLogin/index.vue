<template lang="html">
  <div class="m-page-wrapper">
	  <div class="m-page-header">
		  <div>
			  <a class="m-image-wrapper" href="/">
				  <img src="../common/core/image/logo.png" alt="sportyBet" />
			  </a>
		  </div>
	  </div>
	  <div class="m-page-container">
		<div>
			<p class="m-page-title">
  			<span class="m-icon-user">Account Security</span>
  		  </p>
  		   <div class="m-page-main">
  			  <PageSteps :active="stepIndex" />
  			  <PagePhone
  			  	v-if="showPage('phone')"
  				:countryCode="countryCode"
  				:account="account"
  				/>
  			  <PageCode v-if="showPage('code')" />
  			  <PageSMS v-if="showPage('sms')" />
  			  <PageSuccess v-if="showPage('success')" />
  		   </div>
		</div>
	  </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapState } from 'vuex';
import * as mutationsTypes from 'store/changePsd/mutationTypes';

import PageSteps from './pagelet/psdSteps.vue';
import PagePhone from './pagelet/phone.vue';
import PageCode from './pagelet/psdCode.vue';
import PageSMS from './pagelet/psdSMS.vue';
import PageSuccess from './pagelet/psdSuccess.vue';

export default {
	components: {
		PagePhone,
		PageSteps,
		PageCode,
		PageSMS,
		PageSuccess
	},
	computed: {
		...mapState('fbLogin', [
			'countryCode',
			'account'
		]),
		...mapGetters('fbLogin', {
			moduleName: 'getmoduleName'
		}),
		stepIndex() {
			// module 顺序
			const stepsKey = {
				phone: 0,
				code: 1,
				sms: 1,
				success: 2
			};
			return stepsKey[this.moduleName];
		},
	},
	methods: {
		...mapMutations('fbLogin', {
			changeModule: mutationsTypes.UPDATE_NEXT_PAGE
		}),

		showPage(name) {
			return name === this.moduleName;
		}
	},
	mounted() {
		this.changeModule('phone');
	}
};
</script>
