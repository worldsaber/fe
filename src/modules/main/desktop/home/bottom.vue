<template lang="html">
	<div class="home-bottom" v-if="getBannerAd">
		<template v-if="getBannerAd.linkUrl && getBannerAd.imgUrl">
			<a :href="getBannerAd.linkUrl" class="m-image-wrapper">
    			<img :src="getBannerAd.imgUrl" :alt="getBannerAd.text" />
    		</a>
		</template>
		<template v-else-if="getBannerAd.imgUrl">
			<div class="m-image-wrapper">
				<img :src="getBannerAd.imgUrl" :alt="getBannerAd.text" />
			</div>
		</template>
	</div>
</template>

<script>
import { mapState } from 'vuex';

export default {
	computed: {
		...mapState('home', [
			'promotionAd'
		]),
		getBannerAd() {
			return this.promotionAd.bottomBanner || null;
		}
	}
};
</script>

<style lang="less">
@import 'base/style/mixin.less';

.home-bottom {
	width: 745px;
	height: 147px;
	margin: 20px 0 46px;

	.m-image-wrapper {
		display: inline-block;
		width: 745px;
		height: 147px;

		.m-image-wrapper();
	}
}
</style>
