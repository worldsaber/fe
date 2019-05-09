<template>
	<a class="m-menu-item" :href="linkUrl">
		<slot>{{text}}</slot>
	</a>
</template>

<script>
export default {
	name: 'MenuItem',
	props: {
		text: {
			type: String,
			'default': ''
		},
		linkUrl: {
			type: String,
			'default': ''
		}
	}
};
</script>

<style lang="less">
@import "base/styles/variable.less";
@import "base/styles/mixin.less";

.m-menu-item {
	font-size: 14/@rem;
	font-weight: 500;
	color: @darkGreen;
	display: block;
	float: left;
	width: 50%;
	height: 38/@rem;
	line-height: 38/@rem;
	text-align: left;
	border-radius: 2px;
	background-color: #f2f6f3;
	margin-bottom: 4/@rem;
	padding: 0 13/@rem;
	box-shadow: -4/@rem 0px 0px 0px @white inset;
	box-sizing: border-box;
	text-transform: capitalize;
	.ellipsis();
}
</style>
