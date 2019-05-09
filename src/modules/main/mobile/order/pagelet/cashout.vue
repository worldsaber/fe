<template>
<div class="order-cashout-wrapper">
	<top-nav-bar/>
	<cashout/>
</div>
</template>

<script>
import topNavBar from 'components/navbar';
import Cashout from 'components/cashout/index.vue';

export default {
	components: {
		topNavBar,
		Cashout
	}
};
</script>

<style lang="less">
@import "base/styles/variable.less";

	.order-cashout-wrapper {
		min-height: 100vh;
		background: #353a45;
		.m-cashout {
			padding-top: 10/@rem;
		}
	}
</style>
