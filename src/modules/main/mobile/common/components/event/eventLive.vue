<template>
	<div class="m-event-live m-live-row">
		<div class="m-event-meta">
			<span class="m-event-boost" v-if="isBoosted">
				<img src="./image/boost-icon.png">
			</span>
			<span class="m-mark-live" v-if="isShowLiveMark">LIVE</span>
			<!-- 直播比赛显示 当比赛状态是upcoming时显示 upcoming 否则不现实，赛前比赛显示gameId-->
			<template v-if="event.status === 1 || event.status === 2">
				<template v-if="isShowPlaySec">
					<span class="m-event-time" v-if="showEventTime">{{showEventTime}}</span>
				</template>
				<!-- 所有玩法均显示matchStatus -->
				<span class="match-status">{{event.matchStatus}}</span>
			</template>
			<!-- 没开始 -->
			<template v-else-if="event.status === 0">
				<span>{{event.hourMinute}}</span>
				<span>Upcoming</span>
			</template>
			<!-- 是否处理比赛结束状态 -->
			<!-- 其他情况 -->
			<template v-else>
				<span class="match-status">{{event.matchStatus}}</span>
			</template>

			<!-- 是否显示直播图标 -->
			<template v-if="event.liveChannel">
				<span class="m-live-icon"></span>
			</template>

			<template v-if="isShowEventLeagueName">
				<span class="m-league-name">{{event.categoryName}} - {{event.tournamentName}}</span>
			</template>
		</div>

		<AfTableRow class="m-live-table">
			<AfTableCell class="m-info-cell" @click.native="jump">
				<div class="team">{{event.homeTeamName}}</div>
				<div class="team">{{event.awayTeamName}}</div>
			</AfTableCell>
			<!-- 比分 -->
			<AfTableCell class="score" @click.native="jump">
				<div v-for="(one, index) in (event.setScore || '').split(':')" :key="index" class="set-score">
					{{one || ''}}
				</div>
			</AfTableCell>
			<AfTableCell v-if="isShowGameScore" class="game-score" @click.native="jump">
				<div v-for="(one, index) in event.gameScore[event.gameScore.length - 1].split(':')"
				:key="index">
					{{one || ''}}
				</div>
			</AfTableCell>

			<AfTableCell v-if="isShowPointScore" class="point" @click.native="jump">
				<div v-for="(one, index) in event.pointScore.split(':')" :key="index" class="point-score">
				{{one || ''}}
				</div>
			</AfTableCell>
			<!-- market显示 -->
			<!-- sportId获取做一个兼容 -->
			<!-- 如果是直播比赛，并且是第一行就显示title -->
			<!-- :title="index == 0 ? getTitle(marketId, event.markets[marketId]) : []" -->
			<AfTableCell class="m-market-cell">
				<Market v-for="(marketId, index) in currentMarketIds" :key="index"
					:productId="productId"
					:sportId="event.sportId || sportId"
					:marketId="marketId"
					:event="event"
					:isShowNextGoalSpecifiers="isShowNextGoalSpecifiers">
				</Market>
			</AfTableCell>
		</AfTableRow>

		<div class="m-event-footer">
			<div class="m-market-size" @click="jump">+{{event.totalMarketSize}}</div>
			<div class="m-event-comment" v-if="event.commentsNum > 0">Chat {{event.commentsNum > 999 ? '999+' : event.commentsNum}}</div>
		</div>
	</div>
</template>

<script>
import { AfTableRow, AfTableCell } from 'packages/tableLayout';
import { baseUrl } from 'config/pageConfig';
import Market from './market.vue';

export default {
	name: 'EventLive',
	components: {
		Market,
		AfTableRow,
		AfTableCell
	},
	props: {
		// 当前 event 对象
		event: {
			required: true,
			type: Object,
			'default': {}
		},
		// 当前需要显示的marketId数组-因为后台可能传递多个market，我们不一定显示，我们这里定义要显示的market
		currentMarketIds: {
			required: true,
			type: Array
		},
		sportId: {
			type: String
		},
		// 1(直播),3(赛前)
		productId: {
			type: [String, Number],
			required: true
		},
		sportName: {
			type: String,
			required: true
		},
		isShowEventLeagueName: {
			type: Boolean,
			'default': false
		},
		isEventBoost: {
			type: Function,
			'default': () => false
		},
		isShowLiveMark: {
			type: Boolean,
			'default': false
		},
		// 是否显示Next Goal market下拉列表的选择specifiers
		isShowNextGoalSpecifiers: {
			type: Boolean,
			'default': false
		}
	},
	computed: {
		isShowPlaySec () {
			const { sportId } = this;
			return sportId !== 'sr:sport:5' && sportId !== 'sr:sport:21';
		},
		// Tennis, Volleyball, Beach Volley, Darts 显示 gameScore
		isShowGameScore () {
			const { sportId } = this;
			const { gameScore } = this.event;
			return [
				'sr:sport:5',
				'sr:sport:23',
				'sr:sport:34',
				'sr:sport:22'
			].includes(sportId) && gameScore && gameScore.length && gameScore[gameScore.length - 1];
		},
		isShowPointScore () {
			const { sportId } = this;
			const { pointScore } = this.event;
			return [
				'sr:sport:5'
			].includes(sportId) && pointScore;
		},
		isBoosted() {
			const { tournamentId, eventId } = this.event;
			return this.isEventBoost({
				tournamentId,
				eventId
			});
		},
		// 比赛进行时间
		showEventTime () {
			const { remainingTimeInPeriod, playedSeconds } = this.event;
			return this.sportId === 'sr:sport:2' ? remainingTimeInPeriod : playedSeconds;
		}
	},
	methods: {
		// 跳转到对应的比赛详情页面
		jump () {
			const { categoryId, tournamentId, eventId, status, liveChannel } = this.event;
			// ${baseUrl}sport/:sportName/live/:categoryId/:tournamentId/:eventId'
			let url = `${baseUrl}sport/${this.sportName}/live/${categoryId}/${tournamentId}/${eventId}`;
			// 比赛没有开始，跳转到 pre match的详情页面
			if (status === 0) {
				url = `${baseUrl}sport/${this.sportName}/${categoryId}/${tournamentId}/${eventId}`;
			}
			// 有直播，则加上query标识
			if (liveChannel) {
				url = window.URL.addPara(url, {
					liveChannel: 1
				});
			}
			location.href = url;
		}
	}
};
</script>

<style lang="less">
@import '~base/styles/variable.less';
@import '~base/styles/mixin.less';
@import 'base/styles/icon.less';

.m-event-live {
	padding: 8/@rem 0;
	border-bottom: 1px solid fade(@fogGray, 15%);
	background-color: @darker;
	display: block;

	&:hover, &:active, &:visited {
		text-decoration: none;
	}

	.m-event-meta {
		font-size: 12/@rem;
		line-height: 15/@rem;
		color: @midGreen;

		& > span {
			margin-right: 8/@rem;
			font-weight: bold;

			&:last-child {
				margin-right: 0;
			}
		}

		.m-mark-live {
			font-size: 10/@rem;
			font-weight: normal;
			color: @darkGray;
			position: relative;
			padding-left: 8/@rem;

			&:before {
				content: '';
				position: absolute;
				left: 0;
				top: 50%;
				width: 6/@rem;
				height: 6/@rem;
				margin-top: -3/@rem;
				border-radius: 50%;
				background: @midGreen;
			}
		}

		.m-league-name {
			font-size: 10/@rem;
			font-weight: normal;
			color: @darkGray;
			display: inline-block;
			vertical-align: top;
			max-width: 66%;
			.ellipsis();
		}

		.m-live-icon {
			.m-icon-live-play();
			&:before {
				vertical-align: top;
			}
		}
		.m-event-boost{
			margin: 0 4/@rem 0 -10/@rem;
			display: inline-block;
			flex: 0;

			svg,
			img {
				height: 14/@rem;
				vertical-align: top;
			}
		}
	}

	.m-live-table {
		margin-top: 4/@rem;
		align-items: center;

		.score {
			color: @white;
		}

		.game-score, .point{
			color: @midGray;
			opacity: .5;
		}
	}

	.m-market-cell{
		width: 55%;
		flex: 0 1 auto;

		.m-market {
			width: 100%;

			.m-outcome {
				color: @midGreen;
				background: fade(@thinGreen, 13%);

				&--checked {
					color: @white;
					background: @green;

					&:before{
						color: @white!important;
					}
				}

				&--disabled {
					background: @dimDark;
					color: @grayGreen;
				}

				&--up,
				&--down{
					&:before{
						color: @midGreen;
					}
				}

				&.specifiers-select {
					.af-select {
						.af-select-title {
							color: @midGreen;
							// background: fade(@thinGreen, 13%);
							background: transparent;
							border-radius: 0;
						}
					}
				}
			}
		}
	}
	.m-info-cell{
		width: 32%;

		&>div{
			line-height: 1.4;
			.ellipsis();
		}

		.team {
			color: @fogGray;
			padding-right: 10/@rem;
			box-sizing: border-box;
			.ellipsis();
		}
	}

	.m-event-footer {
		margin-top: 3/@rem;
		display: flex;
		align-items: center;
		justify-content: space-between;

		.m-event-comment {
			font-size: 10/@rem;
			color: @darkGray;
		}
	}

	.m-market-size{
		width: 45%;
		color: @lightGray;
		font-size: 12/@rem;
		font-weight: 500;
		line-height: 14/@rem;

		&:after{
			content: "\e608";
			font-family: 'iconfont';
			display: inline-block;
			text-indent: 5/@rem;
			color: @lightGray;
			font-size: 10/@rem;
		}
	}
}
</style>
