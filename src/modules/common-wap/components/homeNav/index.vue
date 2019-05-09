<template>
	<span class="m-home-icon" @click="jumpToHome">Home</span>
</template>
<script>
	import { pagePath } from 'config/pageConfig';

	export default{
		name: 'homeNav',
		methods: {
			jumpToHome() {
				window.location.href = pagePath.home;
			}
		}
	};
</script>
<style lang="less">
	@import 'base/styles/variable.less';
	@import 'base/styles/mixin.less';
	@import "base/styles/icon.less";
	.m-home-icon{
		.m-icon-home();
		color: @dark;
		text-align: right;
		font-size: 14/@rem;
		display: inline-block;
		width: 49%;
		&:before{
			padding-right: 4/@rem;
			color: @dark;
			height: 24/@rem;
			width: 24/@rem;
			font-size: 16/@rem;
			display: inline-block;
		}
	}
</style>
