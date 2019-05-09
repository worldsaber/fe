<template>
  	<div class="m-footer-desc">
		<h3><i class="m-icon"></i>Terms & Conditions</h3>
		<ol>
			<li>Every customer can only collect a maximum of 3 daily Cash Gifts. The value of each Cash Gift varies based on luck.</li>
			<li>Every customer can collect 1 Cash Gift using 1 Shared Link. After collecting a Cash Gift, it will be sent to the Account associated with the Phone Number entered in the field. (same Phone Number and same Device will be regarded as the same customer)</li>
			<li>Every Shared Link contains 20 Cash Gifts.</li>
			<li>Only 1 Cash Gift can be used per each Betslip. Cash Gifts are not Balance and cannot be withdrawn, instead, they can be used to place bets.</li>
			<li>The collected Cash Gift can be used in the Betslip after making at least 1 selection and entering at least a minimum Stake of {{showCurrency}} {{minStake}}.</li>
			<li>All rights of a final interpretation belong to SportyBet.</li>
		</ol>
	</div>
</template>

<script>
import { showCurrency } from 'config/currencyConfig';

export default {
	name: 'FooterDesc',
	data () {
		return {
			showCurrency,
			minStake: window.sportsCfg.min
		};
	}
};
</script>

<style lang="less">
@import "base/styles/variable.less";
@import "base/styles/icon.less";

.m-footer-desc {
	margin-top: 78/@rem;
	padding: 20/@rem 10/@rem;
	line-height: normal;
	color: @fogGray;

	& > h3 {
		font-size: 14/@rem;
		font-weight: bold;

		.m-icon {
			margin-right: 4/@rem;
			.m-icon-light2();

			&:before {
				color: @lightGreen;
			}
		}
	}

	& > ol {
		margin-top: 10/@rem;
		padding-left: 20/@rem;
		list-style: decimal;
		font-size: 12/@rem;
		font-weight: normal;
		opacity: 0.8;
	}
}
</style>
