<template lang="html">
	<div class="m-list-none">
		<span class="no-list-txt"><i class="m-icon--pageques"></i>No Records Found.</span>
		<template v-if="!isHistory">
			<div class="no-list-txt-history">Show only histories in last 6 months</div>
			<div class="no-list-gohistory" @click="goHistory">View older histories ></div>
		</template>
	</div>
</template>

<script>
export default {
	props: {
		isHistory: {
			type: Boolean,
			'default': false
		}
	},
	methods: {
		goHistory() {
			this.$emit('goHistory');
		}
	}
};
</script>

<style lang="less">
@import 'base/styles/icon.less';
@import 'base/styles/variable.less';

.m-list-none{
	padding: 150/@rem 0 0;
	text-align: center;
}
.no-list-txt{
	font-size: 16/@rem;
	color: @darkGray;
	.m-icon--pageques{
		display: block;
		margin: 0 auto 13/@rem;
		height: 46/@rem;
		line-height: 46/@rem;
		.m-icon-pageques();
		&::before{
			color: @midGray;
			font-size: 46/@rem;
		}
	}
}
.no-list-txt-history {
	margin-top: 12/@rem;
	text-align: center;
	font-size: 12/@rem;
	line-height: 14/@rem;
	color: @darkGray;
}
.no-list-gohistory {
	margin-top: 2/@rem;
	font-size: 12/@rem;
	line-height: 14/@rem;
	text-align: center;
	color: @linkBlue;
}
</style>
