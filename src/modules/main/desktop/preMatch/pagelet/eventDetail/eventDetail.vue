<template lang="html">
	<div class="m-eventDetail">
		<template v-if="pageLoading">
			<div class="m-error-wrapper">
				<div>
					<i class="m-icon-loading"></i>
					<span class="m-text-msg">Loading...</span>
				</div>
			</div>
		</template>

		<template v-else-if="pageLoadError">
			<div class="m-error-wrapper m-error-wrapper-fix">
				<div>
					<div class="m-error-title">Oops!</div>
					<span class="m-error-msg">Failed to load game data.Please refresh the page.</span>
					<af-Button @click="refresh">Refresh</af-Button>
				</div>
			</div>
		</template>

		<template v-else>
			<p class="m-t-info">
				<span class="game-time" v-if="showGameTimeInfo">{{showGameTimeInfo}} </span>
				<span class="live-in-play" v-if="hasLiveInPlay">Live In-Play Available</span>
				<span class="event-id" v-if="gameIdInfo">{{gameIdInfo}}</span>
			</p>
			<div class="m-title-wrapper" id="j_title">
				<div class="m-left">
					<span class="m-against">{{getTeamNames}}</span>
					<div class="m-btn-wrapper" tabIndex="0" @blur="closeGameList">
						<div
							:class="[
								'm-text-btn',
								{
									'm-text-btn--active': showMoreGame
								}
							]"
							:style="calChangBtnStyle"
							@click="changeGame"
							id="j_changeMatch"
						>
							<span >Change match</span>
							<i
								:class="{
									'm-icon-pack': !showMoreGame,
									'm-icon-unpack': showMoreGame
								}"
							></i>
						</div>

						<ul
							class="m-list-wrapper"
							v-if="showMoreGame"
							:style="getDropDownListStyle"
						>
							<template v-if="loading">
								<div class="m-error-wrapper">
									<div>
										<i class="m-icon-loading"></i>
										<span class="m-text-msg">Loading...</span>
									</div>
								</div>
							</template>

							<template v-else-if="loadError">
								<div class="m-error-wrapper m-error-wrapper-fix">
									<div>
										<span class="m-error-msg">There are no games currently available in this category. Please try later. Thank you.</span>
									</div>
								</div>
							</template>

							<template v-else>
								<li
									v-for="item in gameList"
									:key="item.eventId"
									:class="[
										'm-list',
										{
											'm-list--active': item.eventId === currentEvent
										}
									]"
									@click="changeEvent(item)"
								>
									<div
										v-if="item.isLive"
										class="m-info--live"
									>
										<span class="m-icon--live">Live</span>
										<span class="m-time">{{item.scheduleDesc || ''}}</span>
									</div>

									<div :class="[
										'm-info-wrapper',
										{
											'm-info-wrapper-fix': !item.isLive
										}
									]">
										<div class="m-name">{{item.homeTeamName}} vs {{item.awayTeamName}}</div>
										<div class="m-score">
											<div v-if="item.score" v-html="clearScore(item.score)"></div>
											<i class="m-icon-more"></i>
										</div>
									</div>
								</li>
							</template>

						</ul>
					</div>
				</div>
				<div class="m-right" v-if="isShowH2H">
					<i :class="['m-icon-h2h', {active: showH2H}]" @click="handleToggleH2h"><em></em></i>
				</div>
			</div>
			<div class="m-h2h" v-if="showH2H">
				<LiveMatchTracker type="h2h" :eventId="$route.params.eventId"></LiveMatchTracker>
			</div>
			<EventDetail :showLoading="false"/>
		</template>
	</div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex';
import { EventBus } from 'kernel/js/eventBus.js';
import dateFormat from 'kernel/js/dateFormat';
import commonEvent from 'config/eventConfig/commonEvent.js';

import EventDetail from 'components/eventDetail/index.vue';
import LiveMatchTracker from 'packages/liveMatchTracker/liveMatchTracker.vue';

// import * as mutationTypes from 'store/eventDetail/mutationTypes';

import { sportType2Id, trackerSports } from 'config/sportsType';
import { baseUrl, pagePath } from 'config/pageConfig';
import { getScheduleDesc, getShowScore } from 'base/js/utils';

import PopTips from 'components/betslips/pagelet/popTips.vue';

let popDialog = null;

export default {
	name: 'EventView',

	components: {
		EventDetail,
		LiveMatchTracker
	},
	data() {
		return {
			showH2H: false,
			showMoreGame: false,
			loading: false,
			loadError: false,
			gameList: [],
			currentEvent: this.$route && this.$route.params && this.$route.params.eventId || ''
		};
	},
	computed: {
		...mapGetters('eventDetail', [
			'getTeamNames',
			'getStartTime'
		]),
		...mapState('eventDetail', {
			pageLoading: 'loading',
			pageLoadError: 'loadError',
			eventInfo: 'eventInfo'
		}),
		// ...mapState('betslip', [
		// 	'betslipsKeys'
		// ]),
		calChangBtnStyle() {
			if (!this.showMoreGame) {
				return '';
			}

			const titleDom = document.querySelector('#j_title');

			if (!titleDom) {
				return;
			}

			const titleRect = titleDom.getBoundingClientRect(),
				padBottom = getComputedStyle(titleDom, null).getPropertyValue('padding-bottom'),
				padTop = getComputedStyle(titleDom, null).getPropertyValue('padding-top');

			return {
				height: `${titleRect.height - parseInt(padTop, 10)}px`,
				'margin-bottom': `-${parseInt(padBottom, 10) + 1}px`
			};
		},
		getDropDownListStyle() {
			const titleDom = document.querySelector('#j_title .m-left'),
				titleRect = titleDom.getBoundingClientRect(),
				// padLeft = getComputedStyle(document.querySelector('#j_title'), null).getPropertyValue("padding-left"),
				padBottom = getComputedStyle(document.querySelector('#j_title'), null).getPropertyValue('padding-bottom');

			return {
				top: `${titleRect.height + parseInt(padBottom, 10) - 1}px`
			};
		},
		showGameTimeInfo() {
			const eventInfo = this.eventInfo || {},
				startTime = eventInfo.estimateStartTime,
				clearTime = startTime ? dateFormat.format(startTime, 'dddd DD/MM HH:mm') : '';

			if (clearTime) {
				return `${clearTime}`;
			}

			return '';
		},
		gameIdInfo() {
			const eventInfo = this.eventInfo || {};
			if (eventInfo) {
				return `${eventInfo.gameId ? ' ID:' + eventInfo.gameId : ''}`;
			}
			return '';
		},
		hasLiveInPlay() {
			return this.eventInfo && this.eventInfo.bookingStatus === 'Booked';
		},
		isShowH2H() {
			const sportId = +this.eventInfo.sportId.slice(9);
			return trackerSports.includes(sportId);
		}
	},
	beforeRouteUpdate (to, from, next) {
		this.currentEvent = to.params.eventId;
		this.showMoreGame = false;
		this.showH2H = false;

		next();
	},
	watch: {
		$route (to, from) {
			const params = to.params || {},
				eventId = params.eventId || '',
				sportName = params.sportName || '',
				sportId = sportName ? `sr:sport:${sportType2Id[sportName]}` : '';

			this.loadDetail(sportId, eventId);
		},
		// pageLoading(val, oldVal) {
		// 	if (val) {
		// 		this.updateCheckList(this.betslipsKeys);
		// 	}
		// }
	},
	methods: {
		...mapActions('eventDetail', [
			'fetchMarketGroup',
			'fetchEventDetail',
			'resetEventData'
		]),
		// ...mapMutations('eventDetail', {
		// 	updateCheckList: mutationTypes.UPDATE_SELECT_LIST
		// }),
		clearScore(score) {
			if (score) {
				return `<span>${score.replace(/(\s+)/g, '</span><span>')}</span>`;
			}

			return '';
		},
		changeGame() {
			this.showMoreGame = !this.showMoreGame;

			if (!this.showMoreGame) {
				return;
			}

			this.loading = true;
			this.gameList = [];
			this.loadError = false;

			const params = this.$route.params;

			fetch('/factsCenter/commonThumbnailEvents', {
				type: 'GET',
				body: {
					tournamentId: params.tournamentId,
					sportId: `sr:sport:${sportType2Id[params.sportName]}`,
					categoryId: params.categoryId,
					timeline: 120,
					referenceTime: this.getStartTime
				}
			})
			.then(res => {
				setTimeout(() => {
					this.loading = false;
				}, 500);

				return res.json();
			})
			.then(res => {
				const code = res.bizCode;

				if (code === 10000) {
					this.gameList = clearData(res.data || {});
				} else {
					this.loadError = true;
				}
			})
			.catch(err => { // eslint-disable-line
				this.loading = false;
				this.loadError = true;
			});
		},
		closeGameList() {
			this.showMoreGame = false;
		},
		// 切换head to head 隐藏or显示
		handleToggleH2h() {
			this.showH2H = !this.showH2H;
		},
		changeEvent(event) {
			const params = this.$route && this.$route.params || {};
			const { sportName, categoryId, tournamentId } = params;
			const eventId = event.eventId;

			this.showMoreGame = false;

			if (event.isLive) {
				location.href = `${baseUrl}sport/${sportName}/live/${categoryId}/${tournamentId}/${eventId}`;
			} else if (sportName && categoryId && tournamentId) {
				this.$router.replace({
					name: 'eventDetail',
					params: {
						sportName,
						categoryId,
						tournamentId,
						eventId
					}
				});
			}
		},
		loadDetail(sportId, eventId) {
			this.resetEventData({
				eventId,
				sportId
			});

			Promise.all([this.fetchEventDetail(), this.fetchMarketGroup(sportId)]);
		},
		refresh() {
			const params = this.$route && this.$route.params || {},
				eventId = params.eventId || '',
				sportName = params.sportName || '',
				sportId = sportName ? `sr:sport:${sportType2Id[sportName]}` : '';

			this.loadDetail(sportId, eventId);
		}
	},
	created() {
		const params = this.$route.params || {},
			eventId = params.eventId || '',
			sportName = params.sportName || '',
			sportId = sportName ? `sr:sport:${sportType2Id[sportName]}` : '';

		this.loadDetail(sportId, eventId);
	},
	mounted() {
		// this.updateCheckList(this.betslipsKeys);

		EventBus.$on(commonEvent.UPDATE_EVENT_BETABLE, opt => {
			if (opt && opt.type === 'dialog') {
				this.$dialog();
				popDialog = this.$dialog({
					title: null,
					contentData: {
						title: '',
						msg: opt.msg
					},
					content: PopTips,
					button: []
				}).onBtnClick(() => {
					popDialog && popDialog.close();
					popDialog = null;
					this.resetEventData();

					const params = this.$route.params || {},
						sportName = params.sportName;
					if (sportName) {
						this.$router.replace({
							name: 'eventListDefault',
							params: {
								sportName
							}
						});
					} else {
						location.href = pagePath.home;
					}

					return false;
				});
			}
		});
	},
	destoryed() {
		this.resetEventData();
	}
};

function clearData(data) {
	const ret = [];

	for (const item of data) {
		item.events && ret.push(...item.events);
	}

	// 优先显示live
	let live = [],
		prematch = [];

	for (const eventItem of ret) {
		if (!eventItem.homeTeamName || !eventItem.awayTeamName || !eventItem.eventId) {
			continue;
		}

		const sport = eventItem.sport || {},
			sportIdStr = sport.id || '',
			sportId = sportIdStr.replace(/\D/g, '');

		if (eventItem.status && (eventItem.status === 2 || eventItem.status === 1)) {
			eventItem.isLive = true;
			eventItem.scheduleDesc = getScheduleDesc(eventItem, sportId);
			eventItem.score = getShowScore(eventItem, sportId);
			// eventItem.showTime = eventItem.playedSeconds && parseInt(eventItem.playedSeconds, 10) || '1';
			live.push(eventItem);
		} else {
			prematch.push(eventItem);
		}
	}

	return [...live, ...prematch];
}

</script>
<style lang="less">
@import 'components/betslips/style/popDialog.less';

@import './style/titleBar.less';
@import './style/markets.less';
@import './style/error.less';
</style>
