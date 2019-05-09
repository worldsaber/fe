<template lang="html">
	<div class="s-page">
		<slot name="main-pagelet"></slot>
		<!-- <GoTop v-if="showGoTop" /> -->
	</div>
</template>

<script>
import GoTop from '../goTop/index.vue';

export default {
	name: 'Page',
	componentName: 'Page',
	components: {
		GoTop
	},
	props: {
		showGoTop: {
			type: Boolean,
			'default': true
		}
	}
};
</script>

<style lang="less">
@media print{
	.s-page-header,.s-page-bottom{
		display: none !important;
	}
}
.s-page{
	min-height: 100%;
	min-height: 100vh;

	.s-page__main{
		min-height: 80%;
		min-height: 80vh;
		height: 80%;
	}
}
</style>
