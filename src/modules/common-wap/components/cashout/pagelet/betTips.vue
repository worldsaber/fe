<template lang="html">
  <div class="m-bet-tips">
  	<p>{{showTips}}</p>
	<div class="m-btn-wrapper">
		<af-Button
			@click="handleClick"
		>OK</af-Button>
	</div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

import 'packages/button';

import * as mutationTypes from 'store/cashout/mutationTypes';
import { EventBus } from 'kernel/js/eventBus.js';
import cashoutEvent from 'config/cashout/eventCfg';

export default {
	name: 'CashoutTips',

	props: {
		showTips: {
			type: String,
			required: true
		},
		betId: {
			type: [String, Number],
			required: true
		},
		shouldDeleteBet: {
			type: Boolean,
			'default': true
		}
	},

	methods: {
		...mapMutations('cashout', {
			removeBet: mutationTypes.REMOVEBETITEM
		}),

		handleClick() {
			if (this.shouldDeleteBet) {
				this.removeBet(this.betId);
				EventBus.$emit(cashoutEvent.UPDATE_CASHOUT_COUNT);
			} else {
				this.$emit('close-tips');
			}
		}
	}
};
</script>
