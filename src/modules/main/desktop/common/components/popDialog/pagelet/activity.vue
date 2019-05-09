<template lang="html">
	<div class="m-act-wrapper" v-if="contentData.imgUrl">
		<i
			class="m-icon-close"
			data-action="close"
			data-ret="close"
		></i>

		<a class="m-act-main" :href="contentData.linkUrl" v-if="contentData.linkUrl">
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
			LS.set(`pc_activity_${md5(temp)}`, 1);
		}
	}
};
</script>
