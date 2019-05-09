<template>
  <depositPay v-if="step === 'pay'" @goStep="goStep"/>
  <AtmGuide v-else-if="step=== 'atm'" @goStep="goStep"/>
  <USSDGuide v-else-if="step=== 'ussd'" @goStep="goStep"/>
  <depositSuccess v-else :form="successForm"/>
</template>

<script>
import depositConfig from 'config/deposit/record';
import depositPay from './pagelet/pay.vue';
import depositSuccess from './pagelet/success.vue';
import USSDGuide from './pagelet/ussdGuide';
import AtmGuide from './pagelet/atmGuide';

export default {
	name: 'NG-deposit',
	components: {
		depositPay,
		depositSuccess,
		USSDGuide,
		AtmGuide
	},
	data () {
		return {
			step: 'pay',
			successForm: {}
		};
	},
	mounted() {
		depositConfig.check();
	},
	methods: {
		goStep(step, successForm) {
			this.successForm = successForm;
			this.step = step || 'pay';
		}
	}
};
</script>
