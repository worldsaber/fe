<template>
	<div class="gift-wrap">
		<img :src="gift" alt="" class="gift-item gift-house"/>
	</div>
</template>
<script>
import { winning } from '../../images/config';

export default {
	data() {
		return {
			gift: winning.house,
		};
	},
};
</script>

<style lang="less">
.gift-wrap{
	.gift-house{
		width: 46%;
	}
}
</style>

