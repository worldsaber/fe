<template>
	<div class="video-wrap">
		<video controls class="video-item" ref="video" preload="metadata" playsinline>
			<source :src="videoSrc" type="video/mp4">
		</video>
		<div class="video-mask" ref="mask" @click="onClickMask" v-if="hasMask">
			<span class="video-play"></span>
		</div>
	</div>
</template>
<script>
import video from '../image/video.mp4';
// import poster from '../image/big-bgd.png';
export default {
	data() {
		return {
			videoSrc: video,
			// poster,
			hasMask: true,
		};
	},
	methods: {
		onClickMask() {
			const video = this.$refs.video;
			this.hasMask = false;
			video.play();
		}
	}
};
</script>
<style lang="less">
@import 'base/styles/variable.less';
@import 'base/styles/icon.less';

.video-wrap{
	position: relative;
	margin: 10/@rem 0;
	.video-item{
		width: 100%;
	}
	.video-mask{
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		width: 100%;
		background: #000;
		.video-play{
			position: absolute;
			left: 50%;
			top: 50%;
			margin: -24/@rem 0 0 -24/@rem;
			height: 48/@rem;
			width: 48/@rem;
			.m-icon-live-stream();
			&:before{
				font-size: 48/@rem;
				color: #FFF;
				line-height: 48/@rem;
			}
		}
	}

}
</style>

