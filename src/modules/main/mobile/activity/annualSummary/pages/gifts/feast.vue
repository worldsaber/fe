<template>
	<div class="gift-wrap">
		<img :src="gift" alt="" class="gift-item gift-feast"/>
	</div>
</template>
<script>
import { winning } from '../../images/config';

export default {
	data() {
		return {
			gift: winning.feast,
		};
	},
};
</script>

<style lang="less">
.gift-wrap{
	.gift-feast{
		width: 62.5%;
	}
}
</style>

