<template>
	<div class="m-flexibet-tip-wrap">
		<h1 class="m-flexibet-tip-title">
			<i class="m-icon-flexibet">F</i>
			What is this?
		</h1>
		<p class="m-flexibet-tip">A Ticket wins if a certain number of the picked selections are correct. E.g. If a player chooses 5 out of 7 selections to be correct with odds of 15.00, then, the ticket will be fully paid on odds of 15.00 if any 5 or more selections out of the 7 picked selections are correct.</p>
	</div>
</template>

<script>
export default {
	data() {
		return {};
	}
};
</script>

<style lang="less">
@import '~base/styles/variable.less';
@import '~base/styles/icon.less';

.m-flexibet-tip-wrap {
	.m-flexibet-tip-title {
		font-size: 20/@rem;
		line-height: 20/@rem;
  		font-weight: bold;
		.m-icon-flexibet {
			display: inline-block;
			background: @midGreen;
			color: @white;
			position: relative;
			margin-right: 3/@rem;
			padding: 0 2/@rem;
			box-sizing: border-box;
			flex: 0 0 auto;
			font-size: 16/@rem;
			font-weight: bold;
			height: 20/@rem;
			line-height: 20/@rem;
			text-shadow: 0 1px 0 rgba(0, 0, 0, 0.5);
			&:after {
				position: absolute;
				top: 0;
				right: -2px;
				content: '';
				width: 0;
				height: 0;
				border-top: 8/@rem solid @midGreen;
				border-left: 1px solid @midGreen;
				border-right: 1px solid transparent;
				border-bottom: 8/@rem solid transparent;
			}
		}
	}
	.m-flexibet-tip {
		margin-top: 14/@rem;
		font-size: 16/@rem;
		line-height: 20/@rem;
	}
}
</style>
