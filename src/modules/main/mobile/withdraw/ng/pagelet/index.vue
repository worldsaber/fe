<template>
	<div>
		<withdraw v-if="step === 'withdraw'" @goStep="goStep"/>
	    <success v-else :form="successForm" :manual="manual"/>
	    <ShopBanner v-if="step === 'withdraw'" keyword="buyGiftWithdrawPage" />
	</div>
</template>

<script>
import withdraw from './withdraw.vue';
import success from './success.vue';
import ShopBanner from '../../../shop/pagelet/adBanner.vue';

export default {
	name: 'NG-withdraw',
	components: {
		withdraw,
		success,
		ShopBanner
	},
	data () {
		return {
			step: 'withdraw',
			successForm: {},
			manual: false
		};
	},
	methods: {
		goStep(step, form, manual) {
			this.successForm = form;
			this.step = step;
			this.manual = manual;
		}
	}
};
</script>
