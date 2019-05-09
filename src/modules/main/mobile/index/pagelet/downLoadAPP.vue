<template>
	<a :href="downloadApp" class="down-app" v-if="isShow">
		<span class="close" @click.stop.prevent="close"></span>
		<img :src="downloadUrl" alt="download" v-if="downloadUrl">
		<img src="../img/download-app.gif" alt="download" v-else>
	</a>
</template>
<script>
	import { pagePath } from 'config/pageConfig';
	// 顶部app下载
	export default {
		props: ['data'],
		computed: {
			downloadUrl () {
				return this.data && this.data.imgUrl ? this.data.imgUrl : '';
			}
		},
		data () {
			return {
				isShow: !sessionStorage.getItem('isHomeClickDownApp'),
				downloadApp: URL.addPara(`${pagePath.reDownloadApp}?channel=wap`, {
					source: 'home'
				})
			};
		},
		methods: {
			close () {
				this.isShow = false;
				sessionStorage.setItem('isHomeClickDownApp', '1');
			}
		}
	};
</script>
<style lang="less" scoped>
	@import 'base/styles/variable.less';
	.down-app{
		position: relative;
		display: block;
		img{
			display: block;
			width: 100%;
			height: auto;
		}
		.close{
			position: absolute;
			width: 35/@rem;
			height: 100%;
			left: 0;
			top: 0;
		}
	}
</style>

