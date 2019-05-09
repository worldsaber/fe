<template>
	<div class="gift-wrap">
		<img :src="gift" alt="" class="gift-bike gift-item"/>
	</div>
</template>
<script>
import { winning } from '../../images/config';

export default {
	data() {
		return {
			gift: winning.bike,
		};
	},
};
</script>

<style lang="less">
.gift-wrap{
	.gift-bike{
		width: 61.9%;
	}
}
</style>

