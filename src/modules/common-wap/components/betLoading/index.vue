<template>
	<!-- 显示在中间的loading状态 -->
	<div class="m-bet-loading" @click.stop="noop">
		<div>
			<em class="loading-icon"></em>
			<div>loading</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'BetLoading',
	methods: {
		noop(e) {
			this.$emit('click', e);
		}
	}
};
</script>

<style lang="less">
@import '~base/styles/variable.less';
@import '~base/styles/animate.less';
@import 'base/styles/icon.less';

.m-bet-loading{
	position: absolute;
	z-index: 222;
	width: 100%;
	height: 100%;
	top: 0px;
	left: 0px;
	>div{
		height: 128/@rem;
		width: 128/@rem;
		overflow: hidden;
		text-align: center;
		position: absolute;
		top: 50%;
		left: 50%;
		margin-left: -64/@rem;
		margin-top: -64/@rem;
		background-color:@blueBlack;
		opacity: .9;
		font-size: 14/@rem;
		color: @white;
		padding-top: 30/@rem;
		box-sizing: border-box;
		border-radius: 5/@rem;
		.loading-icon{
			.m-icon-loading-circle();
			animation: circles 1s infinite;
			animation-timing-function: linear;
			height: 30/@rem;
			width: 30/@rem;
			display: inline-block;
			&:before{
				height: 2.5rem;
				line-height: 1;
				display: block;
				color: @midGreen;
				font-size:30/@rem;
			}
			&+div{
				margin-top: 10/@rem;
			}
		}
	}
}
</style>
