<template lang="html">
  <ul class="m-dp-gh-tips f-count">
	<li
		class="l-item"
		v-for="(line, index) in lines"
		:key="index"
	>{{line}}</li>
</ul>
</template>

<script>
// import { dpTips } from '../js/config';

export default {
	props: ['lines']
};
</script>

<style lang="less">
@import '../style/depositTips.less';
</style>
