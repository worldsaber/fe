<template>
	<div class="m-settled-item">
		<div class="seperate">
			<!-- 比赛的投注状态，赢了显示check标志 -->
			<span class="status" :class="{
				'others': isVoid || isLost,
				'won': isWon
			}">
				<span v-if="!isWon">{{selection.status}}</span>
				<!-- 比赛为void或比赛为足球，且距开始时间6小时以上还未结束，显示问号，点击显示相应提示弹窗 -->
				<span class="question-mark"
					v-if="isVoid || (selection.sportId.split(':')[2]==1 && [1, 2].includes(selection.eventStatus) && +new Date()-selection.startTime>=6*60*60*1000)">?
				</span>
			</span>

			<div class="solo">
				<span>
					<!-- 如果需要显示序列号，就显示序列号 -->
					<span class="index" v-if="sequenceNum">{{sequenceNum}}</span>
					<!-- 若比赛正在进行，显示live标志 -->
					<i class="m-icon-live" v-if="(selection.eventStatus==1||selection.eventStatus==2)">live</i>
					<span class="gray" v-if="selection.gameId">Game ID: {{selection.gameId}} </span>
					<span v-if="selection.gameId" class="gray"> | </span>
					<!-- 比赛未开始或已结束，显示开始时间 -->
					<span class="gray" v-if="selection.eventStatus!=1&&selection.eventStatus!=2">{{selection.date}}</span>
					<!-- 比赛正在进行，根据球类不同显示如下： -->
					<span class="gray" v-else>{{liveMatchStatus}}</span>
				</span>

				<div class="ellips">{{selection.home}} <span class="gray">v</span> {{selection.away}}</div>

				<span class="score-wrapper" v-if="!isVoid">
					<!-- 网球的比分，分别是setScore，gameScore的最后一项和pointScore -->
					<span class="score" v-if="isShowMultipleScores">
						<span class="gray">{{scoreText}}</span>
						<span><em>{{selection.setScore}}</em></span>
						<span v-if="selection.gameScore">{{selection.gameScore[selection.gameScore.length-1]}} </span>
						<span v-if="selection.pointScore">{{selection.pointScore}}</span>
					</span>
					<!-- 其他球类比分显示规则  赛前即eventStatus为0 不显示 赛中显示Live Score:比分（比分不存在显示N/A） 赛后显示 足球：FT Score；其他Final Score:比分，比分 不存在显示N/A -->
					<div v-else-if="[1,2,3,4].includes(selection.eventStatus)" class="not-seperate">
						<span class="gray">{{scoreText}}</span>
						<span>{{showScore}}</span>
					</div>
				</span>

				<div class="pick-info">
					<p class="not-seperate">
						<span class="gray">Pick: </span>
						<span>{{selection.outcomeDesc}} @{{selection.odds}}
							<i v-if="selection.banker" class="banker">B</i>
							<i class="pick-right" v-if="isWon"></i>
						</span>
					</p>
					<p class="not-seperate">
						<span class="gray">Market: </span>
						<span>{{selection.marketDesc}}</span>
					</p>
					<div class="not-seperate" v-if="selection.correctOutcome && selection.eventStatus != 5 && !isVoid">
						<span class="gray">Outcome: </span>
						<span>{{selection.correctOutcome}}</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>

export default {
	name: 'SettledItem',
	props: {
		selection: {
			type: Object,
			required: true
		},
		// 人为控制是否显示live的link
		isHaveLiveLink: {
			type: Boolean,
			'default': true
		},
		// 人为控制是否显示tracker的link
		isHaveTrackerLink: {
			type: Boolean,
			'default': true
		},
		sequenceNum: {
			type: Number,
			'default': null
		}
	},
	computed: {
		isVoid() {
			return this.selection.status === 'Void';
		},
		isLost() {
			return this.selection.status === 'Lost';
		},
		isWon() {
			return this.selection.status === 'Won';
		},
		isShowQuestionMark(selection) {
			return this.isVoid || ([1, 2].includes(selection.eventStatus) && +new Date() - selection.startTime >= 6 * 60 * 60 * 1000);
		},
		// 比赛进行状态
		liveMatchStatus() {
			const {
				sportId,
				playedSeconds,
				matchStatus,
				remainingTimeInPeriod
			} = this.selection;

			switch (sportId) {
			// 显示进行时间和status阶段
			case 'sr:sport:1': // Football
			case 'sr:sport:12': // Rugby
			case 'sr:sport:6': // Handball
			case 'sr:sport:4': // Ice Hockey
				return `${playedSeconds || ''} ${matchStatus}`;
			// 显示剩余时间和status阶段
			case 'sr:sport:2': // Bsketball
				return `${remainingTimeInPeriod || ''} ${matchStatus}`;
			// 其他默认显示 status 阶段
			default:
				return `${matchStatus}`;
			}
		},
		// 赛中显示多重比分：比分 + 小比分等
		isShowMultipleScores() {
			// tennis, Volleyball, Beach Volley, Darts
			const { sportId, eventStatus } = this.selection;
			return [
				'sr:sport:5',
				'sr:sport:23',
				'sr:sport:34',
				'sr:sport:22'
			].includes(sportId) && (+eventStatus === 1 || +eventStatus === 2);
		},
		// 比分文案
		scoreText() {
			const { eventStatus, sportId } = this.selection;
			if (+eventStatus === 3 || +eventStatus === 4) {
				// football 显示 FT Score, 其他显示 Final Score
				if (sportId === 'sr:sport:1') {
					return 'FT Score: ';
				}
				return 'Final Score: ';
			} else if (+eventStatus === 1 || +eventStatus === 2) {
				return 'Live Score: ';
			}
		},
		// 显示比分
		showScore() {
			return this.selection.setScore || 'N/A';
		}
	}
};
</script>

<style lang="less" scoped>
@import "base/styles/variable.less";
@import "base/styles/icon.less";

 .m-settled-item {
    padding: 16 / @rem 12 / @rem;
    border-bottom: 1 / @rem solid @lighterGray;
	box-sizing: border-box;
	.seperate {
		display: flex;
		justify-content: space-between;
		.right {
			position:relative;
			left:30/@rem;
		}
		.solo {
			position:relative;
			width:75%;
		}
	}
	.index {
		width: 16 / @rem;
		height: 16 / @rem;
		display: inline-block;
		margin-right: 8px;
		line-height: 16 / @rem;
		border-radius: 8 / @rem;
		color: @white;
		text-align: center;
		background-color: @dark;
	}
    .m-icon-live {
      display: inline-block;
      vertical-align: top;
      background: @lightGreen;
      color: @dark;
      position: relative;
      margin-right: 5 / @rem;
      padding: 0 2 / @rem;
      box-sizing: border-box;
      &:after {
        position: absolute;
        top: 0;
        right: -2 / @rem;
        content: "";
        width: 0;
        height: 0;
        border-top: 8 / @rem solid @lightGreen;
        border-left: 1 / @rem solid @lightGreen;
        border-right: 1 / @rem solid transparent;
        border-bottom: 8 / @rem solid transparent;
      }
	}
	.tracker-commoents-warp{
		justify-content: flex-start;
		line-height: normal;
		.tracker {
			font-size: 10/@rem;
			color: @green;
			padding-right: 20/@rem;
			.m-icon-live-statistic();
			&::before {
				font-size: 16 / @rem;
				padding-right: 5 / @rem;
				display: inline-block;
				vertical-align: middle;
			}
		}
		.to-prematch {
			font-size: 10 / @rem;
			color: @green;
			.arrow {
				margin-right: 6 / @rem;
				.m-icon-comment();
				&::before {
					font-size: 14 / @rem;
					color: @green;
					display: inline-block;
					vertical-align: middle;
				}
			}
		}
	}
    .gray {
	  color: @darkGray;
	  text-align:right;
    }
    .score {
		em{
			font-weight: bold;
		}
    }
    .status {
      font-size: 14 / @rem;
      font-weight: bold;
	  color: @dark;
	  line-height: 1;
	  .question-mark {
		  background: @darkGray;
		  display: inline-block;
		  width: 14/@rem;
		  height: 14/@rem;
		  line-height: 14/@rem;
		  border-radius: 50%;
		  text-align: center;
		  color: @white;
		  font-weight: 900;
	  }
    }
    .others {
      color: @darkGray;
    }
    .won {
      .m-icon-success-bg();
      &::before {
        color: @green;
        font-size: 20 / @rem;
        padding-right: 15 / @rem;
        position: relative;
		font-weight: normal;
		line-height: 1;
		vertical-align: middle;
      }
    }
	.pick-info {
		background: @fogGray;
		padding: 5/@rem;
		margin-bottom: 7/@rem;
		.pick-right {
			.m-icon-success();
			&:before {
				font-size: 12/@rem;
				color: @green;
				margin-left: 5/@rem;
			}
		}
	}
    .not-seperate {
		display: table-row;
		span {
			display: table-cell;
		}
		span:last-child {
			padding-left: 8 / @rem;
		}
      .banker {
        width: 16 / @rem;
        height: 16 / @rem;
        line-height: 16 / @rem;
        display: inline-block;
        margin-left: 3 / @rem;
        border: solid 1 / @rem @green;
        border-radius: 8 / @rem;
        color: @green;
        text-align: center;
        font-weight: bold;
      }
    }
  }
</style>
