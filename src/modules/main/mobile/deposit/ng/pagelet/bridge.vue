<template>
	<components
		:is="contentData.type"
		:tradeId="contentData.tradeId"
		:verifyType="contentData.verifyType"
		:status="contentData.status"
		:extraData="contentData.extraData"
		@trigger="trigger">
	</components>
</template>

<script>
import pin from './pinVerify.vue';
import otp from './otpVerify.vue';
import otpSpecial from './otpSpecialVerify.vue';
import phone from './phoneVerify.vue';
import jumpBank from './bankAuthVerify.vue';
import birth from './birthVerify.vue';
import token from './tokenVerify.vue';
import account from './accountVerify.vue';
import holding from './holding.vue';
import ussd from './ussdVerify.vue';

export default {
	components: {
		pin,
		otp,
		otpSpecial,
		phone,
		jumpBank,
		birth,
		token,
		account,
		holding,
		ussd
	},
	methods: {
		trigger(type, params) {
			this.$emit(type, params);
		}
	}
};
</script>
