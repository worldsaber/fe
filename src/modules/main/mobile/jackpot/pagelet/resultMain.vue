<template>
	<article class="m-result" v-if = "resultPeriods.length">
		<section class="period-list-wrap">
			<div class="period-type">Sporty {{selectType}}</div>
			<div class="period-list">
				<div :class="['round-index',{'active': selectRound}]" @click="triggerRoundList">Round {{ indexNo }} (Sporty {{selectType}})</div>
				<!-- <transition name="fade"> -->
				<ul class="round-list" v-show="selectRound">
					<li v-for="(period, i) in resultPeriods"  :key="period.periodNumber" :class="[`p_${period.periodNumber}`, {'active': period.periodNumber === indexNo}]">
						<a href="javascript:;" @click="setRound(period)">Round {{period.periodNumber}} (Sporty {{period.betType}})</a>
					</li>
				</ul>
				<!-- </transition> -->
			</div>
		</section>
		<div class="jackpot-tip" v-if="showUpgradeTip"><i class="icon-tips"/><p>Please note that Sporty {{selectType}} has upgraded to Sporty {{gameSize}}</p><i class="icon-right" @click="goFAQ"/></div>
		<section  class="result-content">
			<section class="winnings" v-if="(previousDetail.winnings||[]).length > 0">
				<h3>Winnings</h3>
				<table class="list">
					<tr>
						<th>Correct Events</th>
						<th>No. Tickets</th>
						<th>Winning per Ticket</th>
					</tr>
					<tbody>
						<tr v-for="(temp,i) in previousDetail.winnings" :key="i" v-show="temp.winNum>0">
							<td>{{temp.correctEvents}} out of {{previousDetail.betType || '--'}}</td>
							<td>{{temp.winNum}}</td>
							<td class="per-winnings"><span>{{currency}}</span> {{formatNum(temp.perWinnings)}}</td>
						</tr>
					</tbody>
				</table>
			</section>
			<section class="results">
				<h3>Results</h3>
				<dl class="list">
					<dt class="title">
						<span class="no"></span>
						<span class="match">Date/Match</span>
						<span class="score">Score</span>
						<span class="result">Result</span>
					</dt>
					<dd v-for="(temp,i) in previousDetail.elements" :key="i" class="content">
						<span class="no">{{i + 1}}</span>
						<span class="match">{{formatDate(temp.date)}}<br>{{temp.home}}<br>{{temp.away}}</span>
						<span class="score" v-if="temp.result !== 4">{{temp.homeScore}}<br>{{temp.awayScore}}</span>
						<template v-if="temp.result === 4">
							<span class="score void" @click="showTip">Void
								<span class="m-icon-tips"></span>
							</span>
							<span class="result"></span>
						</template>
						<span class="result" v-else>{{formatResult(temp.result)}}</span>
					</dd>

				</dl>
			</section>
			<div class="layout" v-if="selectRound" @click="triggerRoundList"></div>
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
import 'components/dialog';
import { pagePath } from 'config/pageConfig';

export default {
	name: 'resultMain',
	data() {
		return {
			indexNo: '',
			selectType: '',
			selectRound: false,
		};
	},
	computed: {
		...mapState('jackpot', [
			'gameSize',
			'resultPeriods',
			'previousDetail',
		]),
		currency() {
			return mutationTypes.SHOW_CURRENCY;
		},
		showUpgradeTip() {
			return this.selectType > 0 && this.gameSize > 0 && +this.selectType !== +this.gameSize;
		}
	},
	watch: {
		indexNo(val) {
			this.getPreviousDetail(val).then(res => {
				this.selectType = res.betType;
			});
			if (val) {
				const selector = `.p_${val}`;
				this.scrollNav(selector);
			}
		},
		resultPeriods(val) {
			this.indexNo = this.$route.query.periodNumber || val[0].periodNumber;
		}
	},
	methods: {
		...mapActions('jackpot', ['getPreviousDetail']),
		formatDate(date, style) {
			const regular = style || 'DD/MM/YYYY HH:mm';
			const temp = new Date(date);
			return dateFormat.format(temp, regular);
		},
		showTip() {
			this.$dialog({
				title: null,
				content: 'The match is void. Any bet will be counted as right.',
				button: ['*OK']
			});
		},
		formatNum(val) {
			return formatNumber(val || 0, 2);
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
		triggerRoundList() {
			this.selectRound = !this.selectRound;
		},
		setRound(period) {
			this.indexNo = period.periodNumber;
			this.selectType = period.betType;
			this.selectRound = false;
		},
		scrollNav(ev) {
			const wrap = this.$el.querySelector('.round-list');
			if (!wrap) return;
			const selected = wrap.querySelector(ev);
			wrap.scrollTop = selected.offsetTop;
		},
		goFAQ() {
			location.href = `${pagePath.help}#/how-to-play/jackpot`;
		}
	},

};
</script>
<style lang="less">
@import '~base/styles/mixin.less';
@import '~base/styles/variable.less';
@import '~base/styles/icon.less';

.m-result {
	background-color: @blueBlack;
	color: @white;
	border-top: 1px solid fade(@lightGray, 15%);
	.period-list-wrap {
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 8/@rem 0 13/@rem;
		.period-type {
			flex: 0 0 auto;
			padding: 0 16/@rem;
			font-size: 14/@rem;
			line-height: 36/@rem;
			color: @fogGray;
		}
	}
	.period-list {
		height: 36/@rem;
		flex: 1 1 auto;
		position: relative;
		z-index: 50;

		.round-index {
			display: block;
			height: 100%;
			font-size: 14/@rem;
			line-height: 36/@rem;
			padding-left: 8/@rem;
			background: #393c43;
			border-radius: 2px;
			margin: 0 10/@rem;
			position: relative;
			.m-icon-arrow--down();
			&.active{
				.m-icon-arrow--up();
			}
			&:before{
				display: inline-block;
				position: absolute;
				font-weight: bold;
				right: 10/@rem;
				color: @darkGray;
			}
		}
		.round-list{
			max-height: 260/@rem;
			width: 100%;
			overflow-y: auto;
			overflow-x: hidden;
			position: absolute;
			z-index: 50;
			top: 48/@rem;
			padding-bottom: 10/@rem;
			background: @blueBlack;
			li{
				display: block;
				height: 35/@rem;
				background: @blueBlack;
				line-height: 35/@rem;
				font-size: 14px;
				a{
					color: @white;
					display: block;
					padding-left: 15/@rem;
					height: 100%;
					text-decoration: none;
					&:hover,&:active{
						background-color: fade(@dimBlack, 15%);
						text-decoration: none;
					}
				}
				&.active{
					a{
						color: @lightGreen;
					}
				}
			}
		}
	}
	.winnings,
	.results {
		font-size: 14/@rem;
		padding-bottom: 18/@rem;
		h3 {
			height: 32/@rem;
			padding-left: 14/@rem;
			font-size: 14/@rem;
			line-height: 32/@rem;
			background-color: fade(@lightGray, 15%);
			font-weight: bold;
		}
		.list {
			width: 100%;
			text-align: center;

			th,
			.title {
				height: 26/@rem;
				line-height: 25/@rem;
				background-color: @blueBlack;
				font-size: 12/@rem;
				border-bottom: 1/@rem solid #454D60;
				color: @darkGray;
			}
			td {
				border-bottom: 1/@rem solid #454D60;
				font-weight: bold;
				line-height: 38/@rem;
				font-size: 14/@rem;
				span{
					font-weight: normal;
					font-family: 'Roboto'
				}
				&.per-winnings{
					text-align: right;
					padding-right: 11/@rem;
				}
			}
		}
	}
	.winnings{
		.bg(){
			&:before{
				content: '';
				width: 6/@rem;
				height: 0;
				display: block;
				position: absolute;
				top: 0;
				left: 0;
				background-color: inherit;
				border-width: 38/@rem 6/@rem 0 0 ;
				border-style: solid;
				border-color:  @golden transparent;
			}

		}
		tbody{
			tr:nth-of-type(1) td:nth-of-type(1){
				position: relative;
				.bg();
			}
			tr:nth-of-type(2) td:nth-of-type(1){
				position: relative;
				.bg();
				&:before{
					border-color:  @lightGreen transparent ;
				}
			}
			tr:nth-of-type(3) td:nth-of-type(1){
				position: relative;
				.bg();
				&:before{
					border-color: @green transparent;
				}
			}
		}
	}
	.results {
		.list {
			padding-bottom: 15/@rem;
			.title,
			.content {
				display: table;
				width: 100%;
				span {
					display: table-cell;
					vertical-align: middle;
				}
				.no {
					width: 30/@rem
				}
				.match {
					text-align: left;
					padding-left: 8/@rem;
				}
				.score {
					width: 70/@rem;
				}
				.result {
					width: 70/@rem;
				}
				.m-icon-tips {
					display: inline-block;
					vertical-align: top;
					.m-icon-tips();
					width: 16/@rem;
					height: 16/@rem;
					&:before {
						font-size: 12/@rem;
						color: @darkGray;
					}
				}
			}
			.content {
				font-size: 12/@rem;
				border-bottom: 1/@rem solid #454D60;
				padding: 10/@rem 0;
				span {
					line-height: 1.5;
				}
				.score {
					color: @midGreen;
				}
				.score.void{
					color: @white;
				}
			}
		}
	}
	.jackpot-tip {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 7/@rem 8/@rem;
		line-height: 18/@rem;
		background-color: #096124;
		color: @fogGray;
		.icon-tips {
			margin-right: 6/@rem;
			.m-icon-tips();
			&::before {
				font-size: 16/@rem;
				color: @green;
			}
		}
		.icon-right {
			margin-left: 6/@rem;
			.m-icon-arrow--right();
			&::before {
				font-size: 16/@rem;
				color: @green;
			}
		}
		p {
			flex: 1 1 auto;
		}
	}
	.result-content {
		position: relative;
		z-index: 10;
		.layout{
			display: block;
			position: absolute;
			height: 100%;
			width: 100%;
			z-index: 11;
			top: 0;
			background: fade(#000000,60%);
		}
	}
}
.m-result-empty{
	background-color: @blueBlack;
	color: fade(@white, 15%);
	font-size: 14/@rem;
	text-align: center;
	padding-top: 13%;
	height: 160/@rem;
	.m-icon-pageques();
	&:before{
		display: block;
		font-size:50/@rem;
		color: fade(@white, 15%);
	}
}
</style>
