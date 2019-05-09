<template>
	<div class="gift-wrap">
		<img :src="gift" alt="" class="gift-item gift-bronze"/>
	</div>
</template>
<script>
import { winning } from '../../images/config';

export default {
	data() {
		return {
			gift: winning.bronze,
		};
	},
};
</script>

<style lang="less">
.gift-wrap{
	.gift-bronze{
		width: 45.7%;
	}
}
</style>

