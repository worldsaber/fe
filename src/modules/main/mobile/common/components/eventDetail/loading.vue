<template>
	<div class="event-global-loading">
		<div class="loading-circle"></div>
		<div class="loading-text">Loading</div>
	</div>
</template>
<style lang="less">
@import 'base/styles/variable.less';
@import 'base/styles/icon.less';

.event-global-loading{
	position: fixed;
	top: 50%;
	left: 50%;
	margin: -64/@rem 0 0 -64/@rem;

	width: 128/@rem;
	height: 128/@rem;
	border-radius: 4/@rem;
	background: rgba(27, 30, 37, 0.9);
	color: #FFF;
	z-index: 1000;
	.loading-circle{
		height: 30/@rem;
		width: 30/@rem;
		margin: 40/@rem auto 10/@rem;

		.m-icon-loading-circle();
		animation: circles 1s infinite;
		animation-timing-function: linear;
		&:before{
			height: 30/@rem;
			width: 30/@rem;
			line-height: 1;
			font-size: 32/@rem;
			color: #32ce62;
		}
	}
	.loading-text{
		font-size: 14/@rem;
		text-align: center;
		margin-top: 20/@rem;
	}
}
</style>

