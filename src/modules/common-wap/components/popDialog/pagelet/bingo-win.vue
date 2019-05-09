<template lang="html">
	<div class="bingo-winning-wrapper">
		<div class="m-pop-header">
			<i class="m-icon-close" data-action="close" data-ret="close"></i>
		</div>
		<div class="bingo-winning-background">
			<div class="bingo-winning-content">{{showCurrency}}{{contentData.showWinnings}}</div>
		</div>

		<div class="bingo-winning-footer">
			<!-- <div class="bingo-money" v-if="contentData.bizType===4"></div> -->
			<div class="m-desc-wrapper">
				<div v-if="contentData.roundNo">From {{contentData.sportType}} Round No. {{contentData.roundNo}}</div>
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
</template>
<script>
import 'packages/button';
import commonEvent from 'config/eventConfig/commonEvent';
import { EventBus } from 'kernel/js/eventBus.js';
import { pagePath } from 'config/pageConfig';
import { showCurrency } from 'config/currencyConfig';
import sharePop from './sharePop.vue';

let popDialog = null;
export default {
	name: 'BingoWinningsTips',
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
		},

		popUp () {
			popDialog = this.$dialog({
				title: 'Share',
				'class': 'm-win-share',
				content: sharePop,
				contentData: {
					shareText: 'Try out Bingo! Bingo! Your bets count the most at SportyBet',
					shareUrl: `${location.origin}/${window.country}/m/sportybingo`,
					bizType: this.contentData.bizType
				},
				button: []
			}).onBtnClick(btnType => {
				popDialog.close();
				popDialog = null;
			});
		}
	}
};
</script>
<style lang="less">
@import 'base/styles/variable.less';
@import 'base/styles/icon.less';

.w-h-100() {
	width: 100%!important;
	height: 100%!important;
	background: transparent!important;
}
.bingo-winnings-pop{
	overflow: visible;

	&.es-dialog {
		.w-h-100();
		padding: 0;
		margin: 0!important;
		top: 0!important;
		left: 0!important;

		.es-dialog-body {
			.w-h-100();

			.es-dialog-main {
				.w-h-100();
				padding: 0;
			}
		}
	}
}
.bingo-winning-wrapper {
	width: 100%;
	height: 100%;
	
	&:before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		background: rgba(0, 0, 0, 0.8);
		filter: blur(4px);
		z-index: 1;
	}


	.m-pop-header {
		position: relative;
		width: 100%;

		.m-icon-close {
			color: @white;
			position: absolute;
			right: 14/@rem;
			top: 14/@rem;
			.m-icon-close();
			z-index: 200;
		}

	}
	.bingo-winning-background{
		position: absolute;
		top: 0;
		bottom: 0;
		right: 0;
		left: 0;
		background: url('../image/bingo-win.png') no-repeat;
		background-size: 100% 100%;
		z-index: 10;
	}
	.bingo-winning-content{
		position: absolute;
		top: 50.6%;
		width: 100%;
		height: 50/@rem;
		line-height: 50/@rem;
		font-size: 32/@rem;
		font-weight: bold;
		text-align: center;
		color: #FFF;
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
	}
	.bingo-winning-footer{
		position: absolute;
		width: 100%;
		z-index: 11;
		bottom: 50/@rem;
	}
	.m-winning-footer {
		margin-top: -19/@rem;
	}

	.m-desc-wrapper {
		font-size: 12/@rem;
		font-weight: 500;
		line-height: 14/@rem;
		color: #dcdee5;
		text-transform: capitalize;
		text-align: center;
	}

	.m-btn-wrapper {
		margin: 20/@rem 16/@rem;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.af-button {
		width: 160/@rem;
		flex: auto;
		font-size: 16/@rem;
		font-weight: bold;
		height: 42/@rem;
		border-radius: 2/@rem;

		&--primary {
			margin-left: 8/@rem;
			color: @dark;
			background-color: @midGreen;
			border-color: @midGreen;

			&:hover, &:active {
				background: @lightGreen;
				border-color: @lightGreen;
				color: @dark;
			}
		}

		&--text {
			border: 1px solid @midGreen;
			color: @midGreen;

			&:hover, &:active {
				background: @lightGreen;
				border-color: @lightGreen;
				color: @dark;
			}
		}
	}
	.bottom-text {
		margin-top: 10/@rem;
		padding: 0 5/@rem;
		font-size: 12/@rem;
		line-height: 14/@rem;
		font-weight: 500;
		color: #dcdee5;
	}
}
</style>
