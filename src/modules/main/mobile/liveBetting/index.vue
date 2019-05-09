<template>
<!-- 为了调试方便外面必须有一个元素 -->
<div class="app-container">
	<Layout :isHaveRightPagelet="true" :isNeedScroll="true">
		<router-view></router-view>
	</Layout>
</div>
</template>

<script>
import Layout from 'components/layout/main.vue';
import { mapActions } from 'vuex';

export default {
	name: 'index',
	components: {
		Layout
	},
	created() {
		this.getOddsBoost();
	},
	methods: {
		...mapActions('oddsBoost', [
			'getOddsBoost'
		])
	}
};
</script>

<style lang="less">
@import 'base/styles/variable.less';
.page-content,
.app-container,
.m-main {
	height: 100%;
	overflow: hidden;
	position: relative;
}

html, body {
	height: 100%;
	position: relative;
	background-color: @darker !important;
}
</style>
