<template>
	<div :class="['event-detail']">
		<template v-if="fixedMarketGroup && fixedMarketGroup.length">
			<AFSnapNav
				v-model="groupId"
				:class="['m-group']"
				v-fixed="offsetFixed">
				<AFSnapNavItem class="m-sport-group-item" v-for="(one, index) in marketGroupWithFavor" :key="index">{{one.name}}</AFSnapNavItem>
			</AFSnapNav>
		</template>

		<!-- market可能是数组，是数组的时候根据 speciefierIndex去循环迭代-->
		<div class="m-sport-market" v-if="marketOrder.order && marketOrder.order.length">
			<Markets v-for="(marketId) in marketOrder.order"
			:market="getMarketById(marketId)"
			:speciefierIndex="getSpeciefierIndex(marketId)"
			:sportId="event.sportId"
			:key="marketId"
			>
			</Markets>
		</div>
		<template v-else>
			<template v-if="isFavor">
				<div class="m-sport-market-no-data" v-if="favorMarketIds.length > 0">
					<p class="market-favor-empty-text">{{favorEmptyText}}</p>
				</div>
				<div class="m-sport-market-favor-empty" v-else>
					<img :src="favorEmptyImage" class="market-favor-empty-image" v-if="favorEmptyImage" />
					<p class="market-favor-empty-text">{{favorEmptyText}}</p>
				</div>
			</template>
			<template v-else>
				<div class="m-sport-market-no-data" v-if="event.status > 2">
					<p>Sorry, this game is no longer available. Betting has </p>
					<p>closed or has been suspended. Please choose other </p>
					<p>games.</p>
				</div>
				<div v-else class="m-sport-market-no-data">
					<p>Sorry，there are no markets currently available in this</p>
					<p>category. Please try later. Thank you.</p>
				</div>
			</template>
		</template>

		<EventLoading v-show="eventLoading"/>
	</div>
</template>

<script>
	import { RESET_SCROLL } from 'store/layout/mutationTypes';
	import { SET_CURRENT_MARKET_GROUP } from 'store/eventDetail/mutationTypes';
	import { mapState, mapMutations, mapGetters, mapActions } from 'vuex';
	import getFixed from 'directives/fixed';
	import Markets from './market/index';
	import imageMap from './image/index.js';
	import EventLoading from './loading.vue';

	export default {
		name: 'EventDetail',
		directives: {
			fixed: getFixed(),
		},
		props: {
			isScrollNavFixed: {
				type: Boolean,
				'default': false
			},
			// 区分live, prematch
			source: {
				type: String
			}
		},
		data () {
			return {
				groupId: 1,
				offsetTop: 0, // tab的偏移顶部的距离
				eventLoading: false,  // favorite tab 加载
			};
		},
		created () {
			let index = 1;
			// 根据favorMarketIds 判断初始状态是否有favor，决定tab index [0, 1]
			const ids = this.favorMarketIds;
			if (ids.length > 0) {
				index = 0;
			}
			this.groupId = index;
			this[SET_CURRENT_MARKET_GROUP](this.marketGroupWithFavor[index]);

			// 阻止上面的赋值 触发不必要更新
			this.$watch('groupId', function(val, oldVal) {
				this.setCurrentMarketGroup(this.marketGroupWithFavor[val]);

				if (this.isFixed) {
					this.resetScroll({
						top: this.offsetTop
					});
				}

				// isFavor, 激活动态拉取
				if (val === 0) {
					this.eventLoading = true;
					const productId = this.source === 'live' ? 1 : 3;
					this.fetchFavorMarketIds({
						sportId: this.event.sportId,
						productId,
						hasLogin: true
					}) // 检验登录
					.then(() => {
						this.eventLoading = false;
					}).catch(() => {
						this.eventLoading = false;
						this.$nextTick(() => {
							this.groupId = oldVal;
						});
					});
				}
			});
		},
		components: {
			Markets,
			EventLoading,
		},
		computed: {
			...mapState('eventDetail', [
				// 'marketGroup', 已替换成fixedMarketGroup
				'event',
				'currentMarketGroup',
				'priorityMarketMap',
				'favorMarketIds',
			]),
			...mapGetters('eventDetail', [
				'fixedMarketGroup',
				'marketOrder',
				'orderEventMarkets',
			]),
			...mapState('layout', [
				'scrollPayload'
			]),
			tournamentId() {
				return this.event.tournamentId;
			},
			isFixed() {
				if (!this.isScrollNavFixed) return false;
				const payload = this.scrollPayload || { top: 0 };
				const top = payload.scrollTop;
				return this.offsetTop > 0 && top >= this.offsetTop;  // 需要等待mounted后的计算才算有效
			},
			marketGroupWithFavor() {  // 添加 My Favorite 后的 tabs 集合
				const group = this.fixedMarketGroup;
				return [{
					id: 'myFavorite',
					name: 'My Favorite',
				}, ...group];
			},
			isFavor() {
				const group = this.currentMarketGroup || {};
				return group.id === 'myFavorite';
			},
			favorEmptyImage() {
				return imageMap[this.source];
			},
			favorEmptyText() {
				const empty = this.favorMarketIds.length === 0;
				return empty ? 'There are no markets currently available in this category.' : 'No markets you favored  currently available to this game.';
			},
			offsetFixed() {
				return this.source === 'live' ? 0 : 58;
			}
		},
		methods: {
			...mapMutations('layout', {
				resetScroll: RESET_SCROLL
			}),
			...mapMutations('eventDetail', [
				SET_CURRENT_MARKET_GROUP,
			]),
			...mapActions('eventDetail', [
				'fetchFavorMarketIds',
			]),
			calcNavFixedPosition () {
				const $tab = document.querySelector('.m-prematch-detail .m-tab-navs') || document.querySelector('.event-detail .m-snap-nav-wrap.m-group');
				if ($tab) {
					const offset = $tab.offsetTop + (this.scrollPayload.scrollTop || 0);
					this.offsetTop = offset;
				}
			},
			getMarketById(id) {
				const markets = this.orderEventMarkets;
				const market = markets[id];
				return market;
			},
			getSpeciefierIndex(id) {
				const order = this.marketOrder;
				const index = order.speciefierIndex || {};  // 有些没有specifier不存在specifierIndex
				return index[id];
			}
		},
		mounted() {
			if (this.isScrollNavFixed) {
				this.calcNavFixedPosition();
			}
		}
	};
</script>

<style lang="less">
@import '~base/styles/variable.less';
@import '~base/styles/mixin.less';
@import 'base/styles/icon.less';
.event-detail{
	width: 100%;
	&.has-nav-fixed {
		padding-top: (48 - 10)/@rem;
	}

	.m-group {
		width: 100%;
		box-sizing: border-box;
		padding: 0 4/@rem;
		// border-bottom: 1px solid @lightGray;
		background-color: #fff;

		.m-sport-group-item{
			cursor: pointer;
			height: 48/@rem;
			line-height: 48/@rem;
			padding: 0 11/@rem;
			margin-bottom: -1px;
			font-weight: 700;
			.text {
				font-size: 12/@rem;
				color: @dark;
			}
			&.active {
				border-bottom: 4px solid @green
			}
		}
	}
	.m-sport-market-no-data {
		margin-top: 5%;
		text-align: center;
		.m-icon-exclamation();
		padding: 28/@rem;
		color: @darkGray;
		p{
			white-space: nowrap;
		}
		.market-favor-empty-text{
			white-space: initial;
		}
		&:before{
			color: @lightGray;
			font-size: 30/@rem;
		}
	}
	.m-sport-market-favor-empty{
		margin-top: 40/@rem;
		text-align: center;
	}
	.market-favor-empty-image{
		width: 210/@rem;
	}
	.market-favor-empty-text{
		color: #9ca0ab;
		font-size: 14/@rem;
		width: 264/@rem;
		margin: 30/@rem auto 0;
		padding-bottom: 40/@rem;
	}
	.m-sport-market{
		position: relative;
		z-index: 10;
	}
}
</style>
