<template>
	<div>
		<div class="roulette-history-mask" @click="close">
			<i class="close"></i>
		</div>
		<template v-if="!noData">
			<template v-if="!showDetail">
				<div class="roulette-history-wrapper movie" v-loading:getHistory="isLoading">
					<h1 class="title">Bet History<div @click="goToUrl(userCenterUrl['transaction'])" class="go-transaction">Transactions</div></h1>
					<AfTable>
						<AfTableRow class="legends">
							<AfTableCell class="legend">Time</AfTableCell>
							<AfTableCell class="legend">Result</AfTableCell>
							<AfTableCell class="legend">Stake({{currency}})</AfTableCell>
							<AfTableCell class="legend status">Status</AfTableCell>
						</AfTableRow>
					</AfTable>
					<AfTable v-for="(item,i) in history" :key="i">
						<section class="m-trans-mon" v-if="item.isShowDate">
							<AfTableRow class="date">{{item.showDate}}</AfTableRow>
						</section>
						<AfTableRow class="contents" @click.native="toDetail(item.betId)">
							<AfTableCell class="time">{{item.showTime}}</AfTableCell>
							<AfTableCell class="outcome">
								<div class="result-wrapper">
									<div class="result" :style="`background:${item.color}`">{{item.result}}</div>
								</div>
							</AfTableCell>
							<AfTableCell class="stake">{{item.stake}}</AfTableCell>
							<AfTableCell :class="['status',item.statusStyle]">
								<img class="cup" src="../images/small-cup.png" v-if="item.statusStyle==='won'"/>
								<span>{{item.status}}</span>
								<span class="arrow"></span>
							</AfTableCell>
						</AfTableRow>
					</AfTable>
					<p class="no-more" v-if="noMore">- No More Tickets -</p>
				</div>
			</template>
			<template v-else>
				<Detail :betDetail="betDetail" :detailLoading="detailLoading" @back2History="handleBack"/>
			</template>
		</template>
		<template v-else>
			<div class="roulette-history-wrapper">
				<h1 class="title">Bet History<div @click="goToUrl(userCenterUrl['transaction'])" class="go-transaction">Transactions</div></h1>
				<div class="no-data">
					<img src="../images/warning.png">
					<p>No bets available</p>
				</div>
			</div>
		</template>
	</div>
</template>

<script>
import { AfTable, AfTableRow, AfTableCell } from 'packages/tableLayout';
import dateFormat from 'kernel/js/dateFormat';
import 'components/login/popupLogin';
import Detail from './historyDetail';
import { userCenterUrl } from '../../../common-wap/config/mycenter/dataConfig';

export default {
	data() {
		return {
			currency: window.currency,
			history: {},
			totalNum: 0,
			showDateObj: {},
			lastBetId: '',
			showDetail: false,
			betDetail: {},
			betInfo: {},
			noData: false,
			isLoading: false,
			isAjax: false,
			detailLoading: false,
			userCenterUrl,
		};
	},
	computed: {
		hasMore() {
			return this.history.length > 0 && this.history.length < this.totalNum;
		},
		noMore() {
			return this.history.length > 20 && this.history.length >= this.totalNum;
		}
	},
	components: {
		AfTable,
		AfTableRow,
		AfTableCell,
		Detail
	},
	created() {
		this.getHistory();
	},
	mounted() {
		this.handleScroll();
	},
	methods: {
		handleScroll() {
			const wrapper = document.querySelector('.roulette-history-wrapper');
			wrapper.addEventListener('scroll', e => {
				this.bindBarFixed();
				if (wrapper.scrollTop + wrapper.clientHeight >= wrapper.scrollHeight && !this.isAjax && this.hasMore) {
					this.getHistory();
				}
			});
		},
		close() {
			this.$emit('close');
		},
		getHistory() {
			this.isLoading = true;
			this.isAjax = true;
			let params;
			if (this.lastBetId) {
				params = {
					lastBetId: this.lastBetId,
					limit: 20
				};
			}
			fetch('/highfreq/roulette/bethistory', {
				method: 'GET',
				body: params || { limit: 20 }
			})
			.then(res => res.json())
			.then(res => {
				if (res.bizCode === 10000) {
					if (res.data.list.length === 0) this.noData = true;
					this.totalNum = res.data.totalNum;
					this.formatHistoryData(res.data);
					this.isLoading = false;
					this.isAjax = false;
				} else {
					this.$toast('Sorry，something went wrong. Please try again later.');
					this.isLoading = false;
					this.isAjax = false;
				}
			})
			.catch(e => {
				this.isLoading = false;
				this.isAjax = false;
				this.$toast('No internet connection, try again.');
				console.log(e);
			});
		},
		formatHistoryData(data) {
			const history = data.list;
			if (history.length > 0) this.lastBetId = history[history.length - 1].betId;
			history.map(item => {
				if (new Date(item.placeTime).toDateString() === new Date().toDateString()) {
					item.showDate = 'Today';
				} else if (this.isYesterday(item.placeTime)) {
					item.showDate = 'Yesterday';
				} else {
					item.showDate = dateFormat.format(item.placeTime, 'DD/MM/YYYY');
				}
				if (this.showDateObj[item.showDate]) {
					item.isShowDate = false;
				} else {
					this.showDateObj[item.showDate] = 1;
					item.isShowDate = true;
				}

				item.showTime = dateFormat.format(item.placeTime, 'HH:mm:ss');
				item.color = this.getColor(item.result);
				if (item.status === 0) {
					item.status = 'Running';
					item.statusStyle = 'running';
				}
				if (item.status === 1) {
					item.status = item.winningAmount;
					item.statusStyle = 'won';
				}
				if (item.status === 2) {
					item.status = 'Lost';
					item.statusStyle = 'lost';
				}
				return item;
			});
			this.history = [...this.history, ...history];
		},
		isYesterday(theDate) {
			const date = (new Date());    // 当前时间
			const today = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime(); // 今天凌晨
			const yestday = new Date(today - (24 * 3600 * 1000)).getTime();
			return (theDate < today) && (yestday <= theDate);
		},
		getColor(data) {
			if (['1', '3', '5', '8', '10', '12'].includes(data)) {
				return '#e41827';
			}
			if (['2', '4', '6', '7', '9', '11'].includes(data)) {
				return '#000';
			}
			if (data === '0') {
				return '#0d9737';
			}
		},
		toDetail(id) {
			fetch('highfreq/roulette/betdetail', {
				method: 'GET',
				body: {
					betId: id
				}
			})
			.then(res => res.json())
			.then(res => {
				if (res.login === false) {
					this.$popupLogin.show();
				} else if (res.bizCode === 10000) {
					this.detailLoading = true;
					this.showDetail = true;
					this.formatDetail(res.data);
					this.detailLoading = false;
				} else {
					this.$toast('Sorry，something went wrong. Please try again later.');
				}
			})
			.catch(e => {
				this.$toast('No internet connection, try again.');
				console.log(e);
			});
		},
		formatDetail(data) {
			for (const item of data.betInfo) {
				if (!this.betInfo[item.name]) {
					this.betInfo[item.name] = {};
					this.betInfo[item.name].selections = [];
					this.betInfo[item.name].name = item.name;
					this.betInfo[item.name].odds = item.odds;
				}
				if (item.winning) {
					this.betInfo[item.name].winning = true;
				}
				this.betInfo[item.name].selections.push({
					selection: item.selection,
					stake: item.stake,
					winning: item.winning,
					color: this.getColor(item.selection),
				});
			}
			data.betInfo = this.betInfo;
			data.placeTime = dateFormat.format(data.placeTime, 'DD/MM HH:mm:ss');
			if (data.status === 0) {
				data.status = 'Running';
				data.statusStyle = 'running';
			}
			if (data.status === 1) {
				data.status = data.winningAmount;
				data.statusStyle = 'won';
			}
			if (data.status === 2) {
				data.status = 'Lost';
				data.statusStyle = 'lost';
			}
			data.color = this.getColor(data.result);
			this.betDetail = data;
		},
		handleBack() {
			document.querySelector('.roulette-history-mask').removeClass('detail');
			this.showDetail = false;
			this.isAjax = false;
			this.betDetail = {};
			this.betInfo = {};
			this.$nextTick(() => {
				this.handleScroll();
			});
		},
		bindBarFixed () {
			const wrapper = document.querySelector('.roulette-history-wrapper');
			const divs = wrapper.querySelectorAll('.m-trans-mon');
			const len = divs.length;
			for (let i = 0; i < len; i++) {
				if (divs[i].getBoundingClientRect().top <= 129 && (!divs[i + 1] || divs[i + 1].getBoundingClientRect().top) > 0) {
					divs[i].querySelector('div').addClass('m-trans-mon-fixed');
				} else {
					divs[i].querySelector('div').removeClass('m-trans-mon-fixed');
				}
			}
		},
		goToUrl (url) {
			window.location.href = URL.addPara(url, {
				source: 'me'
			});
		},
	},
};
</script>

<style lang="less">
@import '~base/styles/variable.less';
@import '~base/styles/icon.less';
	.roulette-history-mask {
		height: 100vh;
		width: 100vw;
		background: @black;
		opacity: 0.8;
		.close {
			display: inline-block;
			width: 22/@rem;
			height: 22/@rem;
			line-height: 22/@rem;
			border: 1/@rem solid @white;
			border-radius: 50%;
			color: @white;
			text-align: center;
			position: relative;
			top: 14vh;
			left: 50%;
			transform: translateX(-50%);
			.m-icon-close();
			&:before {
				font-size: 10/@rem;
			}
		}
	}
	.roulette-history-wrapper {
		background: linear-gradient(to bottom, #4d1aae, #5d44dd);
		border-top: 1px solid rgba(255, 255, 255, 0.3);
		width: 100vw;
		height: 80vh;
		overflow: scroll;
		position: absolute;
		top: 20vh;
		.title {
			position: relative;
			margin: 14/@rem 0;
			text-align: center;
			color: @white;
			font-size: 22/@rem;
			line-height: 24/@rem;
			font-weight: 600;
			.go-transaction {
				position: absolute;
				top: 6/@rem;
				right: 12/@rem;
				line-height: 14/@rem;
				height: 14/@rem;
				font-size: 12/@rem;
				color: @white;
				font-weight: normal;
			}
		}
		.m-table-cell {
			min-width: 50/@rem;
		}
		.m-table-cell.outcome {
			width: 0;
		}
		.legends {
			background: #8464cb;
			border-bottom: 1px solid rgba(255, 255, 255, 0.3);
			padding-left: 12/@rem;
			box-sizing: border-box;
			color: @white;
			height: 27/@rem;
			line-height: 27/@rem;
			font-size: 13/@rem;
			font-weight: 600;
			.status {
				width: 60/@rem;
				text-align: right;
				padding-right: 12/@rem;
			}
		}
		.date {
			background: @black;
			height: 28/@rem;
			line-height: 28/@rem;
			justify-content: center;
			color: @white;
			font-size: 14/@rem;
			font-weight: 600;
		}
		.m-trans-mon-fixed {
			position: fixed;
			top: 0;
			transform: translateY(20vh);
			-webkit-box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.13);
			box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.13);
			z-index: 10;
		}
		.contents {
			padding-left: 12/@rem;
			box-sizing: border-box;
			color: @white;
			height: 38/@rem;
			border-bottom: 1px solid #6843bf;
			line-height: 38/@rem;
			font-size: 13/@rem;
			font-weight: 600;
			position: relative;
			.result-wrapper {
				width: 40/@rem;
				margin-left: -20px;
				text-align: center;
				.result {
					display: inline-block;
					width: 22/@rem;
					height: 22/@rem;
					line-height: 22/@rem;
					border-radius: 11/@rem;
					text-align: center;
				}
			}
			.status {
				text-align: right;
				position: relative;
    			right: 36/@rem;
			}
			.running {
				color: #00d8ff;
			}
			.won {
				width: 50/@rem;
				color: #ffc600;
			}
			.cup {
				width: 19/@rem;
				height: 19/@rem;
				margin-right: 5/@rem;
			  }
			  .arrow {
				// width:50px;
				.m-icon-arrow--right();
				&:before {
					color: @white;
					position: absolute;
					top: 0;
					margin-left: 10/@rem;
				}
			  }
		}
		.no-more {
			text-align: center;
			color: @white;
			font-size: 14/@rem;
			margin-top: 20/@rem;
			margin-bottom: 20/@rem;
		}
		.arrow-up {
			.m-icon-arrow--down();
			position: fixed;
			left: 50%;
			bottom: 15/@rem;
			transform: translateX(-50%);
			color: @white;
			font-size: 28/@rem;
		}
		.arrow-down {
			.m-icon-arrow--down();
			position: fixed;
			left: 50%;
			bottom: 9/@rem;
			transform: translateX(-50%);
			color: @white;
			font-size: 28/@rem;
		}
		.no-data {
			color:  @white;
			img {
				display: inline-block;
				width: 40/@rem;
				height: 34/@rem;
				margin: 151/@rem 0 6/@rem 159/@rem;
				margin-left: 159/@rem;
			}
			p {
				text-align: center;
				font-size: 13/@rem;
				font-weight: 600;
			}
		}
	}
	.movie {
			animation: down-to-up 0.2s;
			animation-fill-mode: forwards;
			position: absolute;
			@keyframes down-to-up
			{
				0% {top: 75vh}
				25% {top: 62vh}
				50% {top: 48vh}
				75% {top: 34vh}
				100% {top: 20vh}
			}
		}
</style>
