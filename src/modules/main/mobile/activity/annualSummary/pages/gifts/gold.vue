<template>
	<div class="gift-wrap">
		<img :src="gift" alt="" class="gift-item gift-gold"/>
	</div>
</template>
<script>
import { winning } from '../../images/config';

export default {
	data() {
		return {
			gift: winning.gold,
		};
	},
};
</script>

<style lang="less">
.gift-wrap{
	.gift-gold{
		width: 59.2%;
	}
}
</style>

