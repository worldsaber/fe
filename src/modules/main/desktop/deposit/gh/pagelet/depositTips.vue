<template lang="html">
	<dt class="m-dp-gh-tips f-count">
    	<dd class="f-title">Note</dd>
  	<dl
		class="l-item f-flex f-count-item "
		v-for="(item, index) in dpTips"
		:key="index"
  	>{{item}}</dl>
    </dt>
</template>

<script>
import { dpTips } from '../js/config';

export default {
	data() {
		return {
			dpTips
		};
	}
};
</script>

<style lang="less">
@import '../style/depositTips.less';
</style>
