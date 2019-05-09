<template>
	<div class="share-cancel-wrap">
		<i
			class="icon-close"
			data-action="close"
			data-ret="closeBtn"
		></i>
		<div class="share-cancel-title">{{title}}</div>
		<div class="share-cancel-content">{{content}}</div>
		<!-- <i class="m-icon-fb"></i>-->
		<div class="share-cancel-btn" data-action="btn" data-ret="share">Share to WIN NOW!</div>
	</div>
</template>
<script>

export default {
	computed: {
		config() {
			return this.contentData;
		},
		title() {
			const line = this.config.title || {};
			return line.text || 'What?! Giving up on KES 5,000 & a FREE BET?';
		},
		content() {
			const line = this.config.content || {};
			return line.text || 'To participate, share your prediction first!';
		}
	}
};
</script>
<style lang="less">
@import 'base/styles/variable.less';
@import 'base/styles/icon.less';

.share-cancel-wrap{
	text-align: center;
	padding: 15/@rem 0 20/@rem;
	line-height: 1.3;
	.icon-close {
		position: absolute;
		top: 10/@rem;
		right: 10/@rem;
		line-height: 16/@rem;
		.m-icon-close();
		&::before {
			font-size: 16/@rem;
		}
	}
}
.share-cancel-title{
	font-size: 16/@rem;
	font-weight: bold;
}
.share-cancel-content{
	margin: 10/@rem 0 20/@rem;
}
.share-cancel-btn{
	width: 180/@rem;
	height: 40/@rem;
	line-height: 40/@rem;
	border-radius: 20/@rem;
	padding: 0 15/@rem;
	background-color: #2036a7;
	color: #FFF;
	margin: 0 auto;
	.m-icon-fb{
		display: inline-block;
		vertical-align: middle;
		width: 20/@rem;
		height: 20/@rem;
		border-radius: 4/@rem;
		background: #FFF;
		margin-right: 16/@rem;
		cursor: pointer;
		.m-icon-facebook();

		&:before {
			font-size: 20/@rem;
			color: #2036a7;
			line-height: 1;
			display: inline-block;
			vertical-align: top;
			margin-top: 3/@rem;
			margin-left: 2/@rem;
		}
	}
}
</style>
