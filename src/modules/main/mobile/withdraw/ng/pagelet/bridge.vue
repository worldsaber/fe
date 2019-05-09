<template>
	<components :is="contentData.type" :extraData="contentData.extraData" @trigger="trigger"></components>
</template>

<script>
import confirm from './confirm.vue';
import codeVerify from './codeVerify.vue';
import sms from './smsVerify.vue';

export default {
	data() {
		return {

		};
	},
	components: {
		confirm,
		codeVerify,
		sms
	},
	created() {
		console.log(this);
	},
	methods: {
		trigger(type, params) {
			this.$emit(type, params);
		},
	}
};
</script>
