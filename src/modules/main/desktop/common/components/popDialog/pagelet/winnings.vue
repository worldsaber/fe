<template lang="html">
	<div class="m-winning-wrapper">
		<div class="m-pop-header">
			<!-- <span>Congratulations!</span> -->
			<i
				class="m-icon-close"
				data-action="close"
				data-ret="close"
			></i>
		</div>
		<div class="m-pop-main">
			<!-- <div class="m-text-main">WINNING</div> -->
			<div class="m-money-wrapper" v-if="contentData.showWinnings">
				<div class="m-currency">{{showCurrency}}</div>
				<div class="m-money">{{contentData.showWinnings}}</div>
			</div>

			<!-- <div class="m-image-wrapper">
				<img src="../image/winningImg@2x.png" alt="">
			</div> -->
		</div>

		<div class="m-pop-bottom">
			<div class="m-desc-wrapper">
				<span>From {{contentData.sportType}} ／Ticket ID {{contentData.shortId}}</span>
			</div>

			<div class="m-btn-wrapper">
				<af-Button
					extraType="text"
					data-action="close"
					data-ret="close"
					@click="goDetail"
				>Details</af-Button>
			</div>
		</div>
	</div>
</template>

<script>
import 'packages/button';
import { EventBus } from 'kernel/js/eventBus.js';

import commonEvent from 'config/eventConfig/commonEvent';
import { pushBetUrl } from 'config/order/userCenterConfig';
import { getShowCurrency } from 'config/currencyConfig';

export default {
	name: 'WinningsTips',

	computed: {
		showCurrency() {
			return getShowCurrency();
		}
	},
	methods: {
		goDetail() {
			const contentData = this.contentData || {},
				type = contentData.sportType || 'sport';
			window.open(pushBetUrl[type], '_blank');
		}
	},
	mounted() {
		EventBus.$emit(commonEvent.UPDATE_ACCOUNT_BALANCE);
	}
};
</script>
