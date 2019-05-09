<template lang="html">
  <dt class="m-dp-tips">
  	<dd class="f-title">Note</dd>
	<dl
		class="l-item"
		v-for="(item, index) in cardTips"
		:key="index"
	>{{index + 1}}. {{item}}</dl>
  </dt>
</template>

<script>
import { cardTips } from '../js/config';

export default {
	data() {
		return {
			cardTips
		};
	}
};
</script>

<style lang="less">
@import '../style/depositTips.less';
</style>
