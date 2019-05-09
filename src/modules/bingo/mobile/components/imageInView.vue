<template>
	<div class="com-image-view-wrap" ref="banner">
		<img :src="url" class="com-image-view-image" v-if="isInView && url"/>
	</div>
</template>
<script>
import { mapState } from 'vuex';

export default {
	props: {
		url: {
			type: String,
			required: true
		}
	},
	data() {
		return {
			isInView: false
		};
	},
	computed: {
		...mapState('layout', [
			'scrollPayload'
		])
	},
	mounted() {
		this.unwatch = this.$watch('scrollPayload', value => {
			// 如果已经可见，则忽略下面
			if (this.isInView) {
				// unwatch
				this.unwatch && this.unwatch();
				return;
			}

			const $banner = this.$refs.banner;
			if ($banner) {
				const rect = $banner.getBoundingClientRect();  // 有可能外界dom变化导致rect缓存失效, 所以不缓存
				const top = rect.top;
				this.isInView = top <= value.clientHeight;
			}
		}, {
			immediate: true
		});
	}
};
</script>
<style lang="less">
@import 'base/styles/icon.less';
@import 'base/styles/variable.less';

.com-image-view-wrap{
	position: relative;
	width: 100%;
	height: 90/@rem;
	background-color: #EAECEF;
	border: 1px solid #dcdee5;
	box-sizing: border-box;
	text-align: center;
	line-height: 90/@rem;
	.m-icon-logo();
	&::before{
		font-size: 36/@rem;
		color: #d4d6df;
	}
	img {
		background: #fff;
	}
}
.com-image-view-image{
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
}
</style>

