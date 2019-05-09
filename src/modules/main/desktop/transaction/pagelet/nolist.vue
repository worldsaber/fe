<template lang="html">
	<div>
		<div class="m-list-none">
			<span class="no-list-txt"><i class="m-icon--pageques"></i>No Records Found.</span>
		</div>
	</div>
</template>

<script>
export default {
};
</script>

<style lang="less">
@import 'base/style/icon.less';
@import 'base/style/variable.less';

.m-list-none{
	padding:203px 0 290px;
	text-align: center;
}
.no-list-txt{
	font-size: 16px;
	color: @darkGray;
	.m-icon--pageques{
		.m-icon-pageques();
		display: inline-block;
		vertical-align: middle;
		margin-right: 10px;
		&::before{
			font-size: 23px;
		}
	}
}
</style>
