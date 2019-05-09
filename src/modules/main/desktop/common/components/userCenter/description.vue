<template>
	<div class="m-fm-b-des"><em class="m-picon-arrow"></em><i class="m-icon--light"></i>
		<slot></slot>
	</div>
</template>

<script>
export default {
};
</script>

<style lang="less">
@import 'base/style/variable.less';
@import 'base/style/icon.less';

	.m-fm-b-des{
		font-size:14px;
		line-height:21px;
		padding-left:47px;
		position: relative;
		margin: 35px 15px 35px 22px;
		li{
			list-style: none;
			margin-bottom: 15px;
			padding-left:20px;
			em{
				display:inline-block;
				width: 20px;
				margin-left: -20px;
			}
		}
	}
	.m-picon-arrow{
	position: absolute;
	top:-2px;
	left: 33px;
	width:0;
	height:0;
	overflow: hidden;
	border-width: 22px 22px 0;
	border-color: @green transparent transparent;
	border-style:solid;
	transform-origin: left top;
	transform: rotate(135deg);
}
.m-icon--light{
	.m-icon-light();
	&::before{
		position: absolute;
		top:2px;
		left:5px;
		font-size:13px;
		line-height: 14px;
		color:@white;
	}
}
</style>

