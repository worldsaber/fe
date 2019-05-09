<template>
	<div class="m-ad-tips">
		<i class="m-icon-tips"></i>
		<slot>{{text}}</slot>
	</div>
</template>

<script>
export default {
	name: 'AdTips',
	props: {
		text: {
			type: String,
			'default': ''
		}
	}
};
</script>

<style lang="less" scoped>
@import "~base/styles/variable.less";
@import "~base/styles/icon.less";

.m-ad-tips {
	padding: 7/@rem 4/@rem;
	line-height: 14/@rem;
	background: fade(@midGreen, 10%);
	font-size: 12/@rem;
	color: @darkGreen;
	text-align: center;

	.m-icon-tips {
		margin-right: 6/@rem;
		.m-icon-light2();
		&:before {
			color: @green;
			font-size: 16/@rem;
		}
	}
}
</style>
