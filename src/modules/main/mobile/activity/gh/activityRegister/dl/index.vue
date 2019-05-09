<template>
	<div class="act-reg-dl">
		<div class="content">
			<img :src="imgUrl" class="img-item"/>
			<div v-html="content.header"></div>
			<a href="https://www.sportybet.com/api/gh/common/config/latestDownload/android?channel=taboola_apk_gh" class="link-dl">
				<img :src="dlUrl" class="img-item img-dl"/>
			</a>
			<div v-html="content.footer"></div>
		</div>
		<FooterBar class="footer" />
	</div>
</template>
<script>
import FooterBar from 'components/layout/pagelate/footer/index.vue';
import content from '../js/planId3.js';

const defaultImg3 = require('../image/topBanner3.png');
const dlImg = require('../image/dl.png');

// window.country = 'gh';
export default {
	components: {
		FooterBar
	},
	data() {
		return {
			content,
			imgUrl: defaultImg3,
			dlUrl: dlImg
		};
	},
	mounted() {
		const loading = document.querySelector('#pageLoading');
		loading && (loading.style.display = 'none');
	}

};
</script>
<style lang="less">
@import 'base/styles/variable.less';
.act-reg-dl{
	font-family: Roboto;
	font-size: 12/@rem;
	line-height: 1.83;
	text-align: left;
	color: #353a45;
	.img-item{
		width: 100%;
	}
	.img-dl{
		display: block;
		margin: 10/@rem auto 0;
		width: 270/@rem;
	}
	.link-dl{
		display: block;
	}
	.title{
		padding: 0 26/@rem;
		margin-top: 11/@rem;
		font-size: 18/@rem;
		font-weight: bold;
		text-align: left;
		line-height: normal;
	}
	.content {
		p {
			padding: 0 26/@rem;
			margin-top: 18/@rem;
			font-size: 12/@rem;
			line-height: 1.83;
			text-align: justify;
		}
		.text-gray{
			font-size: 10/@rem;
			line-height: 1.3;
			color: #9b9b9b;
			margin-bottom: 50/@rem;
		}
	}
}
</style>
