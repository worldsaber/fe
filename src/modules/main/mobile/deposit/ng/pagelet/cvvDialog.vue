<template>
	<div>
		<div class="cvv-img-container"><img src="../img/cvv-example.svg"></div>
		<p class="cvv-desc">The CVV is the three digit security code at the back of your card.</p>
	</div>
</template>

<script>
export default {
	data() {
		return {

		};
	}
};
</script>

<style lang="less">
@import "~base/styles/variable.less";

.deposit-dialog-wap {
	.cvv-img-container {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-bottom: 18/@rem; 
	}
	.cvv-desc {
		font-size: 16px;
  		line-height: 1.5;
  		text-align: left;
  		color: @dark;
	}
}
</style>
