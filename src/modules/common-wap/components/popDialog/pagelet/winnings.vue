<template lang="html">
	<div class="m-winning-wrapper">
		<div class="m-winning-content">
			<div class="m-pop-header">
				<i class="m-icon-close" data-action="close" data-ret="close"></i>
			</div>
			<div class="m-pop-main">
				<template v-if="contentData.percent">
					<div class="m-share-title">You got more winnings <br /> than <span class="m-percent-number">{{contentData.percent}}%</span> of all users!</div>
				</template>

				<div class="m-money-wrapper" v-if="contentData.showWinnings">
					<div class="m-pop-title">YOU WON</div>
					<div class="m-money">{{showCurrency}}{{contentData.showWinnings}}</div>

				</div>

				<!-- <div v-if="contentData.bizType===4">
					<img src="../image/bingo.png" class="bingo">
				</div> -->

				<div class="m-bg-wrapper">
					<img src="../image/winBg.png">
				</div>

				<div class="m-winning-footer">
					<!-- <div class="bingo-money" v-if="contentData.bizType===4">{{showCurrency}}{{contentData.showWinnings}}</div> -->
					<div class="m-desc-wrapper">
						<div>From {{contentData.sportType}} {{contentData.shortId?`Ticket ID ${contentData.shortId}`:''}}</div>
						<div v-if="contentData.roundNo">Round No. {{contentData.roundNo}}</div>
					</div>
					<div class="m-btn-wrapper">
						<af-button
							extraType="text"
							data-action="close"
							data-ret="close"
							@click="goDetail"
						>Details</af-button>
						<af-button
							extraType="primary"
							data-action="close"
							data-ret="close"
							@click="popUp"
						>{{shareText}}</af-button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>


<script>
import 'packages/button';
import commonEvent from 'config/eventConfig/commonEvent';
import { EventBus } from 'kernel/js/eventBus.js';
import { userCenterUrl } from 'config/mycenter/dataConfig';
import { pagePath } from 'config/pageConfig';
import { showCurrency } from 'config/currencyConfig';
import sharePop from './sharePop.vue';

let popDialog = null;
export default {
	name: 'WinningsTips',
	// props: ['contentData'],
	components: {
		sharePop
	},
	data() {
		return {
			country: window.country
		};
	},
	computed: {
		showCurrency() {
			return showCurrency;
		},
		shareText() {
			// bingo
			if (this.contentData.bizType === 4) {
				return 'Share';
			}
			return 'Show Off';
		}
	},
	created () {
		// 更新余额
		EventBus.$emit(commonEvent.UPDATE_ACCOUNT_BALANCE);
	},
	methods: {
		goDetail() {
			if (this.contentData && (this.contentData.sportType || '').toLowerCase() === 'jackpot') {
				window.location.href = `${userCenterUrl.jackpotOrder}?isSettled=1`;
			} else if (this.contentData && this.contentData.bizType === 4) {
				const router = window.v_router;
				if (router && router.options && router.options.name === 'bingo') {
					if (router.currentRoute.name === 'detail') {
						router.replace({
							name: 'detail',
							params: {
								id: this.contentData.roundId
							},
							query: {
								status: 4
							}
						});
					} else {
						router.push({
							name: 'detail',
							params: {
								id: this.contentData.roundId
							},
							query: {
								status: 4
							}
						});
					}
				} else {
					location.href = `${pagePath.sportybingo}/detail/${this.contentData.roundId}?status=4`;
				}
			} else {
				window.location.href = `${userCenterUrl.sportOrder}?isSettled=1`;
			}
		},

		shareSportyBingo () {
			const { bizType } = this.contentData;

			popDialog = this.$dialog({
				title: null,
				'class': 'm-win-share',
				content: sharePop,
				contentData: {
					shareText: 'Try out Bingo! Bingo! Your bets count the most at SportyBet',
					shareUrl: `${location.origin}/${window.country}/m/sportybingo`,
					bizType
				},
				button: []
			}).onBtnClick(btnType => {
				popDialog.close();
				popDialog = null;
			});
		},

		shareWinningOrder () {
			const { orderId, showWinnings, percent } = this.contentData;

			popDialog = this.$dialog({
				title: null,
				'class': 'm-win-share',
				content: sharePop,
				contentData: {
					orderId,
					percent,
					winnings: showWinnings,
					shareText: 'I\'d like to give you Cash Gift and share my joy with you! Click to collect Gift'
				},
				button: []
			})
			.onBtnClick(btnType => {
				popDialog.close();
				popDialog = null;
			});
		},

		popUp () {
			const { bizType } = this.contentData;

			if (bizType === 4) {
				// Sporty Bingo
				this.shareSportyBingo();
			} else {
				// winning order
				this.shareWinningOrder();
			}
		}
	}
};
</script>
