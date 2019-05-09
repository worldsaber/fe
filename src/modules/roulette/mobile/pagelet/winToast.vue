<template>
	<div class="m-win-toast">
		<div class="m-toast-body">
			<div class="m-toast-title">Congratulations! You Won!</div>
			<div class="m-toast-text">+{{currency}} {{contentData.winningAmount}}</div>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			currency: window.currency
		};
	},
	created() {
		console.log(this);
	},
};
</script>

<style lang="less">
@import '~base/styles/variable.less';

.m-win-toast {	
	.m-toast-body {
		position: absolute;
		left: 0;
		bottom: 33/@rem;
		width: 100%;
		color: @white;
		font-weight: 600;
		.m-toast-title {
			line-height: 16/@rem;
			margin-bottom: 10/@rem;
			font-size: 14/@rem;
			text-align: center;
		}
		.m-toast-text {
			line-height: 20/@rem;
			font-size: 20/@rem;
			text-align: center;
		}
	}
}
</style>
	