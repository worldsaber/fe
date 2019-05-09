<template>
	<div class="m-no-data-tips">
		<div class="m-icon-message"></div>
		<p class="m-desc">
			<slot>No data available</slot>
		</p>
	</div>
</template>

<script>
export default {
	name: 'NoDataTips'
};
</script>

<style lang="less" scoped>
@import '~base/styles/variable.less';
@import 'base/styles/icon.less';

.m-no-data-tips {
	margin: 57/@rem 0 52/@rem;
	text-align: center;

	.m-icon-message {
		.m-icon-exclamation();

		&:before {
			font-size: 32/@rem;
			color: @darkGray;
			line-height: 1;
		}
	}

	.m-desc {
		margin-top: 18/@rem;
		font-size: 14/@rem;
		color: @darkGray;
		line-height: 19/@rem;
	}
}
</style>
