<template lang="html">
	<div class="m-sportsBet--detail">
		<div class="m-error-wrapper" v-if="pageError">
			<div>
				<span class="m-error-msg">Failed to load game data. Please refresh the page.</span>
				<div class="m-btn" @click="loadData">Retry</div>
			</div>
		</div>

		<div class="m-error-wrapper" v-else-if="pageLoading">
			<div>
				<i class="m-icon-loading"></i>
				<span class="m-text-msg">Loading...</span>
			</div>
		</div>

		<ul class="m-bet-sel" v-else>
			<li
				class="f-flex"
				v-for="selItem in getShowData"
				:key="selItem.id"
			>
				<div class="m-l-left m-i-suc" v-if="selItem.status === 1"></div>
				<div :class="[
					'm-l-left', 'm-t-12', 'm-t-l16', 'm-t-bold',
					{
						'm-t-dark': selItem.status !== 2 && selItem.status !== 3,
						'm-t-gray': selItem.status === 2 || selItem.status === 3
					}]" v-else>{{selItem.showResult}}</div>
				<div class="m-l-right f-flex-item">
					<div class="m-t-14 m-t-l16 m-t-dark">{{selItem.outcomeInfo.desc}}<span class="m-t-b5" v-if="selItem.outcomeInfo.ogOdds">@{{selItem.outcomeInfo.ogOdds}}</span><i v-if="selItem.banker" class="m-icon-banker"></i></div>
					<div class="m-live-odds" v-if="selItem.showResult === 'Ongoing' && selItem.isLiveEvent">
						<template v-if="selItem.outcomeInfo.showOdds">
							<span class="m-icon-live">Live Odds</span>
	    					<span class="m-odds">{{selItem.outcomeInfo.odds}}</span>
	    					<i
	    						:class="[{'m-odds--up': selItem.outcomeInfo.statusDesc === 'up', 'm-odds--down': selItem.outcomeInfo.statusDesc === 'down'}]"
	    						v-if="selItem.outcomeInfo.statusDesc === 'up' || selItem.outcomeInfo.statusDesc === 'down'"
	    					></i>
						</template>
						<template v-else>
						  <div class="m-odds-desc">Live Odds {{selItem.outcomeInfo.statusDesc || 'Suspended'}}</div>
						</template>
					</div>

					<div class="m-t-14 m-t-l16 m-t-dark m-market">{{selItem.marketInfo.desc}}</div>

					<div class="m-aginst">
						<span class="m-t-12 m-t-l16 m-t-black">{{selItem.eventInfo.homeTeamName}}</span>
			  			<span class="m-t-12 m-t-l16 m-t-gray m-vs">vs</span>
			  			<span class="m-t-12 m-t-l16 m-t-black">{{selItem.eventInfo.awayTeamName}}</span>
						<span class="m-t-12 m-t-l16 m-t-black" v-if="selItem.showPeriod">({{selItem.showPeriod}})</span>
					</div>

					<div class="m-score">
						<span class="m-t-12 m-t-gray">{{getShowScoreLabel(selItem)}}</span>
						<span class="m-t-12 m-t-bold" v-html="getShowScoreVal(selItem)"></span>
					</div>

					<div class="m-comment" v-if="selItem.isLiveEvent && selItem.haveLive === true" @click.stop="seeEventDetail(selItem)">
						<span>Go to Live Betting{{ commentsInfo[selItem.eventId] ? '(Chat ' + commentsInfo[selItem.eventId] + ' )' : '' }}</span>
						<i class="m-icon-more"></i>
					</div>
				</div>
			</li>
		</ul>

		<div class="f-flex m-opt">
			<button type="button" class="m-btn--text" @click.stop="refreshDetail"><i :class="['m-icon-refresh', {'on': refreshLoading}]"></i>Refresh</button>
			<div class="m-l-right">
	  			<span class="m-t-dark m-t-12 m-t-l14" @click.stop="hideDetail">Hide match details<i class="m-icon-pack"></i></span>
	  		</div>
		</div>
	</div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex';

import { isEmptyObject } from 'utils';

import { getShowScoreArr } from 'base/js/utils';
import { baseUrl } from 'config/pageConfig';
import { sportsConfigById } from 'config/sports';

import { UPDATECASHOUTINFO } from 'store/openBet/mutationTypes';

export default {
	props: {
		betInfo: {
			type: Object,
			required: true
		}
	},
	data() {
		return {
			refreshLoading: false,
			pageError: false,
			pageLoading: false
		};
	},
	computed: {
		...mapState('openBet', [
			'commentsInfo',
			'reqLoading',
			'errorInfo',
			'lockCal'
		]),
		getShowData() {
			const betInfo = this.betInfo || {},
				selections = betInfo.selections || {},
				selOrder = betInfo.selOrder || [],
				ret = [];

			for (let i = 0, len = selOrder.length; i < len; i++) {
				const item = selections[selOrder[i]];

				ret.push(item);
			}

			return ret;
		}
	},
	watch: {
		reqLoading(val) {
			if (!val) {
				this.refreshLoading && (this.refreshLoading = false);

				this.pageLoading && (this.pageLoading = false);
			}
		},
		errorInfo(val) {
			const { type = '', from = '' } = val || {};

			if (type === 'load_error_detail' && from === 'detail') {
				this.pageError = true;
			}

			if (isEmptyObject(val)) {
				this.pageError = false;
			}
		}
	},
	methods: {
		...mapActions('openBet', [
			'fetchBetDetail'
		]),
		...mapMutations('openBet', {
			resetCashoutInfo: UPDATECASHOUTINFO
		}),
		getShowScoreLabel(item = {}) {
			const isFinish = item.isFinish || false,
				isLive = item.isLiveEvent,
				isFootball = item.sportId === 'sr:sport:1',
				outcomeInfo = item.outcomeInfo || {};

			if (item.status === 3) {
				return '';
			}

			if (isFinish && isFootball) {
				return 'FT Score';
			}

			if (isFinish) {
				return 'Final Score';
			}

			if (outcomeInfo.lockUpdate) {
				return 'Score';
			}

			if (isLive) {
				return 'Live Score';
			}

			return '';
		},
		getShowScoreVal(item = {}) {
			const isFinish = item.isFinish || false,
				isLive = item.isLiveEvent,
				eventInfo = item.eventInfo || {},
				outcomeInfo = item.outcomeInfo || {};

			if (item.status === 3) {
				return '';
			}

			let sportId = item.sportId || '';

			sportId = sportId.replace(/\D/g, '');
			sportId = +sportId || 0;

			if (outcomeInfo.lockUpdate || isFinish) {
				if (!eventInfo.setScore) {
					return '<span class="m-t-gray m-t-mv6">not available</span>';
				}

				return `<span class="m-t-bblack m-t-mv6">${eventInfo.setScore}</span>`;
			}

			const showScore = getShowScoreArr(eventInfo, sportId, true);

			if (isLive) {
				if (!showScore.length) {
					return '<span class="m-t-gray m-t-mv6">not available</span>';
				}

				const oRet = [];
				for (let j = 0, sLen = showScore.length; j < sLen; j++) {
					if (j === 0) {
						oRet.push(`<span class="m-t-green m-t-mv6">${showScore[j]}</span>`);
					} else {
						oRet.push(`<span class="m-t-bblack m-t-mv6">${showScore[j]}</span>`);
					}
				}
				return oRet.join('');
			}

			return '';
		},
		seeEventDetail(item = {}) {
			const { eventId = '', sportId = '', categoryId = '', tournamentId = '' } = item || {};

			const sportName = sportsConfigById[sportId].name;

			if (!sportName || !eventId || !sportId || !categoryId || !tournamentId) {
				return;
			}
			// 只有live状态下才会显示这个按钮，所以跳转链接一定是live
			location.href = `${baseUrl}sport/${sportName}/live/${categoryId}/${tournamentId}/${eventId}`;
		},
		refreshDetail() {
			if (this.refreshLoading) {
				return;
			}

			this.refreshLoading = true;
			this.pageError = false;
			this.fetchBetDetail({ betId: this.betInfo.id, from: 'detail_refresh' });
		},
		loadData() {
			if (this.pageLoading) {
				return;
			}

			this.pageError = false;
			this.pageLoading = true;
			this.fetchBetDetail({ betId: this.betInfo.id, from: 'detail' });
		},
		hideDetail() {
			const betInfo = this.betInfo || {};

			if (betInfo.id) {
				this.$emit('chgDetailBetId', '');

				this.resetCashoutInfo();
			}
		}
	},
	created() {
		this.loadData();
	}
};
</script>

<style lang="less" scoped>
@import "../style/detail.less";
</style>
