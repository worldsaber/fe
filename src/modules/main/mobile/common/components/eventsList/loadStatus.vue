<template>
<div class="event-league-loading-wrap">
	<div class="event-league-loading" v-if="loadStatus === 1"></div>
	<div class="event-league-loading-fail" v-if="loadStatus === 3">
		<p class="event-league-loading-fail-text">Data failed loading. Please reload.</p>
		<div class="event-league-loading-fail-btn" @click="reloadData">Reload</div>
	</div>
</div>
</template>
<script>
export default {
	props: {
		loadStatus: {
			type: Number,
			'default': 0  // 0 未尝试， 1 loading 2  done 3 fail
		}
	},
	methods: {
		reloadData() {
			this.$emit('reload');
		}
	}
};
</script>
<style lang="less">
@import '~base/styles/variable.less';
@import '~base/styles/icon.less';
.event-league-loading-wrap {
	position: relative;
	min-height: 180/@rem;
	text-align: center;
}
.event-league-loading{
	background: @white;
	top: 50%;
	left: 50%;
	position: absolute;
	margin-left: -15/@rem;
	margin-top: -15/@rem;
	.m-icon-loading-circle();
	animation: circles 1s infinite;
	animation-timing-function: linear;
	&:before{
		height: 30/@rem;
		width: 30/@rem;
		line-height: 1;
		font-size: 30/@rem;
		color: @midGray;
	}
}
.event-league-loading-fail{
	text-align: center;
	margin: 10/@rem 0;
	.m-icon-exclamation();
	&:before{
		display: block;
		font-size: 36/@rem;
		color: @midGray;
	}
}
.event-league-loading-fail-text{
	margin-top: 10/@rem;
	white-space: nowrap;
	word-break: keep-all;
	margin-bottom: 36/@rem;
	color: @darkGray;
}
.event-league-loading-fail-btn{
	color: @green;
	height: 36/@rem;
	line-height: 36/@rem;
	padding: 0 28/@rem;
	display: inline-block;
	border: 1px solid @green;
	border-radius: 3/@rem;
}
</style>

