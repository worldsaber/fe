<template>
	<div class="m-mine-goods-wrap" @click="goToDetail">
		<div class="m-mine-goods-header">
			<template v-if="isOnGoing">
				<div class="m-mine-goods-progress-wrap">
					<BingoProgress :percentage="progressPercent" />
					<div class="m-mine-goods-left-info">
						<span class="m-mine-goods-share-up">Left: {{progressUp}}</span>
						<span class="m-mine-goods-share-bottom">/ {{progressBottom}} Shares</span>
					</div>
				</div>
			</template>

			<template v-else>
				<div class="m-mine-goods-status">
					<template v-if="isPublishing">
						<Publishing class="m-mine-goods-publishing" :timeout="publishedTime" @timeout="onTimeout"/>
					</template>
					<template v-else-if="isWin">
						<div class="m-to-win-wrap">
							<div class="m-img-container">
								<img src="../images/won.png" />
							</div>
							<div class="m-to-win">{{showCurrency}} {{ShowWin}}</div>
						</div>
					</template>
					<template v-else-if="isCancel">
						<div class="m-status-text">Closed</div>
					</template>

					<template v-else-if="isLose">
						<div class="m-status-text">Lost</div>
					</template>
				</div>
			</template>

			<div class="m-col m-mine-goods-operate-btn-wrap" v-if="isShowOperateBtn">
				<template v-if="isWin">
					<div class="m-btn" @click.stop="share">Share</div>
				</template>
				<template v-else-if="isOnGoing">
					<div class="m-btn" @click.stop="showBuyPanel">Add More</div>
				</template>
				<template v-else-if="isJoinAgain">
					<div class="m-btn" @click.stop="onJoinAgain">Join Again</div>
				</template>
			</div>
		</div>

		<div class="m-mine-goods-main">
			<div class="m-mine-goods-title">{{item.goodsDesc}}</div>
			<div class="m-mine-goods-number">Round No. {{item.roundNo}}</div>

			<div class="m-bought-info">
				<div class="m-row m-bought">
					<div class="m-col m-label">Bought</div>
					<div class="m-col m-value">
						<span>{{boughtNum}} {{unit(boughtNum)}}</span>
						<span class="m-pending-shares" v-if="pendingNum">({{pendingNum}} Pending {{unit(pendingNum)}})</span>
					</div>
				</div>

				<div class="m-row m-stake">
					<div class="m-col m-label">Stake</div>
					<div class="m-col m-value">{{showCurrency}} {{showStake}}</div>
				</div>
			</div>
		</div>

		<div class="m-mine-goods-footer m-mine-goods-winner" v-if="isLose">
			<span class="m-winner-phone" v-if="winnerPhone">Winner: {{winnerPhone}}</span>
			<span class="m-winner-number" v-if="winnerNumber">(Winning No.{{winnerNumber}})</span>
		</div>
	</div>
</template>

<script>
import { mapMutations } from 'vuex';
import * as mutationTypes from 'store/layout/mutationTypes';
import cookie from 'storage/cookie';
import BingoProgress from 'components/progress';
import Share from 'components/share';
import { formatNumber } from 'utils';
import appCore from 'appCore';
import { showCurrencyOrigin } from 'config/currencyConfig';
import ImageInView from './imageInView.vue';
import Publishing from './publishing.vue';
import bingoBuy from './buy';
import { getGoodsByRoundId, subBingoPush, unsubBingoPush } from '../js/utils.js';

export default {
	name: 'MineGoods',
	components: {
		BingoProgress,
		Share,
		ImageInView,
		Publishing,
	},
	props: {
		// 商品对象
		item: {
			type: Object,
			required: true
		}
	},
	data() {
		return {
			showCurrency: showCurrencyOrigin,
			updatedGoods: this.item
		};
	},
	computed: {
		goods() {
			return this.updatedGoods;
		},
		isOnGoing() {
			const status = this.goods.status;
			return status === 1;
		},
		isPublishing() {
			const status = this.goods.status;
			return status === 2;
		},
		isWin() {
			const status = this.goods.status;
			if ([3, 4].includes(status)) {
				const winner = this.goods.winnerInfo || {};
				return winner.curWin;
			}
		},
		isPublished() {
			const status = this.goods.status;
			return [3, 4].includes(status);
		},
		isLose() {
			return this.isPublished && !this.isWin;
		},
		isCancel() {
			return this.goods.status === 10;
		},
		isJoinAgain() {
			const hasResult = this.isPublishing || this.isLose;
			return this.goods.hasRunningRound && hasResult;
		},
		winnerPhone() {
			const winnerInfo = this.goods.winnerInfo || {};
			return winnerInfo.winner;
		},
		winnerNumber() {
			return this.goods.winnerNumber;
		},
		progressUp() {
			const stock = this.goods.stock;
			return stock.leftAmount;
		},
		progressBottom() {
			const stock = this.goods.stock;
			return stock.amount;
		},
		progressPercent() {
			return (this.progressBottom - this.progressUp) / this.progressBottom * 100;
		},
		boughtNum() {
			return this.goods.boughtNum;
		},
		pendingNum() {
			return this.goods.pendingNum;
		},
		publishedTime() {
			let diff = 0;
			if (this.goods._serverTime) {
				diff = this.goods._serverTime - new Date();
			}
			return this.goods.publishedTime - diff;
		},
		isShowOperateBtn() {
			return this.isOnGoing || this.isWin || this.isJoinAgain;
		},
		ShowWin() {
			const won = (this.goods.toWin || 0) / 10000;
			return formatNumber(won, 0);
		},
		showStake() {
			const stake = this.goods.boughtNum * this.goods.stock.sharePrice / 10000;
			return formatNumber(stake, 0);
		}
	},
	created() {
		this.bingoPushHandler = data => {
			this.handlePushData(data);
		};
		if (this.isOnGoing) {
			this.subPush();
		}
	},
	destroyed() {
		this.unsubPush();
	},
	methods: {
		...mapMutations('layout', {
			toggleShare: mutationTypes.TOGGLE_SHARE
		}),
		subPush() {
			const goods = this.updatedGoods;
			subBingoPush({
				goodsId: goods.goodsId,
				roundId: goods.roundId,
				listener: this.bingoPushHandler
			});
		},
		unsubPush() {
			const goods = this.updatedGoods;
			unsubBingoPush({
				goodsId: goods.goodsId,
				roundId: goods.roundId,
				listener: this.bingoPushHandler
			});
		},
		handlePushData(data) {
			let goods = {};
			try {
				goods = JSON.parse(data);
				if (goods.goodsId !== this.goods.goodsId || goods.id !== this.goods.roundId) {
					return;
				}
				const stock = {
					...this.stock,
					leftAmount: goods.amount - goods.boughtAmount,
				};
				// 更新份数，状态
				this.updatedGoods = {
					...this.goods,
					stock,
				};
				// 状态变化, 非募集中
				if (goods.status !== 1) {
					this.unsubPush();
					this.updateGoods();
				}
			} catch (e) {
				goods = null;
				console.error(e);
			}
		},
		showBuyPanel() {
			bingoBuy({
				goods: this.goods,
				callback: () => {
					this.updateGoods();
				}
			});
		},
		share () {
			if (appCore.getAppName() === 'sportybet') {
				const shareUrl = `${location.origin}/${window.country}/m/sportybingo/home/popular`;
				appCore.share({
					title: 'share',
					url: shareUrl,
					hideCopy: 'true',
				});
				appCore.shareNow();
			} else {
				this.toggleShare(true);
			}
		},
		unit(num) {
			if (num === 1) {
				return 'Share';
			}
			return 'Shares';
		},
		onJoinAgain() {
			// 跳到商品详情页
			this.$router.push({
				name: 'detail',
				params: {
					id: this.goods.roundId
				},
				query: {
					goodsId: this.goods.goodsId
				}
			});
		},
		goToDetail() {
			this.$router.push({
				name: 'participation',
				params: {
					id: this.goods.roundId
				},
				query: {
					goodsId: this.goods.goodsId,
					userId: cookie('userId'),
				}
			});
		},
		updateGoods() {
			getGoodsByRoundId(this.goods.roundId)
			.then(goods => {
				this.updatedGoods = {
					...goods,
					picUrl: this.goods.picUrl
				};
			});
		},
		onTimeout() {
			this.updateGoods();
		}
	}
};
</script>

<style lang='less' scoped>
@import 'base/styles/variable.less';

.m-mine-goods-wrap {
	display: block;
	padding: 0 16/@rem 9/@rem;
	margin: 12/@rem 0;
	background: @white;
	text-decoration: none;

	&:active, &:visited, &:hover {
		text-decoration: none;
	}
}

.m-mine-goods-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 8/@rem 0 9/@rem;
	border-bottom: 1px solid @fogGrayBorder;

	.m-mine-goods-progress-wrap {
		display: flex;
		align-items: center;
		justify-content: flex-start;

		.m-progress {
			width: 88/@rem;
		}

		.m-mine-goods-left-info {
			margin-left: 13/@rem;
			font-size: 10/@rem;

			.m-mine-goods-share-up{
				color: #1b1e25;
			}
			.m-mine-goods-share-bottom{
				color: #9ca0ab;
			}
		}
	}

	.m-mine-goods-status {
		flex-shrink: 0;

		.m-status-text {
			min-width: 58/@rem;
			height: 20/@rem;
			box-sizing: border-box;
			padding: 0 10/@rem;
			border-radius: 10/@rem;
			line-height: 20/@rem;
			text-align: center;
			background: @lightGray;
			font-size: 10/@rem;
			color: @darker;
		}

		.m-to-win-wrap {
			display: flex;
			justify-content: flex-start;
			align-items: center;

			.m-img-container {
				margin: -14/@rem 0 -10/@rem -16/@rem;

				img {
					vertical-align: top;
					width: 80/@rem;
				}
			}

			.m-to-win {
				font-size: 16/@rem;
				font-weight: bold;
				color: @green;
				line-height: 19/@rem;
				margin-left: 10.5/@rem;
			}
		}

		.m-mine-goods-publishing {
			padding: 6/@rem 0 7/@rem;
			height: auto;
			border: 0;
			font-size: 12/@rem;
			line-height: 16/@rem;
			color: @darker;

			.bingo-publishing-time {
				vertical-align: top;
				margin-left: 5/@rem;
				font-size: 16/@rem;
				line-height: 1;
				font-weight: bold;
			}
		}
	}

	.m-btn {
		display: block;
		min-width: 72/@rem;
		box-sizing: border-box;
		padding: 0 10/@rem;
		font-size: 13/@rem;
		color: @green;
		border-radius: 3/@rem;
		border: 1px solid @green;
		height: 28/@rem;
		line-height: 28/@rem;
		text-align: center;
		cursor: pointer;
	}
}

.m-mine-goods-main {
	padding: 8/@rem 0;

	.m-mine-goods-title {
		font-size: 14/@rem;
		font-weight: bold;
		line-height: 16/@rem;
		color: @darker;
	}

	.m-mine-goods-number {
		margin-top: 4/@rem;
		width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 12/@rem;
		color: @darkGray;
		line-height: 14/@rem;
	}

	.m-bought-info {
		margin-top: 12/@rem;

		.m-row {
			margin-bottom: 4/@rem;
			font-size: 12/@rem;
			line-height: 14/@rem;
			display: flex;
			align-items: center;
			justify-content: flex-start;

			&:last-child {
				margin-bottom: 0;
			}

			.m-label {
				width: 39/@rem;
				margin-right: 12/@rem;
				color: @darkGray;
			}

			.m-value {
				color: @darker;

				.m-pending-shares {
					font-size: 10/@rem;
					color: @darkGray;
				}
			}
		}
	}
}

.m-mine-goods-footer {
	&.m-mine-goods-winner {
		margin-top: 10/@rem;
		padding: 9/@rem 0;
		border-top: 1px solid @lightGray;
		font-size: 12/@rem;
		line-height: 14/@rem;

		.m-winner-phone {
			color: #1b1e25;
		}

		.m-winner-number {
			color: @darkGray;
		}
	}
}

</style>
