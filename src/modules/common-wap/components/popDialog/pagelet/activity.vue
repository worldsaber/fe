<template lang="html">
	<div class="m-act-wrapper" v-if="contentData.imgUrl">
		<i
			class="m-icon-close"
			data-action="close"
			data-ret="close"
		></i>

		<a class="m-act-main" :href="contentData.linkUrl" v-if="contentData.linkUrl">
			<!-- test data -->
			<!-- <img src="http://cms-bucket.nosdn.127.net/9d81114baedd44a299fbbcfa3d03acd420170918151925.png?imageView&thumbnail=190y120" alt=""> -->
			<img :src="contentData.imgUrl" :alt="contentData.text">
		</a>

		<div class="m-act-main" v-else>
			<img :src="contentData.imgUrl" :alt="contentData.text">
		</div>
	</div>
</template>

<script>
import { LS } from 'storage';
import md5 from 'blueimp-md5';

export default {
	name: 'PopActivity',
	mounted() {
		// 能唯一区分一个活动时，记录在本地，防止多次弹出相同的活动
		const contentData = this.contentData || {},
			linkUrl = contentData.linkUrl,
			imgUrl = contentData.imgUrl;

		if (linkUrl && imgUrl) {
			const temp = `${linkUrl}|${imgUrl}`;
			LS.set(`h5_activity_${md5(temp)}`, 1);
		}
	}
};
</script>
