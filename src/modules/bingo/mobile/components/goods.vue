<template>
	<div class="m-goods-container">
		<div class="m-goods-wrap" @click="goToDetail">
			<div class="m-goods-header">
				<div class="m-goods-number">Round No. {{item.roundNo}}</div>
				<div class="m-goods-status">
					<template v-if="isPublishing">
						<Publishing :timeout="publishedTime" @timeout="onTimeout"/>
					</template>
					<template v-else-if="isWin">
						<div class="m-img-container">
							<img src="../images/BingoWon@2x.jpg" />
						</div>
					</template>
					<template v-else-if="isCancel">
						<div class="m-status-text">Closed</div>
					</template>
				</div>
			</div>
			<div :class="['m-goods-middle', {'m-goods-middle--won': isWin}]">
				<ImageInView :class="['m-goods-banner', {'m-goods-banner--won': isWin}]" :url="bannerUrl" />
			</div>

			<div class="m-goods-operate" >
				<div class="m-goods-progress-wrap" v-if="isOnGoing">
					<BingoProgress :percentage="progressPercent" />
					<div class="m-goods-left-info">
						<span class="m-goods-share-up">Left: {{progressUp}}</span>
						<span class="m-goods-share-bottom">/ {{progressBottom}} Shares</span>
					</div>
				</div>
				<div class="m-bought-shares-wrap">
					<div class="m-bought-shares" v-if="boughtNum">Bought {{boughtNum}} {{unit(boughtNum)}}</div>
					<div class="m-pending-shares" v-if="pendingNum">({{pendingNum}} Pending {{unit(pendingNum)}})</div>
				</div>
				<div class="m-goods-operate-btn-wrap">
					<template v-if="isWin">
						<div class="m-btn m-share-btn" @click.stop="share">Share</div>
					</template>
					<template v-else-if="isOnGoing">
						<div class="m-btn m-add-more-btn" @click.stop="showBuyPanel">Add More</div>
					</template>
					<template v-else-if="isJoinAgain">
						<div class="m-btn m-join-again-btn" @click.stop="onJoinAgain">Join Again</div>
					</template>
				</div>
			</div>

			<div class="m-goods-winner" v-if="isLose">
				<span class="m-winner-phone" v-if="winnerPhone">Winner: {{winnerPhone}}</span>
				<span class="m-winner-number" v-if="winnerNumber">(Winning No.{{winnerNumber}})</span>
			</div>
		</div>
		<Share :shareCfg="shareCfg" v-if="showShare" @close-share="hideShowPop"/>
	</div>
</template>

<script>
import cookie from 'storage/cookie';
import BingoProgress from 'components/progress';
import Share from 'components/share';
import ImageInView from './imageInView.vue';
import Publishing from './publishing.vue';
import bingoBuy from './buy';
import { getGoodsByRoundId, subBingoPush, unsubBingoPush } from '../js/utils.js';

export default {
	name: 'Goods',
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
			showShare: false,
			shareCfg: {
				shareUrl: `${location.origin}/${window.country}/m/sportybingo/home/popular`
			},
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
		// 商品状态, 包括 publishing, won, lose, closed，ongoing
		// status() {
		// 	const status = this.goods.status;
		// 	// 商品
		// 	// if (this.goods.goodsStatus === 2) {
		// 	// 	return 'Closed';
		// 	// }

		// 	// 期次
		// 	if (status === 1) {  // popular ，售卖中
		// 		return '';
		// 	} else if ([3, 4].includes(status)) { // 开完奖
		// 		const winner = this.goods.winnerInfo || {};
		// 		if (!winner.curWin) {
		// 			return 'Published';
		// 		}
		// 	} else if (status === 10) { // canceled
		// 		return 'Closed';
		// 	}
		// 	return '';
		// },
		bannerUrl() {
			return this.goods.picUrl;
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
		hideShowPop() {
			this.showShare = false;
		},
		share () {
			this.showShare = true;
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

<style lang='less'>
@import 'base/styles/variable.less';

.m-goods-wrap {
	display: block;
	padding: 16/@rem;
	margin: 6/@rem 0;
	background: @white;
	text-decoration: none;

	&:active, &:visited, &:hover {
		text-decoration: none;
	}

	.m-goods-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.m-status-text {
		height: 20/@rem;
		padding: 0 10/@rem;
		border-radius: 10/@rem;
		line-height: 20/@rem;
		text-align: center;
		background: @lightGray;
		font-size: 12/@rem;
		color: @darker;
	}
	.m-img-container {
		margin: -14/@rem -16/@rem -10/@rem 0;
		width: 97/@rem;
		// height: 44/@rem;
		img {
			width: 97/@rem;
			// height: 44/@rem;
		}
	}
	.m-goods-number {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 14/@rem;
		color: @darker;
		line-height: 20/@rem;
	}
	.m-goods-status{
		flex-shrink: 0;
		margin-left: 10/@rem;
	}

	.m-goods-middle {
		margin: 10/@rem 0 13/@rem;
	}
	.m-goods-middle--won{
		border: 4/@rem solid #f2af00;
	}
	.m-goods-banner--won{
		height: 90/@rem;
		border: 4/@rem solid #FFF;
		box-sizing: border-box;
		background-color: #FFF;
	}
	.m-goods-left-info{
		font-size: 10/@rem;
		margin-top: 2/@rem;
	}
	.m-goods-share-up{
		color: #1b1e25;
	}
	.m-goods-share-bottom{
		color: #9ca0ab;
	}
	.m-goods-operate {
		display: flex;
		align-items: center;
		justify-content: space-between;

		.m-bought-shares {
			font-size: 12/@rem;
			font-weight: bold;
			color: @darker;
			line-height: 14/@rem;
		}

		.m-pending-shares {
			font-size: 10/@rem;
			color: @darkGray;
			line-height: 14/@rem;
		}
	}

	.m-goods-winner {
		margin: 11/@rem 0 6/@rem;
		padding-top: 9/@rem;
		border-top: 1px solid @lightGray;
		font-size: 12/@rem;

		.m-winner-phone {
			color: #1b1e25;
		}

		.m-winner-number {
			color: @darkGray;
		}
	}

	.m-btn {
		display: block;
		color: @white;
		background: @green;
		border-radius: 3/@rem;
		height: 35/@rem;
		line-height: 35/@rem;
		text-align: center;
		cursor: pointer;
	}

	.m-add-more-btn {
		width: 79/@rem;
	}

	.m-share-btn {
		width: 79/@rem;
		background: @white;
		border: 1px solid @green;
		color: @green;
		font-size: 13/@rem;
		font-weight: bold;
	}

	.m-join-again-btn {
		width: 92/@rem;
	}
}

.m-goods-timestamp {
	font-size: 10/@rem;
	color: #9ca0ab;
}

</style>
