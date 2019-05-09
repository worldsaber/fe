<template>
	<div class="coin-success-dialog">
		<div class="success-bg-wrap">
			<img class="success-bg" src="../image/sucBg.png">
			<div class="success-text">Congratulations!</div>
		</div>
		<p class="stake-text">{{currency}} {{contentData.stake}}</p>
		<p class="sportycoins-text">SportyCoins</p>
		<p class="success-message">have been transferred to your balance.</p>
		<div class="confirm-btn" @click="close">OK</div>
	</div>
</template>

<script>

export default {
	data() {
		return {
			currency: window.currency
		};
	},
	methods: {
		close() {
			this.$dialog();
		}
	}
};
</script>

<style lang="less">
@import '~base/styles/variable.less';

.coin-success-dialog {
	padding-bottom: 20/@rem;
	text-align: center;
	.success-bg-wrap {
		position: relative;
		.success-bg {
			width: 100%;
		}
		.success-text {
			position: absolute;
			top: 16/@rem;
			left: 0;
			width: 100%;
			font-size: 14/@rem;
			line-height: 16/@rem;
			text-align: center;
			text-shadow: 0 2/@rem 4/@rem rgba(0, 0, 0, 0.5);
			font-weight: bold;
			color: @white;
		}
	}
	.stake-text {
		margin-top: 9/@rem;
		text-align: center;
		font-size: 20/@rem;
		line-height: 24/@rem;
		font-weight: bold;
		color: #cf7a25;
	}
	.sportycoins-text {
		text-align: center;
		font-size: 12/@rem;
		line-height: 14/@rem;
		color: @darkGray;
	}
	.success-message {
		margin-top: 11/@rem;
		text-align: center;
		font-size: 12/@rem;
		line-height: 14/@rem;
		color: @darker;
	}
	.confirm-btn {
		margin-top: 11/@rem;
		display: inline-block;
		width: 80/@rem;
		line-height: 32/@rem;
		color: @green;
		font-size: 12/@rem;
		text-align: center;
		border: 1px solid @green;
		border-radius: 2/@rem;
	}
}
</style>
