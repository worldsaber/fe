<template>
	<div class="faq-wrap">
		<div class="faq-condition">FAQ</div>
		<div class="faq-text">
			<span class='no'>1.</span> 
			<div class="content">
				<div class="title">What is SportyCoins?</div>
				<div class="answer">SportyCoins are virtual money that we offer our customers through promotions, and can be converted to real money when meeting certain requirements.</div>
			</div>
		</div>
		<div class="faq-text">
			<span class='no'>2.</span> 
			<div class="content">
				<div class="title">How do I get more SportyCoins?</div>
				<div class="answer">Bet with your SportyCoins to accumulate more SportyCoins.</div>
			</div>
		</div><div class="faq-text">
			<span class='no'>3.</span> 
			<div class="content">
				<div class="title">How much Real Money can I get after completing the requirements?</div>
				<div class="answer">All your SportyCoins will be converted to balance <span class="em">automatically</span> after completing all requirements. The conversion rate between SportyCoins and Real Money is 1:1.</div>
			</div>
		</div>
	</div>
</template>
<script>
export default {

};
</script>

<style lang="less">
@import 'base/styles/variable.less';

.faq-wrap{
	color: #1b1e25;
	margin: 40/@rem 0;
	.faq-condition{
		font-weight: bold;
		font-size: 24/@rem;
		margin: 20/@rem 0;
	}
	.faq-text{
		position: relative;
		font-size: 14/@rem;
		line-height: 1.3;
		margin: 20/@rem 0;
		padding-left: 15/@rem;
		// text-align: justify;
		.title{
			font-size: 16/@rem;
			font-weight: bold;
		}
		.no{
			position: absolute;
			left: 0;
			font-weight: bold;
			font-size: 16/@rem;
		}
		.answer{
			margin-top: 10/@rem;
		}
		.em{
			color: #7b0911;
		}
	}
}
</style>
