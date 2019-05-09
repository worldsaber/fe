<template>
	<div>
	<Layout :isHaveBottomNav="false" :isHasFooter="false" :isHaveNavBar="hasNavBar" :isNeedScroll="true">
		<div class="m-bingo-detail" slot="mid">
		<template  v-if="page==='detail'">
		<NavBar>
			<homeNav slot="right"/>
		</NavBar>
		<div class="bingo-round-wrap" v-loading="periodLoading">
			<div class="round-pic-wrap">
				<img class="round-pic" :src="roundInfo.picUrl"/>
			</div>
			<div class="round-info-wrap">
				<div class="round-num">Round No. {{roundInfo.roundNo}}</div>
				<div class="round-start-time">Start Time：{{roundInfo.showStartTime}}</div>
				<div class="round-progress-wrap" v-if="roundInfo.status === 1">
					<div class="progress-bar">
						<span :style="'width:' + percent"></span>
					</div>
					<div class="progress-detail-wrap">
						<div class="item">
							<div class="text">{{roundInfo.stock.amount - roundInfo.stock.leftAmount}}</div>
							<div class="text">Joined</div>
						</div>
						<div class="item">
							<div class="text remain">{{roundInfo.stock.leftAmount}}</div>
							<div class="text">Remaining</div>
						</div>
						<div class="item">
							<div class="text">{{roundInfo.stock.amount}}</div>
							<div class="text">Shares in total</div>
						</div>
					</div>
				</div>
				<div class="round-published-wrap" v-if="roundInfo.status === 3 || roundInfo.status === 4">
					<div class="published-title">
						<div class="left">
							<div class="win-label">Winning Number</div>
							<div class="win-number">{{roundInfo.winnerNumber}}</div>
						</div>
						<div class="right" @click="goRules">Rules of Calculation</div>
						<i class="right arrow-right" @click="goRules"/>
					</div>
					<div class="published-body" @click="goWinner">
						<img class="left" src="../../images/golden-cup.svg">
						<div class="right">
							<div class="item winner">Winner: {{roundInfo.winnerInfo.winner}}</div>
							<div class="item shares">Bought {{roundInfo.winnerInfo.boughtAmount + (roundInfo.winnerInfo.boughtAmount > 1 ? ' Shares' : ' Share')}}</div>
							<div class="item">Announcement Time：{{roundInfo.showPublishedTime}}</div>
						</div>
					</div>
				</div>
				<div class="round-timer-wrap" v-if="roundInfo.status === 2">
					<div class="count-down-wrap">
						<div class="left">Count Down</div>
						<div class="right" @click="goRules">Rules of Calculation</div>
						<i class="right arrow-right" @click="goRules"/>
					</div>
					<div class="round-timer">{{time}}</div>
				</div>
			</div>
		</div>
		<div class="round-detail-info">
			<h2 class="info-title">The more shares you get, the more chances to win !</h2>
			<p class="info-text">All purchased shares will get a corresponding number. When all shares are purchased, the winning number will be displayed. Only the customer with the winning number wins, even if the customer only put in KES 1!</p>
		</div>
		<div class="my-part" v-if="roundInfo.boughtNum > 0" @click="goParti()">
			<span class="my-part-title">My Participation</span>
			<span class="my-part-num">Bought {{roundInfo.boughtNum + (roundInfo.boughtNum > 1 ? ' Shares' : ' Share')}} </span>
			<i class="my-part-icon"/>
		</div>
		<af-tabs class="list-wrap" :value="currentTab" @change="handleTabChange" v-if="entityList.length > 0 && historyList.length > 0">
			<af-tab-pane label="Participants" name="participant">
				<div class="list-body" v-loading="partiLoading">
					<participant v-for="(item, index) in entityList" :key="index" :data="item" @click.native="goParti(item)"/>
					<div class="view-all" v-if="hasMoreParti"><span @click="goList({mode: 'both', tab: 'participant'})">View All</span></div>
				</div>
			</af-tab-pane>
			<af-tab-pane label="History" name="history">
				<div class="list-body" v-loading="historyLoading">
					<history v-for="(item, index) in historyList" :key="index" :data="item" @click.native="goRound(item)"/>
					<div class="view-all" v-if="hasMoreHistory"><span @click="goList({mode: 'both', tab: 'history'})">View All</span></div>
				</div>
			</af-tab-pane>
		</af-tabs>
		<template v-else-if="entityList.length > 0">
			<div class="tab-title">Participants</div>
			<div class="list-body" v-loading="partiLoading">
				<participant v-for="(item, index) in entityList" :key="index" :data="item" @click.native="goParti(item)"/>
				<div class="view-all" v-if="hasMoreParti"><span @click="goList({mode: 'participant'})">View All</span></div>
			</div>
		</template>
		<template v-else-if="historyList.length > 0">
			<div class="tab-title">History</div>
			<div class="list-body" v-loading="historyLoading">
				<history v-for="(item, index) in historyList" :key="index" :data="item" @click.native="goRound(item)"/>
				<div class="view-all" v-if="hasMoreHistory"><span @click="goList({mode: 'history'})">View All</span></div>
			</div>
		</template>

		<div class="round-blank"/>
	</template>
	<rules v-else-if="page === 'rules'" :roundInfo="roundInfo" @back="backDetail"/>
	<list v-else :roundInfo="roundInfo" :params="listParams" @back="backDetail"/>
	</div>
	</Layout>
	<div class="round-footer" v-if="showFooter">
		<div class="left" @click="share">Share</div>
		<template v-if="roundInfo.status === 1">
			<div class="right" @click="join" v-if="canAddMore">Add More</div>
			<div class="right" @click="join" v-else>Join now</div>
		</template>
		<template v-else>
			<div class="right" @click="joinAgain" v-if="canJoinAgain">Join Again</div>
			<div class="right soldout" v-else>Sold Out</div>
		</template>
	</div>
	<Share type="bingo" :shareCfg="shareCfg" v-if="showShare" @close-share="hideShowPop"/>
</div>
</template>
<script>
import appCore from 'appCore';
import Layout from 'components/layout/main.vue';
import 'components/loading';
import homeNav from 'components/homeNav';
import { mapMutations } from 'vuex';
import { CHANGE_LOADING } from 'store/layout/mutationTypes';
import dateFormat from 'kernel/js/dateFormat';
import cookie from 'storage/cookie';
import { formatNumber } from 'utils';
import NavBar from 'components/navbar';
import { AfTabs, AfTabPane } from 'packages/tabs';
import participant from '../../components/participant.vue';
import bingoBuy from '../../components/buy';
import history from './pagelet/history.vue';
import Timer from '../../js/timer.js';
import rules from './pagelet/rules.vue';
import list from './pagelet/list.vue';
import { subBingoPush, unsubBingoPush, UTCToServer } from '../../js/utils.js';

const statusMap = {
	1: 1, // Most Popular
	2: 2, // Publishing
	3: 3, // Published
	4: 4, // Published
	10: 10 // Canceled
};

export default {
	components: {
		NavBar,
		Layout,
		AfTabs,
		AfTabPane,
		participant,
		history,
		rules,
		list,
		homeNav
	},
	data() {
		return {
			page: 'detail',
			roundInfo: '',
			roundId: '',
			latestRoundId: '',
			entityList: [],
			historyList: [],
			periodLoading: false,
			partiLoading: false,
			historyLoading: false,
			currentTab: '',
			deltaTime: 0,
			time: '00:00',
			listParams: {
				mode: 'both',
				tab: 'participant'
			},
			showShare: false,
			shareCfg: {
				shareUrl: `${location.origin}/${window.country}/m/sportybingo/home/popular`,
			},
			hasMoreParti: false,
			hasMoreHistory: false,
			latestPeriodLoading: false,
			roundStatus: 1, // 后台ngix缓存
			fetchTimes: 0 // 限制推送刷新期次次数
		};
	},
	computed: {
		hasNavBar() {
			return this.page === 'detail';
		},
		percent() {
			let percent = '0%';
			if (this.roundInfo && this.roundInfo.stock) {
				const stock = this.roundInfo.stock;
				percent = (stock.amount - stock.leftAmount) / stock.amount;
				percent = isNaN(percent) ? '' : `${100 * percent}%`;
			}
			return percent;
		},
		showFooter() {
			return this.page === 'detail' && this.roundInfo && !this.periodLoading && !this.latestPeriodLoading && ([1, 2, 3, 4].indexOf(this.roundInfo.status) > -1);
		},
		canJoinAgain() {
			return this.roundInfo && ([2, 3, 4].indexOf(this.roundInfo.status) > -1) && this.latestRoundId && this.latestRoundId !== this.roundId;
		},
		canAddMore() {
			return this.roundInfo && this.roundInfo.status === 1 && this.roundInfo.boughtNum > 0;
		},
	},
	mounted() {
		// const loading = document.querySelector('#pageLoading');
		// loading && (loading.style.display = 'none');
		this.changeLoading(false);
	},
	created() {
		this.changeLoading(false);
		const { goodsId, status } = this.$router.currentRoute.query;
		this.roundId = this.$router.currentRoute.params.id || '';
		if (goodsId) {
			this.getLatestPeriod(goodsId).then(res => {
				this.roundId = this.latestRoundId || this.roundId;
				this.getPeriod().then(() => {
					subBingoPush({
						roundId: this.roundId,
						goodsId: this.roundInfo.goodsId,
						listener: this.handlePush
					});
				});
			});
		} else {
			this.roundStatus = status || this.roundStatus;
			this.getPeriod().then(() => {
				this.getLatestPeriod(this.roundInfo.goodsId);
				subBingoPush({
					roundId: this.roundId,
					goodsId: this.roundInfo.goodsId,
					listener: this.handlePush
				});
			});
		}
	},
	beforeRouteUpdate(to, from, next) {
		if (to.name === 'detail') {
			Timer.remove(this.updatePeriod);
			Timer.removeHandler(this.updateClock);
			unsubBingoPush({
				listener: this.handlePush,
				goodsId: this.roundInfo.goodsId,
				roundId: this.roundId
			});
			this.roundId = to.params.id || '';
			this.getPeriod().then(() => {
				subBingoPush({
					listener: this.handlePush,
					goodsId: this.roundInfo.goodsId,
					roundId: this.roundId
				});
				document.querySelector('.m-main .m-main-mid').scrollTop = 0;
			});
		}
		next();
	},
	beforeDestroy() {
		Timer.remove(this.updatePeriod);
		Timer.removeHandler(this.updateClock);
		unsubBingoPush({
			listener: this.handlePush,
			goodsId: this.roundInfo.goodsId,
			roundId: this.roundId
		});
	},
	methods: {
		...mapMutations('layout', [CHANGE_LOADING]),
		hideShowPop() {
			this.showShare = false;
		},
		share () {
			if (appCore.getAppName() === 'sportybet') {
				appCore.share({
					title: 'share',
					url: this.shareCfg.shareUrl,
					hideCopy: 'true',
				});
				appCore.shareNow();
			} else {
				this.showShare = true;
			}
		},
		join() {
			if (!window.loginStatus) {
				window.login && window.login.show();
				return;
			}
			bingoBuy({
				goods: this.roundInfo, // 要购买的商品信息
				callback: opt => {
					this.getPeriod().then(() => {
						if (this.roundInfo.stock && this.roundInfo.stock.leftAmount === 0) {
							this.getLatestPeriod(this.roundInfo.goodsId);
						}
					});
				}
			});
		},
		joinAgain() {
			if (!window.loginStatus) {
				window.login && window.login.show();
				return;
			}
			this.$router.replace({
				path: `/detail/${this.latestRoundId}`
			});
		},
		backDetail() {
			this.page = 'detail';
		},
		goRules() {
			this.page = 'rules';
		},
		goList(params) {
			this.listParams = params;
			this.page = 'list';
		},
		goWinner() {
			const userId = this.roundInfo.winnerId;
			this.$router.push({
				path: `/participation/${this.roundId}`,
				query: {
					userId,
					goodsId: this.roundInfo.goodsId
				}
			});
		},
		goParti(item) {
			const userId = item ? item.userId : cookie('userId');
			this.$router.push({
				path: `/participation/${this.roundId}`,
				query: {
					userId,
					goodsId: this.roundInfo.goodsId
				}
			});
		},
		goRound(item) {
			this.$router.push({
				path: `/detail/${item.roundId}`,
				query: {
					status: 4
				}
			});
		},
		getLatestPeriod(goodsId) {
			this.latestPeriodLoading = true;
			return fetch(`/bingowin/goods/latestRound?goodsId=${goodsId}`, {
				methods: 'GET'
			}).then(res => res.json()).then(res => {
				this.latestPeriodLoading = false;
				if (res.bizCode === 10000) {
					if (res.data && res.data.roundId) {
						this.latestRoundId = res.data.roundId;
					}
				}
			}).catch(() => {
				this.latestPeriodLoading = false;
			});
		},
		getPeriod() {
			this.periodLoading = true;
			return fetch(`/bingowin/goods/round?roundId=${this.roundId}&status=${this.roundStatus}`, {
				methods: 'GET'
			}).then(res => res.json()).then(res => {
				this.periodLoading = false;
				if (res.bizCode === 10000) {
					this.deltaTime = (new Date()).getTime() - res.data.serverTime;
					this.roundInfo = this.formatPeriod(res.data);

					// 修改页面title
					if (this.roundInfo.goodsName) {
						document.title = `Sportybet Bingo_${this.roundInfo.goodsName}`;
					}

					this.getPartiList(res.data);
					this.getHistory(res.data);
					if (this.roundInfo.stock.leftAmount === 0 && this.roundInfo.status === 2 && this.fetchTimes < 3) { // 开奖中
						this.fetchTimes++;
						Timer.add(this.updatePeriod, res.data.publishedTime + this.deltaTime);
						Timer.addHandler(this.updateClock);
					}
				} else {
					this.$dialog({
						title: null,
						content: res.message,
						button: ['OK']
					});
				}
			}).catch(() => {
				this.periodLoading = false;
			});
		},
		formatPeriod(period) {
			// period.startTime && (period.showStartTime = dateFormat.format(period.startTime, 'DD/MM/YYYY HH:mm:ss'));
			// period.publishedTime && (period.showPublishedTime = dateFormat.format(period.publishedTime, 'DD/MM/YYYY HH:mm:ss'));
			period.startTime && (period.showStartTime = UTCToServer(period.startTime));
			period.publishedTime && (period.showPublishedTime = UTCToServer(period.publishedTime));
			return period;
		},
		updatePeriod() {
			this.getPeriod();
			Timer.removeHandler(this.updateClock);
		},
		updateClock(ts) {
			const time = this.roundInfo.publishedTime + this.deltaTime - ts;
			if (time <= 0) {
				this.time = '00:00';
			} else {
				this.time = dateFormat.format(time, 'mm:ss');
			}
		},
		getPartiList(round) {
			this.partiLoading = true;
			fetch(`/bingowin/goods/round/participants?roundId=${this.roundId}&pageSize=20&pageNo=1`, {
				methods: 'GET'
			}).then(res => res.json()).then(res => {
				this.partiLoading = false;
				if (res.bizCode === 10000) {
					this.entityList = this.formatEntity(res.data.entityList);
					this.hasMoreParti = res.data.totalNum > res.data.pageSize;
				} else {
					this.$dialog({
						title: null,
						content: res.message,
						button: ['OK']
					});
				}
			}).catch(() => {
				this.partiLoading = false;
			});
		},
		formatEntity(entityList) {
			entityList && entityList.forEach(item => {
				item.showTime = UTCToServer(item.createTime, true);
				item.showBoughtFee = formatNumber(item.boughtFee / 10000, 0);
			});
			return entityList;
		},
		getHistory(round) {
			this.historyLoading = true;
			fetch(`/bingowin/goods/history?goodsId=${this.roundInfo.goodsId}&pageSize=20&pageNo=1`, {
				methods: 'GET'
			}).then(res => res.json()).then(res => {
				this.historyLoading = false;
				console.log(res);
				if (res.bizCode === 10000) {
					this.historyList = this.formatHistory(res.data.entityList);
					this.hasMoreHistory = res.data.totalNum > res.data.pageSize;
				} else {
					this.$dialog({
						title: null,
						content: res.message,
						button: ['OK']
					});
				}
			}).catch(() => {
				this.historyLoading = false;
			});
		},
		formatHistory(history) {
			history && history.forEach(item => {
				// item.showPublishedTime = dateFormat.format(item.publishedTime, 'DD/MM/YYYY HH:mm:ss');
				item.showPublishedTime = UTCToServer(item.publishedTime);
				item.showBoughtFee = `${window.currency} ${formatNumber(item.boughtFee / 10000, 0)}`;
			});
			return history;
		},
		handlePush(data) {
			try {
				const pushData = JSON.parse(data);
				if (statusMap[pushData.status] !== this.roundInfo.status) { // 期次状态发生变化
					this.getPeriod().then(() => {
						if (this.roundInfo.stock && this.roundInfo.stock.leftAmount === 0) {
							this.getLatestPeriod(this.roundInfo.goodsId);
						}
					});
				} else { // 状态没变化，更新份数
					this.roundInfo.stock = {
						amount: pushData.amount,
						leftAmount: pushData.amount - pushData.boughtAmount,
						sharePrice: this.roundInfo.stock.sharePrice
					};
				}
			} catch (e) {
				console.log(e);
			}
		},
		handleTabChange(val) {
			this.currentTab = val;
		},
	}
};
</script>
<style lang="less">
@import '~base/styles/variable.less';
@import 'base/styles/icon.less';

.m-bingo-detail {

	.bingo-round-wrap {
		.round-pic-wrap {
			position: relative;
			min-height: 100/@rem;
			box-sizing: border-box;
			text-align: center;
			.m-icon-logo();
			&::before{
				position: absolute;
				top: 0;
				left: 0;
				z-index: -1;
				width: 100%;
				height: 100%;
				line-height: 100/@rem;
				font-size: 36/@rem;
				color: #d4d6df;
				background-color: #EAECEF;
			}

			.round-pic {
				width: 100%;
				background: #fff;
			}
		}
		.round-info-wrap {
			padding: 15/@rem 16/@rem 12/@rem 16/@rem;
			.round-num {
				line-height: 16/@rem;
				font-size: 14/@rem;
				color: @dark;
			}
			.round-start-time {
				height: 14/@rem;
				font-size: 12/@rem;
				color: @darkGray;
			}
			.round-progress-wrap {
				margin-top: 13/@rem;
				.progress-bar {
					height: 10/@rem;
					border-radius: 5/@rem;
					background-color: @midGray;
					span {
						display: inline-block;
						vertical-align: top;
						height: 10/@rem;
						border-radius: 5/@rem;
						background-image: linear-gradient(to right, #4bdb4d, #009321);
					}
				}
				.progress-detail-wrap {
					display: flex;
					align-items: center;
					justify-content: space-between;
					.item {
						flex: 1 1 auto;
						.text {
							font-size: 12/@rem;
							line-height: 14/@rem;
							color: @darkGray;
							&.remain {
								color: @dark;
							}
						}
					}
				}
			}

			.round-published-wrap {
				margin-top: 12/@rem;
				border: 2/@rem solid #f2af00;

				.published-title {
					display: flex;
					align-items: center;
					justify-content: center;
					background-color: #f2af00;
					color: @white;
					padding: 10/@rem 12/@rem;
					.left {
						flex: 1 1 auto;
						.win-label {
							font-size: 12/@rem;
							line-height: 12/@rem;
							margin-bottom: 2/@rem;
						}
						.win-number {
							font-size: 18/@rem;
							line-height: 24/@rem;
						}
					}
					.right {
						flex: 0 0 auto;
						font-size: 12/@rem;
						line-height: 12/@rem;
						margin-right: 10/@rem;
					}
					.arrow-right {
						.m-icon-arrow--right();
					}
				}
				.published-body {
					display: flex;
					align-items: center;
					justify-content: center;
					padding: 12/@rem 12/@rem 18/@rem 12/@rem;
					background-color: @white;
					.left {
						flex: 0 0 auto;
						padding-left: 6/@rem;
						margin-right: 18/@rem;
					}
					.right {
						flex: 1 1 auto;
						.item {
							line-height: 14/@rem;
							font-size: 12/@rem;
							color: @darkGray;
							&.winner {
								color: @darker;
								margin-bottom: 3/@rem;
							}
							&.shares {
								color: @green;
								margin-bottom: 3/@rem;
							}
						}
					}
				}
			}
			.round-timer-wrap {
				margin-top: 13/@rem;
				border: 3/@rem solid @midGreen;
				.count-down-wrap {
					display: flex;
					align-items: center;
					justify-content: center;
					background-color: @midGreen;
					line-height: 50/@rem;
					.left {
						flex: 1 1 auto;
						font-size: 14/@rem;
						margin-left: 14/@rem;
						font-weight: bold;
						color: @white;
					}
					.right {
						flex: 0 0 auto;
						font-size: 12/@rem;
						color: @white;
						margin-right: 6/@rem;
						&.arrow-right {
							.m-icon-arrow--right();
						}
					}
				}
				.count-down {
					position: relative;
					flex: 0 0 auto;
					padding: 0 14/@rem;
					font-size: 12/@rem;
					line-height: 50/@rem;
					color: @white;
					background-color: @midGreen;
					&::after {
						position: absolute;
						top: 0;
						right: -12/@rem;
						content: '';
						width: 0;
						height: 0;
						border-top: 25/@rem solid @midGreen;
						border-left: 6/@rem solid @midGreen;
						border-right: 6/@rem solid transparent;
						border-bottom: 25/@rem solid transparent;
					}
				}
				.round-timer {
					flex: 1 1 auto;
					background-color: @white;
					font-size: 28/@rem;
					text-align: center;
					font-weight: bold;
					line-height: 50/@rem;
					color: @darker;
				}
			}
		}
	}
	.round-detail-info {
		border-top: 1px solid @lightGray;
		border-bottom: 6/@rem solid @lightGray;
		padding: 20/@rem 16/@rem 15/@rem 16/@rem;
		.info-title {
			margin-bottom: 12/@rem;
			line-height: 16/@rem;
			font-size: 14/@rem;
			font-weight: bold;
			color: @darker;
		}
		.info-text {
			font-size: 12/@rem;
			line-height: 14/@rem;
			color: @dark;
		}
	}
	.my-part {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 16/@rem;
		border-bottom: 6/@rem solid @lightGray;
		line-height: 46/@rem;
		.my-part-title {
			flex: 1 1 auto;
			font-size: 14/@rem;
			font-weight: bold;
			color: @darker;
		}
		.my-part-num {
			flex: 0 0 auto;
			margin-right: 8/@rem;
			font-size: 12/@rem;
			color: @green;
		}
		.my-part-icon {
			.m-icon-arrow--right();
		}
	}

	.list-wrap {
		.m-tabs-nav .m-tabs-tab-active {
			color: @green;
		}
		.m-tabs-ink-bar {
			background-color: @green;
		}
		.m-tabs-nav .m-tabs-tab {
			padding: 15/@rem 16/@rem;
			line-height: 16/@rem;
			font-size: 14/@rem;
		}
	}
	.tab-title {
		padding: 0 16/@rem;
		font-size: 14/@rem;
		line-height: 48/@rem;
	}
	.list-body {
		.view-all {
			padding: 18/@rem 0;
			line-height: 16/@rem;
			font-size: 14/@rem;
			font-weight: 500;
			text-align: center;
			span {
				color: @green;
			}
		}
	}

	.round-blank {
		height: 88/@rem;
	}
}
.round-footer {
	position: absolute;
	z-index: 200;
	left: 0;
	width: 100%;
	bottom: 0;
	padding: 20/@rem 16/@rem;
	background-color: @white;
	box-sizing: border-box;
	display: flex;
	align-items: center;
	justify-content: center;
	.left {
		flex: 0 0 auto;
		margin-right: 12/@rem;
		font-size: 16/@rem;
		line-height: 46/@rem;
		border: 1px solid @green;
		color: @green;
		font-weight: bold;
		padding: 0 25/@rem;
	}
	.right {
		flex: 1 1 auto;
		font-size: 16/@rem;
		font-weight: bold;
		line-height: 46/@rem;
		border: 1px solid @green;
		color: @white;
		background-color: @green;
		text-align: center;
		&.soldout {
			color: @darkGray;
			border-color: @midGray;
			background-color: @midGray;
		}
	}
}

</style>
