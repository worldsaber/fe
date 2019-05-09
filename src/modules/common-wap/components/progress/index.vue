<template>
<div class="m-progress">
	<div class="m-progress-inner-bar" :style="{
		width: `${percentage}%`
	}"></div>
</div>
</template>

<script>
export default {
	name: 'BingoProgress',
	props: {
		// 百分比
		percentage: {
			type: [String, Number],
			'default': 0
		}
	}
};
</script>

<style lang="less">
@import 'base/styles/variable.less';

.m-progress {
	background: @midGray;
	border-radius: 4.5/@rem;
	height: 9/@rem;
	overflow: hidden;

	.m-progress-inner-bar {
		height: 100%;
		border-radius: 4.5/@rem;
		background-color: #4bdb4d;
		background-image: linear-gradient(to right, #4bdb4d, #009321);
	}
}
</style>
