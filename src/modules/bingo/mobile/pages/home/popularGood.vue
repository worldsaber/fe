<template>
	<div class="bingo-popular-good" @click="goToDetail" v-if="isNormal">
		<ImageInView :url="bannerUrl" class="bingo-popular-good-banner" />
		<div class="bingo-popular-good-content">
			<div class="bingo-good-progress-wrap">
				<BingoProgress :percentage="percentage" class="bingo-good-progress"/>
				<div class="bingo-good-progress-text">
					<span class="bingo-good-progress-left">Left: {{progressUp}}</span>
					<span class="bingo-good-progress-share"> / {{progressBottom}} Shares</span>
				</div>
			</div>
			<div class="bingo-good-price">{{currency}} {{goodPrice}} </div>
			<div class="bingo-good-join" @click.stop='onJoinClick'>Join</div>
		</div>
	</div>
</template>
<script>
import { formatNumber } from 'utils/index';
import BingoProgress from 'components/progress';
import ImageInView from '../../components/imageInView.vue';
import { subBingoPush, unsubBingoPush, getGoodsByRoundId, getLatestPeriod } from '../../js/utils';
import bingoBuy from '../../components/buy';

export default {
	props: {
		item: {
			// require: true,
			type: Object,
		}
	},
	data() {
		return {
			currency: window.currency,
			updatedGoods: { ...this.item },
		};
	},
	components: {
		BingoProgress,
		ImageInView
	},
	computed: {
		goods() {
			return this.updatedGoods;
		},
		stock() {
			return this.goods.stock;
		},
		percentage() {
			return Math.ceil(100 - this.progressUp / this.progressBottom * 100);
		},
		progressUp() {
			return this.stock.leftAmount; // 已售出的数目
		},
		progressBottom() {
			return this.stock.amount;
		},
		goodPrice() {
			const price = this.stock.sharePrice / 10000;
			return formatNumber(price);
		},
		bannerUrl() {
			return this.goods.picUrl;
		},
		isNormal() {
			return this.goods.status !== 10;
		}
	},
	created() {
		this.bingoPushHandler = data => {
			this.handleBingoPush(data);
		};
		this.subPush();
	},
	destroyed() {
		this.unsubPush();
	},
	methods: {
		onJoinClick() {
			// 校验登录
			if (!window.loginStatus) {
				window.login && window.login.show();
				return;
			}
			// 购买浮层
			bingoBuy({
				goods: this.goods,
				callback: async payload => {
					const { type, data } = payload;
					let roundId = this.goods.roundId;
					if (type === 'error') {
						const code = data.bizCode;
						if (code === 4400) { // 下一期
							try {
								const latestRoundId = await getLatestPeriod(this.goods.goodsId);
								if (latestRoundId) {
									roundId = latestRoundId;
								}
							} catch (err) {
								console.log(err);
							}
						}
						// else if (code === 4600) {
						// 	this.updatedGoods.status = 10; // 直接隐藏该期次
						// 	return;
						// }
					}
					// 购买成功或者其他需要刷新的操作
					getGoodsByRoundId(roundId)
					.then(goods => {
						this.updatedGoods = {
							...goods,
							picUrl: this.goods.picUrl
						};
					});
				}
			});
		},
		subPush() {
			const goodsId = this.goods.goodsId;
			subBingoPush({
				goodsId,
				listener: this.bingoPushHandler,
			});
		},
		unsubPush() {
			const goodsId = this.goods.goodsId;
			unsubBingoPush({
				goodsId,
				listener: this.bingoPushHandler,
			});
		},
		handleBingoPush(data) {
			let goods = {};
			try {
				goods = JSON.parse(data);
				if (goods.goodsId !== this.goods.goodsId) {
					return;
				}
				const stock = {
					...this.stock,
					leftAmount: goods.amount - goods.boughtAmount,
				};
				// 可能涉及到期次的更新、检验期次id 保证顺序
				if (this.goods.roundId > goods.id) { // 推送来的是上一期次的信息
					return;
				}
				this.updatedGoods = {
					...this.goods,
					stock,
					status: goods.status,
					roundId: goods.id,
					roundNo: goods.roundNo
				};
			} catch (e) {
				goods = null;
				console.error(e);
			}
		},
		goToDetail() {
			this.$router.push({
				name: 'detail',
				params: {
					id: this.goods.roundId
				},
				query: {
					goodsId: this.goods.goodsId
				}
			});
		}
	}
};
</script>
<style lang="less">
@import 'base/styles/variable.less';
@import 'base/styles/icon.less';

.bingo-popular-good{
	padding: 12/@rem 16/@rem 20/@rem;
	margin-top: 6/@rem;
	background-color: #FFF;
}
.bingo-popular-good-content{
	display: flex;
	align-items: center;

	margin-top: 12/@rem;
}
.bingo-good-progress-text{
	margin-top: 5/@rem;
	font-size: 12/@rem;
}
.bingo-good-progress-left{
	color: #1b1e25;
}
.bingo-good-progress-share{
	color: #9ca0ab;
}
.bingo-good-price{
	flex: 1;
	color: #1b1e25;
	font-weight: bold;
	font-size: 12/@rem;
	margin-left: 14/@rem;
	text-align: right;
}
.bingo-good-join{
	width: 72/@rem;
	height: 36/@rem;
	margin-left: 14/@rem;
	line-height: 36/@rem;
	text-align: center;
	font-size: 13/@rem;
	color: #FFF;
	background-color: #0d9737;
	border-radius: 3/@rem;
	cursor: pointer;
}
</style>

