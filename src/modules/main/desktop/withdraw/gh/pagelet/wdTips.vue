<template lang="html">
	<dt class="m-wd-gh-tips f-count">
    	<dd class="f-title">Note</dd>
  	<dl
		class="l-item f-flex f-count-item "
		v-for="(item, index) in wdTips"
		:key="index"
  	>{{item}}</dl>
    </dt>
</template>

<script>
import { wdTips } from '../js/config';

export default {
	data() {
		return {
			wdTips
		};
	}
};
</script>

<style lang="less">
@import '../style/wdTips.less';
</style>
