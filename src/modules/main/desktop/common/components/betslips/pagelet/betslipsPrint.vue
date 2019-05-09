<template lang="html">
	<div class="m-betslip-print">
		<div class="m-baseInfo-wrapper">
			<!-- <template v-if="shareCode"> -->
				<div class="m-code">
					<span class="m-label">Sharing Code</span>
					<span class="m-value">{{shareCode}}</span>
				</div>
			<!-- </template> -->

			<div class="m-date">
				<span>{{getShowDate}}</span>
			</div>
		</div>

		<div
			v-for="(item, index) in betslips"
			class="m-bet-wrapper"
		>
			<div :class="[
				'm-bet-item',
				{
					'm-border': index !== betslips.length - 1
				}
				]"
			>
				<div class="m-t-s">
					<span
						v-if="item.gameId"
						class="m-l-m"
					>{{item.gameId}}</span>
					<span
						v-if="item.estimateStartTime"
					>{{getEventDate(item.estimateStartTime)}}</span>
				</div>

				<div class="m-t-l">
					<span>{{getAgainst(item)}}</span>
				</div>

				<div class="m-t-m">
					<span class="m-label m-l-m">{{getEventType(item)}}</span>
					<span>{{item.outcomeInfo.desc}}</span>
				</div>
			</div>
		</div>

		<div class="m-desc-wrapper">
			<p>Please note: this is only bet slip reservation. Your bet is valid only when the bet is placed online or when authorized in a betting shop. </p>
			<p>SportyBet Management Team. </p>
		</div>
	</div>

</template>

<script>
import { mapState } from 'vuex';

import dateFormat from 'kernel/js/dateFormat';

export default {
	name: 'BetslipPrint',
	computed: {
		...mapState('betslip', [
			'betCodeInfo',
			'betslips'
		]),
		shareCode() {
			const betCodeInfo = this.betCodeInfo || {};

			return betCodeInfo.shareCode || '';
		},
		getShowDate() {
			const now = +Date.now();
			return dateFormat.format(now, 'DD/MM/YYYY HH:mm');
		}
	},
	methods: {
		getEventDate(date = '') {
			return dateFormat.format(date, 'DD/MM/YYYY HH:mm');
		},
		getAgainst(item = {}) {
			return `${item.home} - ${item.away}`;
		},
		getEventType(item = {}) {
			if (item.marketInfo.product === 3) {
				return 'prematch';
			}

			return 'live';
		}
	}
};
</script>

<style media="print" lang="less">
	@import '../style/print.less';
</style>
