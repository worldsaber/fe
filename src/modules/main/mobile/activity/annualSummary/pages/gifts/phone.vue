
<template>
	<div class="gift-wrap">
		<img :src="gift" alt="" class="gift-item gift-phone"/>
	</div>
</template>
<script>
import { winning } from '../../images/config';

export default {
	data() {
		return {
			gift: winning.phone,
		};
	},
};
</script>

<style lang="less">
.gift-wrap{
	.gift-phone{
		width: 54.6%;
	}
}
</style>

