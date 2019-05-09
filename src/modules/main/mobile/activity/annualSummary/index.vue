<template>
	<div :class="['annual-summary-wrap', ratioStyle]">
		<router-view></router-view>
	</div>
</template>
<script>
import { entry } from './images/config';
import { preLoadImages } from './util';

export default {
	data() {
		const el = document.documentElement;
		const w = el.clientWidth;
		const h = el.clientHeight;
		return {
			ratioStyle: w / h > 0.6 ? 'wrap-aspect-ratio' : '',
		};
	},
	created() {
		// 强制到入口
		if (this.$route.name !== 'entry') {
			this.$router.replace({
				name: 'entry'
			});
		}
		// 关闭loading  追加 等待图片加载，接口加载
		const pageLoading = document.querySelector('#pageLoading');

		const list = Object.values(entry);
		const prom = preLoadImages(list);
		prom.then(() => {
			pageLoading.style.display = 'none';
		});
	},

};
</script>
<style lang="less">
@import './font/font.less';
.annual-summary-wrap{
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	// background: url('./images/background.png') center top no-repeat;
	background-image: radial-gradient(circle at 47% 0, #151150, rgba(21, 18, 80, 0.97) 4%, rgba(23, 20, 81, 0.78) 23%, rgba(40, 37, 92, 0.58) 39%, rgba(11, 11, 43, 0));
	background-color: #000;
	background-size: 100% 100%;
	overflow: hidden;
	font-family: MyriadPro;
}
.page-screen{
	position: absolute;
	width: 100%;
	left: 0;
	top: 0;
	bottom: 0;
}
</style>

