<template lang="html">
  <div class="">
    <AfSteps :space="100" :active="active" finish-status="success" :showProcess="false" :processPad="5">
      <AfStep title="步骤 1"></AfStep>
      <AfStep title="步骤 2"></AfStep>
      <AfStep title="步骤 3"></AfStep>
    </AfSteps>
	<!-- <AfSteps :space="200" :active="active">
	  <AfStep title="步骤 1" description="这是一段很长很长很长的描述性文字"></AfStep>
	  <AfStep title="步骤 2" description="这是一段很长很长很长的描述性文字"></AfStep>
	  <AfStep title="步骤 3" description="这是一段很长很长很长的描述性文字"></AfStep>
	</AfSteps> -->

    <button style="margin-top: 12px;" @click="next">下一步</button>
  </div>
</template>

<script>
// import AfStep from './src/step.vue';
// import AfSteps from './src/steps.vue';
import { AfStep, AfSteps } from './index';

export default {
	data() {
		return {
			active: 0
		};
	},
	// components: {
	// 	AfStep,
	// 	AfSteps
	// },
	methods: {
		next() {
			this.active++;
		}
	}
};
</script>

<style lang="less">
@import './step.less';
@import './steps.less';
</style>
