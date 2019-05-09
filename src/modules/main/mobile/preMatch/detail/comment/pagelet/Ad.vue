<template>
	<a class="m-comment-ad" :href="ad.linkUrl">
		<img :src="ad.imgUrl" :alt="ad.text">
	</a>
</template>

<script>

export default {
	name: 'CommentAd',
	props: {
		ad: {
			type: Object,
			required: true
		}
	}
};
</script>

<style lang="less">
@import '~base/styles/variable.less';

.m-comment-ad {
	display: block;
	width: 100%;

	img {
		vertical-align: top;
		width: 100%;
	}
}
</style>
