<template>
	<!-- 徽章 -->
	<span class="m-badge" :class="`m-badge--${type}`">
		<slot></slot>
	</span>
</template>

<script>
export default {
	name: 'Badge',
	props: {
		// 类型
		type: {
			type: String,
			'default': 'normal'
		}
	}
};
</script>

<style lang="less">
@import '~base/styles/variable.less';

.m-badge {
	display: inline-block;
	min-width: 44/@rem;
	height: 14/@rem;
	padding: 0 5/@rem;
	box-sizing: border-box;
	text-align: center;
	border-radius: 4/@rem;
	font-size: 10/@rem;
	font-weight: 500;
	line-height: 14/@rem;
	margin-left: 8/@rem;

	&--primary {
		color: @darkGreen;
		background: @thinGreen;
	}
}
</style>
