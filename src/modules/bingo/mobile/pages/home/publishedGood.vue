<template>
	<div class="bingo-published-good-wrap" @click="goToDetail">
		<div class="bingo-published-good-header">
			<div class="bingo-published-good-roundno">Round No. {{roundNo}}</div>
			<div class="bingo-published-good-status-wrap">
				<Publishing class="bingo-published-good-publishing" :timeout="publishedTime" v-if="isPublishing" @timeout="onTimeout"></Publishing>
				<div class="bingo-published-good-status" v-else>{{status}}</div>
			</div>
		</div>
		<div class="bingo-published-good-time">{{timestamp}}</div>
		<ImageInView :url="bannerUrl" class="bingo-published-good-banner" />
		<div class="bingo-published-good-winner" v-if="winner">
			<span class="bingo-published-good-number" v-if="winner.phone">Winner: {{winner.phone}}</span>
			<span class="bingo-published-good-bought" v-if="winner.boughtNum"> (Bought {{winner.boughtNum}} {{unit}})</span>
		</div>
	</div>
</template>
<script>
import Publishing from '../../components/publishing';
import ImageInView from '../../components/imageInView.vue';
import { getGoodsTime, getGoodsByRoundId } from '../../js/utils.js';

export default {
	props: {
		item: {
			type: Object,
			required: true
		}
	},
	components: {
		ImageInView,
		Publishing
	},
	data() {
		return {
			updatedGoods: this.item
		};
	},
	computed: {
		goods() {
			return this.updatedGoods;
		},
		roundNo() {
			return this.goods.roundNo;
		},
		timestamp() {
			return getGoodsTime(this.goods);
		},
		bannerUrl() {
			return this.goods.picUrl;
		},
		status() {
			const status = this.goods.status;

			// if (this.goods.goodsStatus === 2) {
			// 	return 'Closed';
			// }

			if ([3, 4].includes(status)) {
				return 'Published';
			} else if (status === 10) {
				return 'Closed';
			}

			return '';
		},
		isPublishing() {
			const status = this.goods.status;
			return status === 2;
		},
		winner() {
			const status = this.goods.status;
			if ([3, 4].includes(status)) {
				const winner = this.goods.winnerInfo || {};
				return {
					phone: winner.winner,
					boughtNum: winner.boughtAmount
				};
			}
			return null;
		},
		unit() {
			const winner = this.winner;
			if (winner) {
				const num = winner.boughtNum;
				if (num === 1) {
					return 'Share';
				}
				return 'Shares';
			}
			return '';
		},
		publishedTime() {
			let diff = 0;
			if (this.goods._serverTime) {
				diff = this.goods._serverTime - new Date();
			}
			return this.goods.publishedTime - diff;
		}
	},
	methods: {
		goToDetail() {
			this.$router.push({
				name: 'detail',
				params: {
					id: this.goods.roundId
				},
				query: {
					status: this.goods.status
				}
			});
		},
		onTimeout() {
			getGoodsByRoundId(this.goods.roundId)
			.then(goods => {
				this.updatedGoods = {
					...goods,
					picUrl: this.goods.picUrl
				};
			});
		}
	}
};
</script>
<style lang="less">
@import 'base/styles/variable.less';
.bingo-published-good-wrap{
	padding: 16/@rem;
	margin: 6/@rem 0;
	background-color: #FFF;
}
.bingo-published-good-header{
	display: flex;
	align-items: center;
}
.bingo-published-good-status-wrap{
	flex-shrink: 0;
	margin-left: 10/@rem;
}
.bingo-published-good-roundno{
	flex: 1;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	font-size: 14/@rem;
	color: #1b1e25;
}
.bingo-published-good-time{
	color: #9ca0ab;
	font-size: 10/@rem;
}
.bingo-published-good-status{
	height: 20/@rem;
	line-height: 20/@rem;
	padding: 0 10/@rem;
	border-radius: 10/@rem;
	background-color: #eaecef;
	color: #1b1e25;
	font-size: 12/@rem;
}
.bingo-published-good-banner{
	margin: 8/@rem auto 15/@rem;	
}
.bingo-published-good-number{
	font-size: 14/@rem;
	color: #1b1e25;
}
.bingo-published-good-bought{
	color: #0d9737;
	font-size: 14/@rem;
}
</style>
