<template>
	<div class="act-gift-gold">
		<span class="act-gift-gold-currency act-gift-gold-text">{{currency}}</span>
		<span class="act-gift-gold-price act-gift-gold-text">{{price}}</span>
	</div>
</template>
<script>
export default {
	props: {
		currency: String,
		price: String
	}
};
</script>
<style lang="less">
.act-gift-gold {
	position: relative;
	width: 152px;
	height: 60px;
	margin-left: -10px;
	line-height: 60px;
	
	border-radius: 4px;
	overflow: hidden;
	
	background-color: #fef3c0;
	background-image: url('./image/discount-gift.svg');
	background-size: 100%;
	font-size: 18px;
	.act-gift-gold-text {
		padding-left: 15px;
		color: #ecb639;
	}
	.act-gift-gold-currency{
		display: block;
		font-size: 12px;
		line-height: 16px;
		margin-top: 11px;
	}
	.act-gift-gold-price{
		display: block;
		font-size: 22px;
		line-height: 30px;
		font-weight: bold;
	}
}
</style>

