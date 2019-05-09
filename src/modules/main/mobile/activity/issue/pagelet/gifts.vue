<template lang="html">
  <div class="m-gifts">
	  <div class="m-left">Gifts earned from Quiz</div>
	  <div class="m-right">{{getGifts}}</div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
	computed: {
		...mapState('issue', [
			'baseInfo'
		]),
		getGifts() {
			const baseInfo = this.baseInfo || {};

			return baseInfo.showTotalPrize || '-';
		}
	}
};
</script>

<style lang="less">
@import '../style/gifts.less';
</style>
