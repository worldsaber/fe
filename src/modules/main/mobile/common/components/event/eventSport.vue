<template>
	<div class="m-event-sport m-sports-row">
		<div class="m-event-meta">
			<!-- oddsBoost 赛事图标, 优先级大于 topTeam -->
			<span class="m-event-icon m-boost-icon" v-if="event.oddsBoost">
				<img src="./image/bestOdds.png">
			</span>
			<!-- 热门赛事 hot 图标 -->
			<span class="m-event-icon m-hot-icon" v-else-if="event.topTeam">
				<img src="./image/hot@2x.png">
			</span>
			<span class="m-time">{{event.hourMinute}}</span>
			<span class="m-game-id">{{event.gameId ? 'ID ' + event.gameId : ""}}</span>
			<template v-if="isShowEventLeagueName">
				<span class="m-league-name">{{event.categoryName}} - {{event.tournamentName}}</span>
			</template>
		</div>

		<AfTableRow class="m-sports-table">
			<AfTableCell class="m-info-cell" @click.native="jump">
				<div class="team">{{event.homeTeamName}}</div>
				<div class="team">{{event.awayTeamName}}</div>
			</AfTableCell>
			<!-- market显示 -->
			<!-- sportId获取做一个兼容 -->
			<!-- 如果是直播比赛，并且是第一行就显示title -->
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
			<div class="m-event-comment" v-if="event.commentsNum > 0">Comments {{event.commentsNum > 999 ? '999+' : event.commentsNum}}</div>
		</div>
	</div>
</template>

<script>
import { baseUrl } from 'config/pageConfig';
import { AfTableRow, AfTableCell } from 'packages/tableLayout';
import Market from './market.vue';

export default {
	name: 'EventSport',
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
		// 是否显示Next Goal market下拉列表的选择specifiers
		isShowNextGoalSpecifiers: {
			type: Boolean,
			'default': false
		}
	},
	methods: {
		// 跳转到对应的比赛详情页面
		jump () {
			const { categoryId, tournamentId, eventId } = this.event;
			const url = `${baseUrl}sport/${this.sportName}/${categoryId}/${tournamentId}/${eventId}`;
			window.location.href = url;
		}
	}
};
</script>

<style lang="less">
@import '~base/styles/variable.less';
@import '~base/styles/mixin.less';
@import 'base/styles/icon.less';

.m-event-sport {
	padding: 8/@rem 0;
	border-top: 1px solid @fogGray;
	display: block;

	&:hover, &:active, &:visited {
		text-decoration: none;
	}

	.m-event-meta {
		font-size: 10/@rem;
		line-height: 15/@rem;
		color: @darkGray;
		display: flex;
		align-items: center;
		justify-content: flex-start;

		& > span {
			margin-right: 10/@rem;

			&:last-child {
				margin-right: 0;
			}
		}

		.m-event-icon {
			margin: 0 4/@rem 0 -10/@rem;
			display: inline-block;
			flex: 0;

			svg,
			img {
				height: 14/@rem;
				vertical-align: top;
			}
		}

		.m-time {
			color: @dark;
			flex: 0;
			white-space: nowrap;
		}

		.m-game-id {
			flex: 0;
			white-space: nowrap;
		}

		.m-league-name {
			display: inline-block;
			vertical-align: top;
			// max-width: 40%;
			.ellipsis();
		}
	}

	.m-sports-table {
		margin-top: 8/@rem;
		align-items: center;
	}

	.m-market-cell{
		width: 55%;
		flex: 0 0 auto;

		.m-market {
			.m-outcome {
				color: @darkGreen;
				background: @thinGreen;

				&--checked {
					color: @white;
					background: @green;

					&:before{
						color: @white!important;
					}
				}

				&--disabled {
					background: @whiteGray;
					color: @darkGray;
				}

				&--up,
				&--down{
					&:before{
						color: @darkGreen;
					}
				}

				.specifiers-select {
					.af-select {
						.af-select-title {
							color: @darkGreen;
							background: @thinGreen;
						}
					}
				}
			}
		}
	}
	.m-info-cell{
		&>div{
			line-height: 1.4;
		}

		.team {
			color: @dark;
			padding-right: 10/@rem;
			box-sizing: border-box;
			.ellipsis();
		}
	}

	.m-event-footer {
		margin-top: 5/@rem;
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
		color: @darkGray;
		font-size: 10/@rem;

		&:after{
			content: "\e608";
			font-family: 'iconfont';
			display: inline-block;
			text-indent: 5/@rem;
			color: @darkGray;
			font-size: 10/@rem;
		}
	}
}
</style>
