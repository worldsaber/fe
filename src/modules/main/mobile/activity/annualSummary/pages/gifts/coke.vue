<template>
	<div class="gift-wrap">
		<img :src="gift" alt="" class="gift-item gift-coke"/>
	</div>
</template>
<script>
import { winning } from '../../images/config';

export default {
	data() {
		return {
			gift: winning.coke,
		};
	},
};
</script>

<style lang="less">
.gift-wrap{
	.gift-coke{
		width: 44.2%;
	}
}
</style>

