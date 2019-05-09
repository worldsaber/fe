<template>
<div class="m-load-status-wrap" v-show="isShow">
	<div class="m-load-status" v-if="loadStatus === 1"></div>
	<div class="m-load-status-fail" v-if="loadStatus === 3">
		<p class="m-load-status-fail-text">Data failed loading.</p>
		<div class="m-load-status-fail-btn" @click="reloadData">Reload</div>
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
	computed: {
		isShow() {
			return [1, 3].includes(this.loadStatus);
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
.m-load-status-wrap {
	position: relative;
	min-height: 144/@rem;
	text-align: center;
	margin: 6/@rem 0;
}
.m-load-status{
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
		font-size: 32/@rem;
		color: @midGray;
	}
}
.m-load-status-fail{
	padding-top: 20/@rem;
}
.m-load-status-fail-text{
	margin-top: 10/@rem;
	white-space: nowrap;
	word-break: keep-all;
	margin-bottom: 16/@rem;
	line-height: 42/@rem;
	color: @darkGray;
	.m-icon-exclamation();
	&:before{
		display: inline-block;
		vertical-align: middle;
		font-size: 36/@rem;
		line-height: 42/@rem;
		padding-right: 15/@rem;
		color: @midGray;
	}
}
.m-load-status-fail-btn{
	color: @green;
	height: 32/@rem;
	line-height: 32/@rem;
	padding: 0 18/@rem;
	display: inline-block;
	border: 1px solid @green;
	border-radius: 3/@rem;
}
</style>

