<template>
	<article class="m-result" v-if = "resultPeriods.length">
		<header class="result-header">
			<em class="game-name">Sporty {{resultPeriods[indexNo] ? resultPeriods[indexNo].betType : '--'}}</em>
			<div v-if="showUpgradeTip" class="jackpot-upgrade-tip" @click="goFAQ">Please note that Sporty 11 has upgraded to Sporty 12 <i class="icon-right"/></div>
		</header>
		<div class="period-list">
			<div class="period">Round No.
				<span>
					<select v-model="indexNo" class="select">
						<option v-for="(period, i) in resultPeriods" :value="i" :key='i'>
							{{ period.periodNumber }} (Sporty {{period.betType}})
						</option>
					</select>
				</span>
			</div>
		</div>
		<section class="winnings" v-if="(previousDetail.winnings||[]).length > 0">
			<h3>Winnings</h3>
			<table class="list">
				<tr>
					<th>Correct Events</th>
					<th>No. Tickets</th>
					<th>Winning per Ticket ({{currency}})</th>
				</tr>
				<tr v-for="(temp,i) in previousDetail.winnings" :key="i" v-show="temp.winNum>0">
					<td>{{temp.correctEvents}} out of {{previousDetail.betType}}</td>
					<td>{{temp.winNum}}</td>
					<td>{{formatNum(temp.perWinnings)}}</td>
				</tr>
			</table>
		</section>
		<section class="results">
			<h3>Results</h3>
			<dl class="list">
				<dt class="title">
					<span class="no">No.</span>
					<span class="date">Date</span>
					<span class="match">Match</span>
					<span class="score">Score</span>
					<span class="result">Result</span>
				</dt>
				<dd v-for="(temp, i) in previousDetail.elements" :key="i" class="content">
					<span class="no">{{i + 1}}</span>
					<span class="date">{{formatDate(temp.date)}}</span>
					<span class="match">{{temp.home}}<br>{{temp.away}}</span>
					<span class="score" v-if="temp.result !== 4">{{temp.homeScore}}<br>{{temp.awayScore}}</span>
					<template v-if="temp.result === 4">
						<span v-for="i in ['score','result']" :key="i" :class="i">void
							<span class="m-icon-tips">
								<PopOver position="bottom" content="The match is void. Any bet will be counted as right."></PopOver>
							</span>
						</span>
					</template>
					<span class="result" v-else>{{formatResult(temp.result)}}</span>
				</dd>

			</dl>
		</section>

	</article>
	<article class="m-result-empty" v-else>
		No Data Available
	</article>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import * as mutationTypes from 'store/jackpot/mutationTypes';
import dateFormat from 'kernel/js/dateFormat';
import { formatNumber } from 'utils';
import PopOver from 'components/popOver';
import { pagePath } from 'config/pageConfig';

export default {
	components: {
		PopOver
	},
	data() {
		return {
			indexNo: '',

		};
	},
	computed: {
		...mapState('jackpot', [
			'gameSize',
			'resultPeriods',
			'previousDetail',
		]),
		currency() {
			return mutationTypes.SHOW_CURRENCY_FIX;
		},
		showUpgradeTip() {
			return this.resultPeriods[this.indexNo] && this.resultPeriods[this.indexNo].betType && this.gameSize && +this.gameSize !== +this.resultPeriods[this.indexNo].betType;
		}
	},
	watch: {
		indexNo(val) {
			this.getPreviousDetail(this.resultPeriods[val].periodNumber);
		},
		resultPeriods(val) {
			// this.indexNo = this.$route.query.periodNumber || val[0];
			const periodNumber = this.$route.query.periodNumber;
			if (periodNumber) {
				for (let i = 0; i < val.length; i++) {
					if (val[i].periodNumber === periodNumber) {
						this.indexNo = i;
						break;
					}
				}
			} else {
				this.indexNo = 0;
			}
		}
	},
	methods: {
		...mapActions('jackpot', ['getPreviousDetail']),
		formatDate(date, style) {
			const regular = style || 'D/M/YYYY HH:mm';
			const temp = new Date(date);
			return dateFormat.format(temp, regular);
		},
		formatNum(val) {
			return formatNumber(val || 0);
		},
		formatResult(val) {
			let str = +val;
			if (val === 0) {
				str = '-:-';
			} else if (val === 2) {
				str = 'X';
			} else if (val === 3) {
				str = '2';
			}
			return str;
		},
		goFAQ() {
			location.href = `${pagePath.help}?nav=jackpot`;
		}
	},

};
</script>
<style lang="less" >
@import '~base/style/mixin.less';
@import '~base/style/variable.less';
@import '~base/style/icon.less';

.m-result {
	margin: 0 18px 30px;
	padding: 0 12px;
	background-color: @dark;
	.result-header {
		padding-top: 16px;
		display: flex;
		align-items: center;
		justify-content: center;
		.game-name {
			flex: 1 1 auto;
			text-align: left;
			font-size: 20px;
			line-height: 32px;
		}
		.jackpot-upgrade-tip {
			cursor: pointer;
			flex: 0 0 auto;
			font-size: 12px;
			line-height: 32px;
			color: @darkGray;
			font-weight: 500;
			.icon-right {
				.m-icon-arrow--right();
				&::before {
					color: @darkGray;
				}
			}
		}
	}
	.period-list {
		height: 50px;
		text-align: right;
		font-size: 0;
		padding-top: 18px;
		.clearfix;
		.period {
			float: left;
			font-size: 20px;
			line-height: 1;
			.select {
				background-color: @dark;
				color: @white;
				font-size: 16px;
			}
		}
	}
	.winnings,
	.results {
		font-size: 14px;
		padding-bottom: 18px;
		h3 {
			padding-bottom: 5px;
		}
		.list {
			width: 100%;
			text-align: center;
			th,
			.title {
				height: 26px;
				line-height: 25px;
				background-color: @blueBlack;
				font-size: 12px
			}
			td {
				border-bottom: 1px solid #454D60;
				font-weight: bold;
				line-height: 38px;
			}
		}
	}
	.results {
		.list {
			padding-bottom: 15px;
			.title,
			.content {
				display: table;
				width: 100%;
				span {
					display: table-cell;
					vertical-align: middle;
				}
				.no {
					width: 50px
				}
				.date {
					width: 120px;
				}
				.match {
					text-align: left;
					padding-left: 8px;
				}
				.score {
					width: 100px;
				}
				.result {
					width: 100px;
				}
				.m-icon-tips {
					display: inline-block;
					vertical-align: top;
					.m-icon-tips();
					width: 16px;
					height: 16px;
					&:before {
						font-size: 14px;
						color: @darkGray;
					}
				}
			}
			.content {
				font-size: 13px;
				border-bottom: 1px solid #454D60;
				padding: 10px 0;
				span {
					line-height: 1.5;
				}
				.match {
					font-weight: bold;
				}
			}
		}
	}
}
.m-result-empty{
	margin: 0 18px 30px;
	background-color: @dark;
	color: @darkGray;
	font-size: 14px;
	text-align: center;
	padding-top: 15%;
	height: 250px;
	.m-icon-pageques();
	&:before{
		display: block;
		font-size:50px;
		color: @darkGray;
	}
}
</style>
