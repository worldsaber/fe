<template>
	<div v-loading:fetchData="loading" class="m-highlights-wrap">
		<template v-if="loading === false">
			<div v-if="sportProductStatus === 1" class="m-sport-bet-error">
				Failed to load game data. An error occurred while connecting to server.
			</div>
			<template v-else>
				<div class="m-bet-content">
					<template>
						<!-- 根据当前玩法取到当前玩法的数据 -->
						<div v-if="!hasData" class="no-data">
							<p>Sorry, there are no games currently </p>
							<p>available in this category. Please try later.</p>
							<p>Thank you.</p>
						</div>
						<template v-else>
							<!-- 大数据推荐比赛 + Top Team 比赛 -->
							<OrderEventsList
								:events="highlightEvents"
								:currentMarketIds="[marketIds[currentSportId]]"
								:sportId="currentSportId"
								:productId="productId"
								:isShowEventLeagueName="true">
							</OrderEventsList>

							<!-- Top Leagues 比赛 -->
							<LeagueList
								:leagues="mixHighlightLeagues"
								:productId="productId"
								@updateLeagues="updateMixHighlightLeagues"
								@deleteTournament="deleteMixHighlightLeague">
							</LeagueList>

							<div class="view-all">
								<a :href="viewAllLink">View More</a>
							</div>
						</template>
					</template>
				</div>
			</template>
		</template>
	</div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex';
import * as mutationTypes from 'store/home/mutationTypes';
import commonEvent from 'config/eventConfig/commonEvent';
import { EventBus } from 'kernel/js/eventBus.js';
import { pagePath } from 'config/pageConfig';
import OrderEventsList from 'components/eventsList/orderEventsList';
import LeagueList from './leagueList.vue';

export default {
	name: 'Highlights',
	components: {
		OrderEventsList,
		LeagueList
	},
	props: {
		// 当前组件是否可见，用于控制动态加载数据
		visible: {
			type: Boolean,
			'default': false
		}
	},
	data () {
		return {
			productId: 3,
			isOnceRequested: false // 是否请求过数据
		};
	},
	computed: {
		...mapState('home', [
			'homeCfg',
			'marketIds',
			'sportProductStatus',
			'currentSportId',
			'customEvents',
			'customEventsLoading',
			'mixHighlightLoading',
			'mixHighlightEvents',
			'mixHighlightLeagues'
		]),
		// ...mapGetters('home', [
		// 	'currentSportName',
		//  'currentSportNameUpper'
		// ]),
		// 只有当 customEvents 和 wapMixHighlightEvents 两个接口都请求完毕，才展示结果
		loading() {
			// -1 表示加载出错， true表示加载中，false表示加载完成
			let status = true;
			const { customEventsLoading, mixHighlightLoading } = this;
			if (customEventsLoading === -1 && mixHighlightLoading === -1) {
				status = -1;
			} else if (customEventsLoading === true || mixHighlightLoading === true) {
				status = true;
			} else {
				status = false;
			}
			return status;
		},
		hasData() {
			const { customEvents, mixHighlightEvents } = this;
			return (customEvents && customEvents.length > 0) ||
				(mixHighlightEvents && mixHighlightEvents.length > 0);
		},
		/**
		 * 排序规则：
		 * 1. Top Team > 大数据推荐比赛，且去重
		 * 2. 如有同一时间的比赛，则将大数据推荐比赛紧接着插到该时间点联赛比赛的后面，否则插到该时间点的后面
		 */
		highlightEvents() {
			const result = Array.from(this.mixHighlightEvents);

			// 去重
			const customList = this.customEvents.filter(x => !result.find(e => e.eventId === x.eventId));

			// 按规则插入，如有同一时间的比赛，则将大数据推荐比赛紧接着插到该时间点联赛比赛的后面，否则插到该时间点的后面
			customList.forEach(x => {
				const startTime = x.estimateStartTime;
				const tournamentId = x.sport.category.tournament.id;

				const sameTimeEvent = result.find(e => e.estimateStartTime === startTime);

				let insertIndex;

				if (sameTimeEvent) {
					// 若top team有相同的 tournament, 则添加至该 tournament 之后
					const sameLeagueEventIndex = result.reverse()
						.findIndex(e => e.estimateStartTime === startTime && e.sport.category.tournament.id === tournamentId); // eslint-disable-line
					// 还原 result
					result.reverse();
					if (sameLeagueEventIndex > -1) {
						insertIndex = result.length - 1 - sameLeagueEventIndex + 1;
					} else {
						insertIndex = result.findIndex(e => e.estimateStartTime > startTime);
					}
				} else {
					// 找到相同 estimateStartTime 的下一个位置
					insertIndex = result.findIndex(e => e.estimateStartTime > startTime);
				}

				if (insertIndex > -1) {
					result.splice(insertIndex, 0, x);
				} else {
					result.push(x);
				}
			});

			return result;
		},
		viewAllLink() {
			return URL.addPara(pagePath.preFootball, {
				source: 'home_list',
				time: 'all'
			});
		}
	},
	watch: {
		visible: {
			immediate: true,
			handler(val) {
				if (val) {
					if (!this.isOnceRequested) {
						this.fetchData();
						this.isOnceRequested = true;
					}
				}
			}
		}
	},
	methods: {
		...mapActions('home', ['fetchCustomEvents', 'fetchMixHighlightEvents']),
		...mapMutations('home', {
			updateMixHighlightLeagues: mutationTypes.UPDATE_MIX_HIGHLIGHT_LEAGUES,
			deleteMixHighlightLeague: mutationTypes.DELETE_MIX_HIGHLIGHT_LEAGUE
		}),
		fetchData() {
			this.fetchCustomEvents();
			this.fetchMixHighlightEvents();
		}
	},
	created() {
		// 若登录了，重新请求大数据推荐比赛
		EventBus.$on(commonEvent.UPDATE_LOGIN_STATUS, status => {
			if (window.loginStatus) {
				this.fetchCustomEvents();
			}
		});
	}
};
</script>

<style lang="less">
@import '~base/styles/variable.less';

.m-highlights-wrap {
	.m-event-sport {
		.m-event-meta {
			// highlight 下不显示 hot 图标
			.m-hot-icon {
				display: none;
				margin: 0;
			}
		}
	}

	.m-bet-content {
		.view-all {
			margin: 0;
			padding: 17/@rem 10/@rem;
		}
	}
}
</style>
