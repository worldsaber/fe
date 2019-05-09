<template>
	<div class="gift-wrap">
		<img :src="gift" alt="" class="gift-item gift-travel"/>
	</div>
</template>
<script>
import { winning } from '../../images/config';

export default {
	data() {
		return {
			gift: winning.travel,
		};
	},
};
</script>

<style lang="less">
.gift-wrap{
	.gift-travel{
		width: 50%;
	}
}
</style>

