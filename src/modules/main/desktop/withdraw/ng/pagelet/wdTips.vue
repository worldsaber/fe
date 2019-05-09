<template lang="html">
  <dt class="m-wd-tips">
  	<dd class="f-title">Note</dd>
	<dl
		class="l-item"
		v-for="(item, index) in withdrawTips"
		:key="index"
	>
	<template v-if="index === 0">{{bankTip ? 'Banks accepted:' + bankTip : item}}</template>
	<template v-else>{{item}}</template>
	</dl>
  </dt>
</template>

<script>
import { mapState } from 'vuex';
import { withdrawTips } from '../js/config';

export default {
	data() {
		return {
			withdrawTips
		};
	},
	computed: {
		...mapState('withdraw', [
			'bankList'
		]),
		bankTip() {
			let bankStr = '';
			this.bankList.forEach((bank, i) => {
				if (i === this.bankList.length - 1) {
					bankStr += ` ${bank.bankName}.`;
				} else {
					bankStr += ` ${bank.bankName},`;
				}
			});
			return bankStr;
		}
	}
};
</script>

<style lang="less">
@import '../style/wdTips.less';
</style>
