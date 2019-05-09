<template>
	<div class="gift-wrap">
		<img :src="gift" alt="" class="gift-item gift-car"/>
	</div>
</template>
<script>
import { winning } from '../../images/config';

export default {
	data() {
		return {
			gift: winning.car,
		};
	},
};
</script>

<style lang="less">
.gift-wrap{
	.gift-car{
		width: 69.6%;
	}
}
</style>

