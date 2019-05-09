<template>
	<div class="gift-wrap">
		<img :src="gift" alt="" class="gift-item gift-shoe"/>
	</div>
</template>
<script>
import { winning } from '../../images/config';

export default {
	data() {
		return {
			gift: winning.shoe,
		};
	},
};
</script>

<style lang="less">
.gift-wrap{
	.gift-shoe{
		width: 61.4%;
	}
}
</style>

