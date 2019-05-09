<template>
<Layout :isNeedScroll="true" :isHaveRightPagelet="true">
	<div class="m-prematch-detail" slot="mid">
		<BackBar backText="Back"></BackBar>
		<div v-if="event && event.eventId && !isLoading">
			<div class="m-event-title">
				<div class="m-event-league">{{event.categoryName}} {{event.tournamentName}}</div>
				<div class="m-event-title-team">
					<div class="homeTeamName">{{event.homeTeamName}}</div>
					<div class="awayTeamName">{{event.awayTeamName}}</div>
				</div>
				<div class="m-event-time-wrap">
					<div class="m-event-time-left">
						<span class="event-date">{{event.monthDate}}</span>
						<span class="event-time">{{event.hourMinute}}</span>
						<span class="live-in-play" v-if="hasLiveInPlay">Live In-Play Available</span>
						<span class="event-gameid">{{event.gameId ? "ID " + event.gameId : ""}}</span>
					</div>
				</div>
			</div>

			<SubTabNav
				:isScrollNavFixed="true"
				:navs="navs"
				:currentTab="currentTab"
				@change="changeTab">
			</SubTabNav>

			<div class="m-sub-tab" v-if="isMountMarket">
				<EventDetail
					class="m-market-group"
					:isScrollNavFixed="true"
					source="prematch"
					v-show="currentTab === 'markets'">
				</EventDetail>
			</div>

			<div class="m-sub-tab" v-if="isMountStat">
				<div class="m-h2h" v-show="currentTab === 'stats'">
					<LiveStat
						:isScrollNavFixed="true"
						:sportId="currentSportId"
						:eventId="$route.params.eventId">
					</LiveStat>
				</div>
			</div>

			<div class="m-sub-tab" v-if="isMountComment">
				<Comment
					v-show="currentTab === 'comments'"
					:currentTab="currentTab"
					:topicId="event.topicId">
				</Comment>
			</div>
		</div>
	</div>

	<EditPanel
		slot="afterMid"
		v-if="currentTab === 'comments'"
		:topicId="event.topicId"
		:teamInfo="teamInfo">
	</EditPanel>
</Layout>
</template>

<script>
import Layout from 'components/layout/main.vue';
import { mapActions, mapState, mapMutations } from 'vuex';
import 'components/sanpNav';
import BackBar from 'components/navbar';
import EventDetail from 'components/eventDetail/eventDetail.vue';
import { CHANGE_LOADING, TOGGLE_BOTTOM, TOGGLE_FOOTER, TOGGLE_RIGHT } from 'store/layout/mutationTypes';
import sportsConfig from 'config/sports';
import 'components/dialog';
import { pagePath } from 'config/pageConfig';
import SubTabNav from './SubTabNav.vue';
import Comment from './comment';
import EditPanel from './comment/pagelet/EditPanel.vue';
import LiveStat from './LiveStat.vue';

export default {
	name: 'eventDetailPage',
	components: {
		Layout,
		EventDetail,
		BackBar,
		// LiveMatchTracker,
		LiveStat,
		SubTabNav,
		Comment,
		EditPanel
	},
	computed: {
		...mapState('eventDetail', [
			'event',
			'currentEventId',
			'currentSportId'
		]),
		...mapState('comment', ['commentCount']),
		...mapState('layout', ['isLoading']),
		navs() {
			// 评论数优先使用commentCount，默认是 event.commentsNum
			const commentCount = this.commentCount || this.event.commentsNum;
			// rugby, cricket, iceHockey, volleyball, beachVolley 没有 stats widgets
			if (['sr:sport:12', 'sr:sport:21', 'sr:sport:4', 'sr:sport:23', 'sr:sport:34'].includes(this.currentSportId)) {
				return [{
					text: 'Markets',
					tab: 'markets',
					icon: 'm-icon-market'
				}, {
					text: 'Comments',
					tab: 'comments',
					icon: 'm-icon-comment',
					badge: true,
					commentCount
				}];
			}

			return [{
				text: 'Markets',
				tab: 'markets',
				icon: 'm-icon-market'
			}, {
				text: 'Stats',
				tab: 'stats',
				icon: 'm-icon-stat'
			}, {
				text: 'Comments',
				tab: 'comments',
				icon: 'm-icon-comment',
				badge: true,
				commentCount
			}];
		},
		teamInfo() {
			const { homeTeamName, awayTeamName } = this.event;
			return `${homeTeamName} v ${awayTeamName}`;
		},
		hasLiveInPlay() {
			return this.event.bookingStatus === 'Booked';
		}
	},
	data () {
		return {
			productId: 3,
			currentTab: 'markets',
			isMountMarket: false,
			isMountStat: false,
			isMountComment: false,
			footerElement: null
		};
	},
	watch: {
		currentTab: {
			immediate: true,
			handler(val) {
				if (val === 'markets') {
					this.toggleBottom(true);
					this.isMountMarket = true;
				} else {
					this.toggleBottom(false);
					if (val === 'stats') {
						this.isMountStat = true;
					} else {
						this.isMountComment = true;
					}
				}

				if (val === 'comments') {
					this.toggleFooter(false);
				} else {
					this.toggleFooter(true);
				}
			}
		}
	},
	methods: {
		...mapActions('eventDetail', [
			'fetchEvent',
			'setSport',
			'unsub',
			'sub',
			'fetchMarketGroup',
			'fetchFavorMarketIds',
		]),
		...mapMutations('layout', {
			pageLoading: CHANGE_LOADING,
			toggleBottom: TOGGLE_BOTTOM,
			toggleFooter: TOGGLE_FOOTER,
			toggleRight: TOGGLE_RIGHT
		}),
		changeTab(tab) {
			this.currentTab = tab;
			this.replaceHistoryWithTab(tab);
		},
		replaceHistoryWithTab(tab) {
			let modifiedUrl = URL.removePara(document.URL, 'tab');
			modifiedUrl = URL.addPara(modifiedUrl, { tab });

			if (history.replaceState) {
				history.replaceState(null, document.title, modifiedUrl);
			}
		},
		fetchEventInfo() {
			const fetchEventParam = {
				productId: this.productId
			};
			if (this.currentEventId) {
				fetchEventParam.eventId = this.currentEventId;
			}

			this.pageLoading(true);
			// 进入页面直接获取event数据和marketGroup数据
			Promise.all([
				this.fetchEvent(fetchEventParam),
				this.fetchMarketGroup(this.currentSportId),
				this.fetchFavorMarketIds({
					sportId: this.currentSportId,
					productId: this.productId
				}),
			])
			.then(() => {
				if (this.event && this.event.eventId) {
					this.sub({
						sportId: this.event.sportId,
						eventId: this.event.eventId,
						tournamentId: this.event.tournamentId,
						categoryId: this.event.categoryId,
						productId: this.productId
					});
				}
				this.pageLoading(false);
			})
			.catch(() => {
				this.pageLoading(-1);
			});
		}
	},
	beforeDestroy () {
		if (this.event && this.event.eventId) {
			this.unsub({
				sportId: this.event.sportId,
				eventId: this.event.eventId,
				tournamentId: this.event.tournamentId,
				categoryId: this.event.categoryId,
				productId: this.productId
			});
		}
	},
	created () {
		this.$watch('event.status', (newVal, old) => {
			if (newVal === 1 || newVal === 3 || newVal === 4) {
				this.$alert('This game is no longer available.')
				.onBtnClick(() => {
					location.href = pagePath.home;
				});
			}
		});
		const { params = {}, query = {}} = this.$route;

		// 参数 tab 指定当前 tab
		if (query.tab) {
			this.changeTab(query.tab);
		}

		const eventId = params.eventId;
		const sportId = sportsConfig[params.sportName].id;
		this.setSport({
			eventId,
			sportId
		});
		this.fetchEventInfo();
	}
};
</script>

<style lang="less">
@import '~base/styles/variable.less';
@import '~base/styles/mixin.less';
@import 'base/styles/icon.less';

.m-prematch-detail {
	background: #fff;

	.m-tab-navs {
		.m-icon-market {
			.m-icon-market();
		}

		.m-icon-stat {
			.m-icon-live-statistic();
		}

		.m-icon-comment {
			.m-icon-comment();
		}
	}

	.m-live-stat,
	.m-market-group {
		& > .m-snap-nav-wrap {
			margin-top: -10/@rem;
		}
	}
}

.m-event-title{
	margin: 0 10/@rem;

	.m-event-league{
		padding: 9/@rem 0;
		line-height: normal;
		font-size: 10/@rem;
		color: @darker;
	}
	.m-event-title-team{
		color: @dark;
		&>div{
			line-height: 14/@rem;
			font-size: 12/@rem;
			font-weight: bold;
		}
	}
	.m-event-time-wrap{
		padding: 4/@rem 0;
		font-size: 10/@rem;
		line-height: 11/@rem;
		color: @dark;

		& > span {
			margin-right: 8/@rem;
		}
		.event-gameid{
			opacity: .5;
		}
		.live-in-play{
			margin: 0 4/@rem;
			.m-icon-live-stream();
			&::before{
				font-size: 12/@rem;
				margin-right: 2/@rem;
			}
		}
		.event-date{
			.m-icon-clock();
			&::before{
				font-size: 10/@rem;
				margin-right: 2/@rem;
			}
		}
	}

	.m-h2h {
		margin: 0 15/@rem;
		padding: 10/@rem 0;
	}
}
.m-sport-market {
	overflow: hidden;
	.m-market {
		.market-content {
			.m-outcome{
				&.m-outcome--disabled{
					background-color: @midGray;
					color: @darkGray;
				}
			}
		}
	}
}

.m-footer--preMatch {
	padding-bottom: 44/@rem;
}
</style>
