<template>
	<div class="m-pic-views" @click.stop="() => {}" v-viewer="options">
		<template v-for="(source, i) in showImgs">
			<div class="m-img-container" :key="i">
				<img :src="defaultViewImg" :data-source="source">
			</div>
		</template>
	</div>
</template>

<script>
/*
	用户分享的图片展示
*/
import 'packages/imageBrowser';
import defaultViewImg from './images/default_view.png';

export default {
	name: 'PicViews',
	props: {
		// 原图
		imgs: {
			type: Array,
			required: true
		}
	},
	data() {
		return {
			defaultViewImg,
			options: {
				url: 'data-source'
			}
		};
	},
	computed: {
		showImgs() {
			return this.imgs.map(x => `${__cdnOrigin__}/${x}`);
		}
	}
};
</script>

<style lang="less">
@import '~base/styles/variable.less';

.m-pic-views {
	margin: 8/@rem 0;

	.m-img-container {
		display: inline-block;
		width: 80/@rem;
		height: 80/@rem;
		overflow: hidden;

		img {
			display: block;
			width: 100%;
		}
	}
}
</style>
