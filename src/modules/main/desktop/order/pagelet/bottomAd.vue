<template lang="html">
	<div v-if="!!imgUrl" class="m-order-ads">
		<a :href="linkUrl" target="_blank"><img :src="imgUrl"/></a>
	</div>
</template>

<script>
import { getAdConfig } from 'utils/getAdConfig';

export default {
	data() {
		return {
			imgUrl: '',
			linkUrl: ''
		};
	},
	created () {
		getAdConfig('orderBottom').then(obj => {
			if (obj[0].imgUrl) {
				this.imgUrl = obj[0].imgUrl;
				this.linkUrl = obj[0].linkUrl;
			}
		});
	}
};
</script>

<style lang="less" scope>
.m-order-ads{
	width:463px;
	height: 115px;
	margin: 0 auto;
	img{
		display: block;
		width:100%;
		height:100%;
	}
}
</style>
