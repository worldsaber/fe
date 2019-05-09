<template lang="html">
	<div class="m-uc-wrapper">
		<slot></slot>
	</div>
</template>
<script>
	export default{
	};
</script>
<style lang="less">
@import 'base/style/variable.less';

.m-uc-wrapper {
	color:@dark;
	padding: 0 8px 10px;
	min-height: 696px;
	box-sizing: border-box;
	margin-left:19px;
	background-color: @white;
}

</style>
