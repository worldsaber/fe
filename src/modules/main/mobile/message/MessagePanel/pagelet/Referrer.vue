<template>
	<div class="m-message-referrer">
		<!-- showTexts -->
		<div class="m-text" v-if="showTexts.length">
			<template v-for="(text, i) in showTexts">
				<span :key="i" v-if="!bookingCodes.includes(text)">{{text}}</span>
				<!-- booking code -->
				<template v-else>
					<span :key="i" class="booking-code" @click.stop="goToBetslip(text)">{{text}}</span>
				</template>
			</template>
		</div>

		<div class="m-text" v-else>{{content}}</div>

		<!-- 用户分享的图片，不可点击放大查看 -->
		<div class="m-pic-views" v-if="showImgs.length">
			<template v-for="(img, i) in showImgs">
				<div class="m-img-container" :key="i">
					<!-- 因为此处无需预览，故只放默认缩略图即可 -->
					<img :src="thumbImg" alt="">
				</div>
			</template>
		</div>
	</div>
</template>

<script>
import bookingCodeMixin from 'components/comment/bookingCodeMixin.js';
import defaultViewImg from 'components/comment/images/default_view.png';

export default {
	name: 'MessageReferrer',
	mixins: [
		bookingCodeMixin
	],
	props: {
		content: {
			type: String,
			'default': ''
		},
		shareImgs: {
			type: Array
		}
	},
	data() {
		return {
			// 缩略图
			thumbImg: defaultViewImg
		};
	},
	computed: {
		showTexts() {
			return this.resolveBookingCode(this.content);
		},
		showImgs() {
			return this.shareImgs.map(x => `${__cdnOrigin__}/${x}`);
		}
	}
};
</script>

<style lang="less">
@import '~base/styles/variable.less';
@import 'base/styles/icon.less';

.m-message-referrer {
	margin: 8/@rem 0;
	position: relative;
	padding: 8/@rem 12/@rem;
	border-radius: 4/@rem;
	background: @fogGray;
	color: @darker;

	.m-text {
		font-size: 12/@rem;
		line-height: 16/@rem;
		word-wrap: break-word;
		overflow : hidden;
		// 多行省略
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.m-pic-views {
		margin: 8/@rem 0;

		.m-img-container {
			display: inline-block;
			width: 80/@rem;
			height: 80/@rem;
			border: 1px solid #dcdee5;
			overflow: hidden;

			img {
				display: block;
				width: 100%;
			}
		}
	}
}

</style>
