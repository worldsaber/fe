<template>
	<div class="m-event-recommend">
		<div class="m-recommend-header">
			<!-- live boost icon -->
			<div class="m-title-img" v-if="isLiveBoosted">
				<img src="../../common/components/event/image/boost-icon.png">
			</div>
			<!-- preMatch boost icon -->
			<div class="m-title-img" v-else-if="!isLive && event.oddsBoost">
				<img src="../../common/components/event/image/bestOdds.png">
			</div>
			<!-- normal -->
			<div class="m-title" v-else>Featured Match</div>
		</div>

		<a :href="sportLink" :class="['m-sport-link', {
			'm-sport-live': isLive
		}]">
			<div class="m-event-info">
				<div class="m-team m-team-left">
					<span class="m-team-name">{{event.homeTeamName}}</span>
					<span class="m-team-logo" v-if="event.homeTeamIcon">
						<img :src="event.homeTeamIcon">
					</span>
				</div>

				<div class="m-mid">
					<template v-if="isLive">
						<div class="m-score-group">
							<!-- homeTeam 比分 -->
							<span class="m-score">{{scores[0] || 1}}</span> -
							<!-- awayTeam 比分 -->
							<span class="m-score">{{scores[1] || 2}}</span>
						</div>

						<div class="m-date">
							<span class="m-label">Live</span>
							<span class="m-live-time">
								{{event.sportId === 'sr:sport:2' ? event.remainingTimeInPeriod : event.playedSeconds}}
								{{event.matchStatus}}
							</span>
						</div>
					</template>

					<template v-else>
						<div class="m-time">{{event.hourMinute}}</div>
						<div class="m-date">{{formateSportDate(event.dayMonth)}}</div>
					</template>
				</div>

				<div class="m-team m-team-right">
					<span class="m-team-logo" v-if="event.awayTeamIcon">
						<img :src="event.awayTeamIcon">
					</span>
					<span class="m-team-name">{{event.awayTeamName}}</span>
				</div>
			</div>
		</a>

		<div class="m-recommend-outcomes">
			<template v-if="market">
				<OutcomeCell
					v-for="(id, index) in market.outcomeOrder"
					:key="index"
					:sportId="event.sportId"
					:market="market"
					:event="event"
					:disabled="disabled"
					:outcome="market.outcomes[id]">
					<template v-if="market.status !== 0 || market.outcomes[id].isActive !== 1">
						<span class="m-icon-lock"></span>
					</template>

					<template v-else>
						<div class="desc">{{marketTitles[index]}}</div>
						<div class="odds">{{market.outcomes[id].odds}}</div>
					</template>
				</OutcomeCell>
			</template>

			<!-- 有一种情况是后台压根没有传递market，但是这个market还是要显示,所以取固定数据显示这个market -->
			<template v-else>
				<template v-if="marketTitles">
					<div class="m-outcome--disabled m-outcome" v-for="one in marketTitles" :key="one">
						<span class="m-icon-lock"></span>
					</div>
				</template>
			</template>
		</div>

		<div class="m-recomment-footer">
			<div class="m-tournament-name">{{event.categoryName}} - {{event.tournamentName}}</div>
			<div class="view-all" v-if="eventSize > 0">
				<a :href="viewAllLink">View All {{eventSize}}</a>
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import dateFormat from 'kernel/js/dateFormat';
import { sportPageById, pagePath } from 'config/pageConfig';
import OutcomeCell from 'components/event/outcomeCell';

export default {
	name: 'EventRecommend',
	components: {
		OutcomeCell
	},
	props: {
		event: {
			required: true,
			type: Object
		}
	},
	computed: {
		...mapGetters('oddsBoost', ['isLiveBoostWithMarket']),
		market () {
			const { markets = {}} = this.event;
			return markets['1'];
		},
		marketTitles () {
			if (this.market && this.market.title) {
				return this.market.title.split(',');
			}
			return ['1', 'x', '2'];
		},
		sportLink () {
			const { sportId, categoryId, tournamentId, eventId, status } = this.event;
			let url = `${sportPageById[sportId]}live/${categoryId}/${tournamentId}/${eventId}`;
			// 比赛没有开始，跳转到 pre match的详情页面
			if (status === 0) {
				url = `${sportPageById[sportId]}${categoryId}/${tournamentId}/${eventId}`;
			}
			return url;
		},
		isLive () {
			if (this.event) {
				const { status } = this.event;
				return status === 1 || status === 2;
			}
			return false;
		},
		scores () {
			if (this.event && this.isLive) {
				return (this.event.setScore || '').split(':');
			}
			return [];
		},
		disabled () {
			/* 这里跟 components/event/market.vue里的不等于判断（“currentMarket.productId !== productId”）不一样,
				market.vue里的productId实际上为undefined,
				根据outcomeCell组件里的条件判断, 这里应该用等于来赋予其disabled先决条件
			*/
			// const productId = this.market && this.market.product;
			// return this.isLive ? productId === 1 : productId === 3;
			return true;
		},
		isLiveBoosted() {
			if (!this.isLive) return false;
			// live
			const { tournamentId, eventId } = this.event;
			const marketId = (this.market && this.market.id) || '1';
			const isLiveBoostFunc = this.isLiveBoostWithMarket({
				marketId,
				productId: 1
			});
			return isLiveBoostFunc({ tournamentId, eventId });
		},
		eventSize () {
			return +this.event.configEventSize;
		},
		viewAllLink () {
			const { configTournamentIds } = this.event;
			let url = pagePath.bestOdds;
			if (configTournamentIds) {
				url = window.URL.addPara(pagePath.bestOdds, {
					tournamentId: this.event.configTournamentIds
				});
			}
			return url;
		}
	},
	methods: {
		formateSportDate (currentDate) {
			const today = dateFormat.format(Date.now(), 'DD/MM');
			if (today === currentDate) {
				return 'Today';
			}
			return currentDate;
		},
		// 计算 .m-team-name 元素多行对齐方式
		calcTeamNameStyle() {
			const teamNameEls = document.querySelectorAll('.m-event-recommend .m-team-name');
			if (teamNameEls) {
				teamNameEls.forEach(el => {
					if (el.offsetHeight > el.parentElement.offsetHeight) {
						el.addClass('limit-rows');
					}
				});
			}
		}
	},
	mounted() {
		this.calcTeamNameStyle();
	}
};
</script>


<style lang="less">
@import '~base/styles/variable.less';
@import '~base/styles/mixin.less';
@import '~base/styles/icon.less';

.m-event-recommend {
	padding: 0 15/@rem 12/@rem;
	box-sizing: border-box;

	.m-recommend-header {
		text-align: left;
		height: 25/@rem;
		box-sizing: border-box;

		.m-title {
			font-size: 11/@rem;
			line-height: 13/@rem;
			color: @darker;
			padding: 6/@rem 0;
		}

		.m-title-img {
			display: inline-block;
			height: 19/@rem;
			margin-left: -15/@rem;

			img {
				margin-top: -3/@rem;
				max-width: 100%;
				height: 100%;
				vertical-align: top;
			}
		}
	}

	.m-sport-link {
		display: block;
		&:hover, &:visited, &:active {
			text-decoration: none;
		}
	}

	.m-sport-live {
		.m-event-info {
			.m-mid {
				.m-score-group {
					font-size: 16/@rem;
					font-weight: bold;
					color: @darker;
					line-height: 19/@rem;
				}

				.m-date {
					line-height: 11/@rem;
					background: @green;

					.m-label {
						font-size: 10/@rem;
						line-height: 11/@rem;
						color: @white;
						padding: 0 3/@rem;
					}

					.m-live-time {
						font-size: 9/@rem;
						padding: 0 4/@rem;
						border: 1px solid @midGray;
						border-left: 0;
						background: @white;
					}
				}
			}
		}
	}

	.m-event-info {
		padding-top: 3/@rem;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 12/@rem;
		color: @dark;

		.m-team {
			width: 130/@rem;
			height: 28/@rem;
			display: flex;
			align-items: center;
			overflow: hidden;
			white-space: normal;

			&-left {
				justify-content: flex-end;
				text-align: right;
			}

			&-right {
				justify-content: flex-start;
				text-align: left;
			}

			&-logo {
				text-align: center;
				margin: 0 4/@rem;

				img {
					height: 26/@rem;
					vertical-align: top;
				}
			}

			.m-team-name {
				font-size: 12/@rem;
				line-height: 14/@rem;
				color: @darkGray;
				word-wrap: break-word;
				// 多行省略
				overflow : hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;

				&.limit-rows {
					align-self: flex-start;
				}
			}
		}

		.m-mid {
			margin: 0 6/@rem;
			text-align: center;

			.m-date {
				font-size: 10/@rem;
				white-space: nowrap;
				color: @darkGray;
				line-height: 11/@rem;
			}

			.m-time {
				margin-top: 1/@rem;
				padding: 0 2/@rem;
				font-size: 16/@rem;
				font-weight: bold;
				line-height: 19/@rem;
				color: @darker;
			}
		}
	}

	.m-recommend-outcomes {
		margin-top: 8/@rem;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;

		.m-outcome {
			min-width: 33%;
			box-sizing: border-box;
			height: 40/@rem;
			color: @darkGreen;
			background: @thinGreen;
			margin: 0 1/@rem;
			padding: 0 10/@rem;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.desc {
				font-size: 10/@rem;
				font-weight: normal;
			}

			.odds {
				font-size: 14/@rem;
				font-weight: bold;
			}

			&--checked {
				color: @white;
				background: @green;

				&:before{
					color: @white!important;
				}
			}

			&--disabled {
				background: @fogGray;
				color: #9DA0A9;
				justify-content: center;
			}

			&--up,
			&--down{
				&:before{
					color: @darkGreen;
				}
			}
		}
	}

	.m-recomment-footer {
		padding-top: 8/@rem;
		display: flex;
		justify-content: space-between;
		align-items: center;

		.m-tournament-name {
			width: 70%;
			font-size: 10/@rem;
			line-height: 18/@rem;
			color: @darkGray;
			text-align: left;
			.ellipsis();
		}

		.view-all{
			margin: 0;
			padding: 0;
			line-height: 18/@rem;

			a, a:hover,a:visited,a:active, a:after {
				font-size: 10/@rem;
				color: @green;
				text-decoration: none;
			}
		}
	}

	.m-icon-lock{
		.m-icon-locked();
		&:before{
			font-size: 16/@rem;
		}
		vertical-align: middle;
	}
}

</style>
