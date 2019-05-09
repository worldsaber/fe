<template>
	<div class="deposit-rules">
		<div v-for="(line,i) in lines" :key="i">
			<!-- <span>1. </span> -->
			<div>{{line}}</div>
		</div>
		<!-- <div><span>2. </span><div>Maximum per transaction is {{currency}} {{maxAmount}} - you can deposit up to {{currency}} {{maxAmount}} in one transaction.</div></div>
		<div><span>3. </span><div>We do not share your payment information. It is used for transaction verification only.</div></div>
		<div><span>4. </span><div>If you have any recharge issues, please contact customer service. Trying to use multiple cards/bank accounts for multiple deposits may cause error.</div></div> -->
	</div>
</template>

<script>
import { formatNumber } from 'utils';

export default {
	name: 'DepositRules',
	data () {
		return {
			minAmount: formatNumber(+window.depositCfg.min, 2),
			maxAmount: formatNumber(+window.depositCfg.max, 2),
			currency: window.currency
		};
	},
	props: ['lines']
};
</script>

<style lang="less">
@import "~base/styles/variable.less";

.deposit-rules {
	color: @darkGray;
	text-align: left;
	font-size: 12px;
	line-height: 1.33;
	margin: 10/@rem 0;
	div {
		display: flex;
		flex-direction: row;
	}
	span {
		width: 16px;
		flex: 0 0 auto;
	}
	p {
		flex: 1 1 auto;
	}
}
</style>
