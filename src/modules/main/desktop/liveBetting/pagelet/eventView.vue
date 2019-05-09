<template lang="html">
  <div class="m-eventview">
		<div class="m-error-wrapper" v-if="pageLoading">
			<div>
				<i class="m-icon-loading"></i>
				<span class="m-text-msg">Loading...</span>
			</div>
		</div>
		<!-- <template v-else-if="pageLoadError">
			<div class="m-error-wrapper m-error-wrapper-fix">
				<div>
					<div class="m-error-title">Oops!</div>
					<span class="m-error-msg">Failed to load game data.Please refresh the page.</span>
					<af-Button @click="refresh">Refresh</af-Button>
				</div>
			</div>
		</template> -->
		<div v-else>

			<!-- 侧边栏 -->
			<aside class="m-side-bar" @mouseleave="resetPopStatus">
				<div class="m-side-mask"></div>
				<ul
					class="m-item-wrap"
					id="j_sport_wrapper"
					@mousemove="handleHover($event)"
				>
					<li
						:class="getTypeClass(item.type)"
						@mouseenter="changeSportType(item.type, $event)"
						:data-type="item.type"
						v-for="item in sportTypeList"
						:key="item.id"
					>
						<div class="m-sport">
							<i :class="getSportIcon(item.id)"></i>
							<span>{{item.name}}</span>
							<!-- <i class="m-icon-arrow--right"></i> -->
						</div>
						<div
							class="m-sider-dialog"
							v-if="popDialogStatus && item.type === sportType"
						>
							<template v-if="popLoading">
								<div class="m-error-wrapper">
									<div>
										<i class="m-icon-loading"></i>
										<span class="m-text-msg">Loading...</span>
									</div>
								</div>
							</template>

							<template v-else-if="sportList.length">
								<h4 class="m-list-title">{{item.name}} <span v-if="sportCount">({{sportCount}})</span></h4>
								<dl
									:class="getPopItemStyle(item.type)"
									v-for="sportItem in sportList"
									:key="sportItem.categoryName"
								>
									<dt
										class="m-list-category"
									>{{sportItem.groupName}}</dt>
									<dd
										v-for="eventItem in sportItem.list"
										:key="eventItem.eventId"
										:class="[
											'm-list',
											{
												'm-list-active': eventItem.eventId === currentEvent
											}
										]"
										@click="showEventDetail(eventItem)"
									>
										<div
											class="m-item-time"
											v-if="showTimeCol"
										>{{eventItem.scheduleDesc}}</div>
										<div class="m-info-wrapper">
											<div
												class="m-item-name"
											>{{eventItem.homeTeamName}} vs {{eventItem.awayTeamName}}</div>
											<div class="m-item-score">
												<div v-if="eventItem.score" v-html="clearScore(eventItem.score)"></div>
												<i class="m-icon-more"></i>
											</div>
										</div>
									</dd>
								</dl>
							</template>

							<template v-else>
								<div class="m-error-wrapper">
									<div>
										<span class="m-error-msg">There are no games currently available in this category.Please try later. Thank you.</span>
									</div>
								</div>
							</template>

						</div>
					</li>
				</ul>
			</aside>

			<!-- 赛事详情 -->
			<section class="m-eventDetail">
				<div class="m-tracker" v-if="!loading && !loadError">
					<h4 class="m-tracker-title">
						<span>{{getTeamNames}}</span>
					</h4>

					<!-- 比赛未结束时，有live或者tracker显示tab -->
					<ul class="m-nav-wrapper" v-if="showLiveTab">
						<li v-if="hasLiveStream"
							:class="['m-nav-item',
								activeType === 'liveStream' ? 'm-nav-item--active' : ''
							]"
							@click="changeTrackerStatus('liveStream')"
						>
							Live Stream
						</li>
						<li v-if="hasMatchTracker"
							:class="['m-nav-item',
								activeType === 'liveTracker' ? 'm-nav-item--active' : ''
							]"
							@click="changeTrackerStatus('liveTracker')"
						>
							Match Tracker
						</li>
						<li v-if="hasStatistics"
							:class="['m-nav-item',
								activeType === 'liveStatistics' ? 'm-nav-item--active' : ''
							]"
							@click="changeTrackerStatus('liveStatistics')"
						>
							Statistics
						</li>
					</ul>

					<div class="m-live-wrapper">
						<template v-if="showStream">
							<LiveStreamPlayer :eventId="$route.params.eventId || currentEvent" />
						</template>

						<!-- 若比赛支持Live match tracker, 仅显示match tracker -->
						<template v-if="showTracker">
							<LiveMatchTracker type='lmts' :eventId="$route.params.eventId || currentEvent" />
						</template>
						<!-- 若比赛支持分析统计 -->
						<template v-if="showStatistics">
							<LiveMatchStatistics :eventId="$route.params.eventId || currentEvent" />
						</template>
						<!-- 比赛比分及状态 -->
						<template v-if="showEventScore">
							<div class="m-result-wrapper">
								<div class="m-result-title">
									<span>{{eventPeriodDesc}}</span>
								</div>
								<ul class="m-result-score">
									<li>
										<div class="m-label">
											<span>{{eventInfo.homeTeamName}}</span>
										</div>
										<div class="m-value">
											<span
												v-for="homeScore in getHomeSore"
												:class="`m-value-${getHomeSore.length}`"
											>{{homeScore}}</span>
										</div>
									</li>
									<li>
										<div class="m-label">
											<span>{{eventInfo.awayTeamName}}</span>
										</div>
										<div class="m-value">
											<span
												v-for="awayScore in getAwaySore"
												:class="`m-value-${getAwaySore.length}`"
											>{{awayScore}}</span>
										</div>
									</li>
								</ul>
							</div>
						</template>
					</div>

					<template v-if="showLiveBtn">
						<div :class="[
								'm-btn-wrapper',
								{
									'm-btn-wrapper-fix': !showScore
								}
							]"
							@click="toggleEventScore"
						>
							<i :class="{
								'm-icon--show': showScore,
								'm-icon--hide': !showScore
							}"></i>
							<span>{{showScore ? 'Show' : 'Hide'}}</span>
						</div>
					</template>
				</div>
				<EventDetail v-if="!eventFinished"/>
				<template v-else>
					<div class="m-detail-error">
						<div>
							<span class="m-error-msg">Sorry, this game is no longer available. Betting has closed or has been suspended. Please choose other games.</span>
						</div>
					</div>
				</template>
			</section>
		</div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState, mapMutations } from 'vuex';

import { isEmptyObject, objType } from 'utils';
import 'utils/class';

import 'packages/button';

import EventDetail from 'components/eventDetail/index.vue';
import LiveMatchTracker from 'packages/liveMatchTracker/liveMatchTracker.vue';
import LiveStreamPlayer from 'packages/liveStreamPlayer/liveStreamPlayer.vue';
import LiveMatchStatistics from 'packages/liveMatchStatistics/index.vue';

import { sportType2Id, sportConfigLowerCase, sportListUpperCase, getSportRoute, liveTrackers, statisticsSports } from 'config/sportsType';

import { getScheduleDesc, getShowScore } from 'base/js/utils';

import * as eventMutationTypes from 'store/eventDetail/mutationTypes';

let timerId = null,
	maskTimeId = null,
	startHover = false,
	sportListPos = null;

export default {
	name: 'LiveEventView',

	components: {
		EventDetail,
		LiveMatchTracker,
		LiveStreamPlayer,
		LiveMatchStatistics
	},

	data() {
		const params = this.$route && this.$route.params || {},
			eventInfo = this.eventInfo || {},
			sportName = params.sportName || eventInfo.sportName || 'football';

		return {
			sportType: sportName,
			sportList: [],
			sportTypeList: sportListUpperCase.map(sport => ({
				...sport,
				type: getSportRoute(sport.name),
			})),
			popDialogStatus: false,
			sportCount: 0,
			pageLoading: true,
			// pageLoadError: false,
			hasInit: false,
			popLoading: false,
			showScore: true,
			activeType: '',
			eventPeriodDesc: ''
		};
	},

	computed: {
		...mapGetters('eventDetail', [
			'getTeamNames',
			'getHomeSore',
			'getAwaySore'
		]),
		// ...mapState('betslip', [
		// 	'betslipsKeys'
		// ]),
		...mapState('eventDetail', [
			'eventCount',
			'loadError',
			'loading',
			'eventFinished',
			'currentEvent',
			'currentSport',
			'eventInfo',
			'liveChannel'
		]),
		showTimeCol() {
			return this.sportType !== 'circket';
		},
		currentSportName() {
			const sportId = this.currentSport && this.currentSport.replace(/\D/g, '') || '';

			return sportConfigLowerCase[sportId] || '';
		},
		hasLiveStream() {
			return this.liveChannel;
		},
		hasMatchTracker() {
			const sportId = this.currentSport && this.currentSport.replace(/\D/g, '') || '';

			return this.hasTracker(sportId);
		},
		// 分析统计
		hasStatistics () {
			const id = +this.currentSport.slice(9);
			return statisticsSports.includes(id);
		},
		showLiveTab() {
			return !this.eventFinished && (this.hasLiveStream || this.hasMatchTracker);
		},
		showStream() {
			if (!this.eventFinished) {
				return this.activeType === 'liveStream' && !this.showScore;
			}

			return false;
		},
		showStatistics () {
			if (!this.eventFinished) {
				return this.activeType === 'liveStatistics' && !this.showScore;
			}
			return false;
		},
		showTracker() {
			if (!this.eventFinished) {
				return this.activeType === 'liveTracker' && !this.showScore;
			}

			if (this.eventFinished && this.hasMatchTracker) {
				return true;
			}

			return false;
		},
		showEventScore() {
			if (!this.eventFinished && this.showScore) {
				return true;
			}

			if (this.eventFinished && !this.hasMatchTracker) {
				return true;
			}

			return false;
		},
		showLiveBtn() {
			return !this.eventFinished && this.showLiveTab;
		}
	},
	methods: {
		...mapActions('eventDetail', [
			'getEventCount',
			'fetchMarketGroup',
			'fetchEventDetail',
			'resetEventData'
		]),
		...mapMutations('eventDetail', {
			updateProductType: eventMutationTypes.UPDATEPRODUCTTYPE
		}),
		changeTrackerStatus(type) {
			if (type === this.activeType) {
				return;
			}

			this.activeType = type;
			this.showScore && (this.showScore = false);
		},
		toggleEventScore() {
			this.showScore = !this.showScore;
		},
		getSportIcon(id) {
			const type = sportConfigLowerCase[id];
			return [
				`m-icon--${type}`,
				'm-icon-sport'
			];
		},
		getTypeClass(type) {
			return [
				'm-item',
				{
					'm-item--active': type === this.currentSportName
				}
			];
		},
		getPopItemStyle(item) {
			return [
				'm-list-wrap',
				`m-list-wrap-${item}`
			];
		},
		clearScore(score) {
			if (score) {
				return `<span>${score.replace(/(\s+)/g, '</span><span>')}</span>`;
			}

			return '';
		},
		handleHover(event) {
			if (!sportListPos) {
				const sportListWrapper = document.querySelector('#j_sport_wrapper'),
					sportListRect = sportListWrapper.getBoundingClientRect();

				sportListPos = {
					right: sportListRect.right
				};
			}

			const mouseX = event.pageX || event.clientX;

			if (!startHover) {
				startHover = true;
				setTimeout(() => {
					const maskDom = document.querySelector('.m-side-mask');
					maskDom.addClass('on');

					maskTimeId && clearTimeout(maskTimeId);
					maskTimeId = null;

					if (mouseX >= sportListPos.right) {
						maskTimeId = setTimeout(() => {
							maskDom.removeClass('on');
						}, 600);
					} else {
						maskTimeId = setTimeout(() => {
							maskDom.removeClass('on');
						}, 100);
					}
					startHover = false;
				}, 100);
			}
		},
		changeSportType(type, event) {
			if (this.popDialogStatus && this.sportType === type) {
				return;
			}

			this.popLoading = false;
			this.popDialogStatus = false;

			this.sportType = type;

			const hoverDom = document.querySelector('#j_sport_wrapper .m-item-on');
			hoverDom && hoverDom.removeClass('m-item-on');

			const currentDom = document.querySelector(`#j_sport_wrapper [data-type="${type}"]`);
			if (currentDom) {
				currentDom.addClass('m-item-on');
			}

			this.getSportList(type);
		},

		resetPopStatus() {
			timerId && clearTimeout(timerId);
			setTimeout(() => {
				this.popDialogStatus = false;
				this.popLoading = false;
				startHover = false;

				const hoverDom = document.querySelector('#j_sport_wrapper .m-item-on');
				hoverDom && hoverDom.removeClass('m-item-on');

				const maskDom = document.querySelector('.m-side-mask');
				maskDom.removeClass('on');
			}, 100);
		},

		getSportList(val) {
			this.popDialogStatus = true;
			this.popLoading = true;

			timerId && clearTimeout(timerId);

			timerId = setTimeout(() => {
				const sportId = sportType2Id[val];

				this.sportList.splice(0);

				fetch('/factsCenter/commonThumbnailEvents', {
					method: 'GET',
					body: {
						sportId: `sr:sport:${sportId}`,
						productId: 1
					}
				})
				.then(res => {
					setTimeout(() => {
						this.popLoading = false;
					}, 500);

					return res.json();
				})
				.then(ret => {
					if (ret.bizCode === 10000 && val === this.sportType) {
						const data = ret.data || [],
							tempData = clearData(data, sportId);
						this.sportList = tempData.list;
						this.sportCount = tempData.sportCount;
					}
				})
				.catch(err => { // eslint-disable-line
					this.popLoading && setTimeout(() => {
						this.popLoading = false;
					}, 500);
				});
			}, 5);
		},

		loadDetail(eventId, sportId) {
			this.resetEventData({
				eventId: eventId || this.currentEvent,
				sportId: sportId || this.currentSport
			});

			Promise.all([this.fetchEventDetail(), this.fetchMarketGroup(sportId)])
			.catch(err => {}); // eslint-disable-line
		},

		showEventDetail(eventItem) {
			if (objType(eventItem) !== 'undefined' && eventItem.eventId) {
				// 该处路由切换，有时不能被监听到
				this.$router.push({
					name: 'eventView',
					params: {
						sportName: this.sportType,
						categoryId: eventItem.categoryId,
						tournamentId: eventItem.tournamentId,
						eventId: eventItem.eventId
					}
				});

				this.popDialogStatus = false;
			}
		},
		updateEventCount() {
			const val = this.eventCount,
				navigatorDom = document.querySelector('#header'),
				eventviewNode = navigatorDom && navigatorDom.querySelector('[data-key="single view"]');

			eventviewNode && val && (eventviewNode.innerHTML = `Single View(${val || ''})`);
		},
		refresh() {
			// 重新加载时，重置页面状态常量
			this.hasInit = false;
			this.pageLoading = true;
			// this.pageLoadError = false;

			this.loadDetail();
		},
		getSportId(params = {}) {
			const sportName = params.sportName || '';

			return sportName ? sportType2Id[sportName] : '';
		},
		hasTracker(sportId) {
			if (sportId && liveTrackers.includes(+sportId)) {
				return true;
			}

			return false;
		}
	},
	watch: {
		$route(to, from) {
			const meta = to.meta || {};
			if (meta.module === 'eventDetail') {
				const params = to.params || {},
					eventId = params.eventId,
					sportId = this.getSportId(params),
					sportIdStr = sportId ? `sr:sport:${sportId}` : '';

				if (this.hasTracker(sportId)) {
					this.activeType = 'liveTracker';
					this.showScore = false;
				} else {
					this.activeType = '';
					this.showScore = true;
				}

				this.loadDetail(eventId, sportIdStr);
			}
		},
		liveChannel(val) {
			if (val) {
				this.activeType = 'liveStream';
				this.showScore = false;
			}

			if (!this.activeType) {
				this.showScore = true;
			}
		},
		hasMatchTracker(val) {
			if (val && !this.activeType) {
				this.activeType = 'liveTracker';
				this.showScore = false;
			}
		},
		popDialogStatus(val, oldVal) {
			if (!val && oldVal) {
				const params = this.$route && this.$route.params || {},
					eventInfo = this.eventInfo || {};

				this.sportType = params.sportName || eventInfo.sportName || 'football';
			}
		},
		loading(val, oldVal) {
			if (!val && !this.hasInit) {
				this.pageLoading = false;
				this.hasInit = true;
			}
		},
		eventInfo(val, oldVal) {
			this.eventPeriodDesc = getEventPeriodDesc(val);
		},

		eventFinished(val, oldVal) {
			if (val) {
				this.getEventCount({ option: 1, productId: 1 }).then(() => {
					this.updateEventCount();
				});
			}
		}
		// hasInit(val, oldVal) {
		// 	if (val && !oldVal) {
		// 		this.pageLoadError = this.loadError;
		// 	}
		// }
	},
	created() {
		this.updateProductType(true);

		const params = this.$route.params || {},
			eventId = params.eventId || '',
			sportName = params.sportName || '',
			sportId = sportName ? `sr:sport:${sportType2Id[sportName]}` : '';

		this.getEventCount({ option: 1, productId: 1 }).then(() => {
			this.updateEventCount();
		});

		this.loadDetail(eventId, sportId);
	}
};
/*
（hover 浮层）清洗接口数据
 */
function clearData(data = [], sportId) {
	let temp = {},
		ret = [],
		sportCount = 0;

	for (const tournament of data) {
		const events = tournament.events || [],
			categoryId = tournament.categoryId,
			tournamentId = tournament.id;

		for (const eventItem of events) {
			const sport = eventItem.sport || {},
				groupName = `${tournament.categoryName} ${tournament.name}`;

			!temp[groupName] && (temp[groupName] = []);
			temp[groupName].push(Object.assign(
				eventItem,
				{
					tournamentId,
					categoryId,
					scheduleDesc: getScheduleDesc(eventItem, sportId),
					sportName: sport.name,
					score: getShowScore(eventItem, sportId)
				}
			));
		}
	}

	const groupKeys = Object.keys(temp);

	for (const group of groupKeys) {
		ret.push({
			groupName: group,
			list: temp[group]
		});

		sportCount += temp[group].length;
	}

	return {
		list: ret,
		sportCount
	};
}

/*
（liveTracker部分）根据event状态显示不同的时间信息
 */
function getEventPeriodDesc(eventInfo = {}) {
	if (isEmptyObject(eventInfo) || !eventInfo.sportId || !eventInfo.status) {
		return '';
	}

	const eventStatus = +eventInfo.status,
		sportId = +eventInfo.sportId.replace(/\D/g, '');

	switch (eventStatus) {
	case 0:
	case 7:
		return 'Upcoming';
	case 1:
	case 2:
		return getScheduleDesc(eventInfo, sportId);
	case 3:
	case 4:
		return 'Finished';
	case 5:
	case 6:
	case 8:
		return 'Closed';
	default:
		return 'Finished';
	}
}

</script>

<style lang="less">
@import 'base/style/variable.less';

@import '../style/tracker.less';
@import '../style/detailError.less';
@import '../style/detailSider.less';

.m-eventview {
	width: 100%;
	margin-right: 20px;
	// overflow: hidden;

	.m-eventDetail {
		margin-left: 20px;
		display: inline-block;
		width: 575px;
	}

	.m-detail-wrapper {
		background: @dark;
		margin-bottom: 10px;

		.m-table__wrapper {
			.m-icon--bg {
				background: fadeout(@lightGray, 85%);
			}
		}
	}

	.m-nav-wrapper {
		.m-nav-item {
			display: inline-block;
			font-size: 14px;
			font-weight: 500;
			line-height: 19px;
			color: @white;
			padding: 10px 18px 6px;
			border-bottom: 3px solid transparent;

			&:hover {
				cursor: pointer;
			}

			&--active {
				font-weight: bold;
				border-bottom-color: @green;
			}
		}
	}

	.m-nav {
		.m-nav-item {
			&:hover {
				cursor: pointer;
			}
		}
	}
}

</style>
