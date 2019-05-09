<template>
  	<a class="m-logo" :href="homeLink">
		<i class="m-icon-logo"></i>
	</a>
</template>

<script>
import { pagePath } from 'config/pageConfig';

export default {
	name: 'HeaderLogo',
	computed: {
		homeLink () {
			return pagePath.home;
		}
	}
};
</script>

<style lang="less" scoped>
@import "base/styles/variable.less";
@import 'base/styles/icon.less';

.m-logo {
	display: block;
	position: absolute;
	top: 12/@rem;
	left: 20/@rem;

	.m-icon-logo {
		display: block;

		.m-icon-sportbet();
		&:before {
			color: @white;
			font-size: 22/@rem;
		}
	}
}
</style>

