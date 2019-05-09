<template>
	<div class="bingo-popular-wrap">
		<AfCarousel :itemsList="carouselList" class="bingo-carousel" v-if="carouselList.length > 0"></AfCarousel>
		<div class="bingo-broadcast" v-if="formatBroadcastList.length > 0">
			<img src="../../images/cup.svg" class="bingo-broadcast-cup" />
			<div class="bingo-broadcast-container">
				<Broadcast :list="formatBroadcastList"></Broadcast>
			</div>
		</div>
		<MoreList :fetchData="getGoodsList" :params="params">
			<template slot="list" slot-scope="{ list }">
				<div class="bingo-goods-list" v-if="list.length > 0">
					<PopularGood v-for="item in list" :key="item.roundId" :item="item" />
				</div>
				<div class="bingo-goods-empty" v-else>
					Sorry, there are currently no items available for purchase. Please try again later. Thank you.
				</div>
			</template>
		</MoreList>
	</div>
</template>

<script>
import AfCarousel from 'packages/carousel';
import { mapState } from 'vuex';
import Broadcast from '../../components/broadcast.vue';
import MoreList from '../../components/moreList';
import PopularGood from './popularGood';
import { getGoodListByStatus } from '../../js/utils';

export default {
	name: 'Popular',
	data() {
		return {
			currency: window.currency,
			params: {
				status: 1
			},
		};
	},
	components: {
		AfCarousel,
		Broadcast,
		PopularGood,
		MoreList
	},
	computed: {
		...mapState('bingo', [
			'broadcastList',
			'carouselList'
		]),
		formatBroadcastList() {
			const infos = this.broadcastList;
			const list = infos.map(item => {
				const time = this.getFormatTime(item.bizTime);
				const winning = (item.winning / 10000).toFixed(2);
				return {
					text: 'won', // 占位用
					time,
					winning,
					currency,
					roundNo: item.roundNo,
					phone: item.phone
				};
			});
			return list;
		}
	},
	methods: {
		// 广播的时间格式化
		getFormatTime(time) {
			const t = +new Date();
			const diff = t - time;
			let minute = diff / 1000 / 60; // 分钟
			// 不到一分钟
			if (minute < 1) {
				minute = 1;
			}
			if (minute < 60) {
				return `${minute.toFixed(0)} min. ago`;
			}
			const hour = minute / 60; // 小时
			if (hour < 72) {
				return `${hour.toFixed(0)} h ago`;
			}
			return '72 h ago';
		},
		getGoodsList(params) {
			return getGoodListByStatus(params);
		},
		// onReloadList() {
		// 	// 触发reload
		// 	this.params = {
		// 		status: 1
		// 	};
		// }
	}
};
</script>

<style lang="less">
@import 'base/styles/variable.less';
@import '~base/styles/icon.less';
.bingo-popular-wrap{
	background-color: #eaecef;
	padding-top: 1px;
	margin-top: -1px;

}
.bingo-carousel{
	height: 100/@rem;
	.carousel{
		height: 100/@rem;
	}
}
.bingo-broadcast{
	display: flex;
	align-items: center;
	padding-left: 10/@rem;
	height: 32/@rem;
	line-height: 32/@rem;
	background-color: #FFF;
}
.bingo-broadcast-cup{
	flex-basis: 15/@rem;
	flex-shrink: 0;
	text-align: center;
	width: 15/@rem;
	height: 15/@rem;
	margin-right: 10/@rem;
}
.bingo-broadcast-container{
	flex: 1;
	height: 32/@rem;
}
.bingo-broadcast-item-em{
	font-weight: bold;
	color: #0d9737;
}
.bingo-goods-empty{
	font-size: 12/@rem;
	text-align: center;
	margin-top: 6/@rem;
	background-color: #FFF;
	color: #9ca0ab;
	padding: 40/@rem 20/@rem;
	.m-icon-exclamation();
	&:before{
		display: block;
		margin-bottom: 10/@rem;
		font-size: 36/@rem;
		line-height: 42/@rem;
		padding-right: 15/@rem;
		color: @midGray;
	}
}
</style>
