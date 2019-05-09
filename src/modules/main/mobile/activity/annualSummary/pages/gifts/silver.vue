<template>
	<div class="gift-wrap">
		<img :src="gift" alt="" class="gift-item gift-silver"/>
	</div>
</template>
<script>
import { winning } from '../../images/config';

export default {
	data() {
		return {
			gift: winning.silver,
		};
	},
};
</script>

<style lang="less">
.gift-wrap{
	.gift-silver{
		width: 45.6%;
	}
}
</style>

