<template>
	<div class="terms-wrap">
		<div class="term-condition">T&C</div>
		<p class="term-condition-text"><span class='no'>1.</span> SportyCoins can be used for “Real Sports” Betting (Singles or Multiples), but cannot be used for “Virtuals”, Sporty Bingo, Roulette or any other games.</p>
		<p class="term-condition-text"><span class='no'>2.</span> SportyCoins can be converted to real money once the requirements of each promotion are completed.</p>
		<p class="term-condition-text"><span class='no'>3.</span> Only SportyCoins from the same promotion can be hold to at a time. To claim SportyCoins from different promotions, SportyCoins from a previous promotion will have to be given up.</p>
		<p class="term-condition-text"><span class='no'>4.</span> All SportyCoins have an expiry date. All requirements must be completed before that date, otherwise, the number of owned SportyCoins for that promotion will be reset to 0 and the customer won’t be able to take part in the same challenge.</p>
		<p class="term-condition-text"><span class='no'>5.</span> SportyBet may reclaim any SportyCoins amount or increased payments that have been wrongly awarded.</p>
		<p class="term-condition-text"><span class='no'>6.</span> All customer offers are limited to one per person. If SportyBet has reasonable grounds to suspect that the bonus or offer is being claimed by or for the benefit of the same person more than once, or by a group of people, then it may withdraw the availability of any offer or all offers to that customer or group of customers and/or void any bet funded by the bonus or offer and remove any winnings from such bet.</p>
		<p class="term-condition-text"><span class='no'>7.</span> SportyBet may, at any time, make minor amendments to this promotion to correct typographical errors or to improve on clarity or customer experience and may cancel this promotion for legal or regulatory reasons.</p>
	</div>
</template>
<script>
export default {

};
</script>

<style lang="less">
@import 'base/styles/variable.less';

.terms-wrap{
	color: #1b1e25;

	.term-condition{
		font-weight: bold;
		font-size: 24/@rem;
		margin: 20/@rem 0;
	}
	.term-condition-text{
		position: relative;
		font-size: 14/@rem;
		line-height: 1.3;
		margin: 20/@rem 0;
		padding-left: 15/@rem;
		// text-align: justify;
		.no{
			position: absolute;
			left: 0;
		}
	}
}
</style>
