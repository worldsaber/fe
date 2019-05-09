<template lang="html">
	<div>
		<div class="m-gift-list-none">
			<p><i class="m-icon--cup"></i>
				<template v-if="classify == 1">Currently no available gifts.</template>
				<template v-else>Currently no used / expired gifts.</template>
			</p>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		classify: {
			type: Number,
			'default': 1
		}
	}
};
</script>

<style lang="less">
@import 'base/style/variable.less';
@import 'base/style/icon.less';

.m-gift-list-none{
	padding:183px 0 120px;
	text-align: center;
	height: 30px;
	line-height: 30px;
	text-align: center;
	.m-icon--cup{
		.m-icon-cup();
		&::before{
			font-size: 30px;
		}
	}
	>p{
			font-size: 16px;
			color: @darkGray;
		}
}
</style>
