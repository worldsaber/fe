<template>
	<div class="sporty-share-wrap">
		<div class="share-image-wrap">
			<img :src="shareImage"  class="share-image"/>
			<div class="share-user-name">{{userName.toUpperCase()}}</div>
		</div>
		<div class="share-btn-wrap">
			<div class="share-btn" @click="onClickShare">SHARE</div>
		</div>
		<Share v-if="isShowShare" :shareCfg="shareConfig" @succ-share="successShare" @close-share="close"/>
	</div>
</template>
<script>
import Share from 'components/share';
import { pagePath } from 'config/pageConfig';
import dialog from 'components/dialog';
import { URL } from 'utils/index';
import ShareSucc from './sharesuccess.vue';

export default {
	props: {
		imageId: {
			type: String,
			'default': ''
		},
		userName: {
			type: String,
			'default': ''
		},
		shareImage: {
			type: String,

		}
	},
	components: {
		Share,
	},
	data() {
		return {
			isShowShare: false
		};
	},
	computed: {
		shareUrl() {
			return `${location.origin}${pagePath.home}promotions/sporty_test/${this.imageId}`;
		},
		shareText() {
			return 'Which EPL football player lives in your heart? This is my player, come and explore yours!';
		},
		shareConfig() {
			return {
				text: this.shareText,
				url: this.shareUrl,
				via: 'sportybet',
				hashtag: 'SportyBet',
			};
		}
	},
	methods: {
		onClickShare() {
			this.isShowShare = true;
		},
		close() {
			this.isShowShare = false;
		},
		successShare() {
			// 弹层姓名输入框
			const dlg = dialog({
				css: 'dialog-sporty-share-success',
				content: ShareSucc,
				contentData: {
					callback: value => {
						dlg.close();
						const from = URL.getPara('from') || 'sporty_test';
						location.href = `${location.origin}${pagePath.home}?from=${from}`;
					}
				},
				button: []
			});
		}
	}
};
</script>

<style lang="less">
@import 'base/styles/variable.less';
@import './font/font.less';

.sporty-share-wrap{
	display: flex;
	position: absolute;
	top: 0;
	bottom: 0;
	width: 100%;
	flex-direction: column;
	background: #FFF;
	align-items: center;
	overflow: auto;
	.share-image-wrap{
		position: relative;
		width: 100%;
		font-family: 'MyriadPro';
		flex-basis: 360/@rem;
	}
	.share-user-name{
		position: absolute;
		top: 50%;
		width: 100%;
		text-align: center;
		font-size: 18/@rem;
		font-weight: bold;
		color: #FFF;
		margin-top: -12/@rem;
		font-family: 'Flipper-Cd';
		font-style: italic;
	}
	.share-image{
		width: 100%;
	}
	.share-btn-wrap{
		flex: 1;
		display: flex;
		flex-basis: 60/@rem;
		flex-shrink: 0;
		justify-content: center;
		align-items: center;
	}
	.share-btn{
		width: 128/@rem;
		height: 44/@rem;
		border-radius: 2/@rem;
		background-color: #1b1e25;
		line-height: 44/@rem;
		text-align: center;
		font-size: 24/@rem;
		font-weight: bold;
		color: #FFF;
		margin: 10/@rem auto;
		cursor: pointer;
		font-family: 'MyriadPro';
	}
}
@media screen and (max-height: 520px){
	.sporty-share-wrap {
		.share-btn-wrap{
			flex: 0;
			flex-basis: 60/@rem;
			flex-shrink: 0;
		}
		.share-image-wrap{
			flex: 1;
		}
		.share-image{
			display: block;
			height: 100%;
			max-width: 100%;
			box-sizing: border-box;
			margin: 0 auto;
		}
	}
}
</style>

