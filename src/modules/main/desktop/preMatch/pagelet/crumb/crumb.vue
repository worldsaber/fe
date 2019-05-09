<template>
	<div class="crumb-wrap">
		<div class="crumb" v-if="list && list.length">
			<span v-for="(one, index) in list" :key="index"  v-if="one.val" @click="navClick(one)">{{one.val}}</span>
		</div>
		<div class="btns">
			<span class="printer" v-if="isShowPrinter" @click="printer"></span>
			<span class="refresh" v-if="isShowRefresh" @click="refreshHandle"></span>
		</div>
	</div>
</template>

<script>
import { sportConfigUpperCase } from 'config/sportsType';
import { getTodayTime } from 'components/eventList/util';
import { mapState, mapGetters, mapActions } from 'vuex';
import debounce from 'utils/debounce';
import 'lib/print';
import printStyles from 'lib/print/style/print-styles-list.js';

export default {
	name: 'crumb',
	data() {
		return {
			list: [],
			isShowPrinter: false,
			isShowRefresh: true,
			refresh: false
		};
	},
	created () {
		// 防止多个数据修改调用多次
		this.change = debounce(this.change, 10);
		const { name } = this.$route;
		if (name && name.indexOf('eventList') > -1) {
			this.isShowPrinter = true;
		}
	},
	watch: {
		$route: {
			immediate: true,
			handler (to, from) {
				this.change();
			}
		},
		currentTournaments () {
			this.change();
		},
		// 详情页面的eventInfo发生变化
		eventInfo (val) {
			this.change();
			if (this.$route.name === 'eventDetail') {
				if (!val || !val.eventId) {
					this.isShowRefresh = false;
				} else {
					this.isShowRefresh = true;
				}
			}
		},
		sport (val) {
			if (this.$route.name.indexOf('eventList') > -1) {
				if ((!val || !val.tournamentOrder || !val.tournamentOrder.length) && !this.currentTournaments.length) {
					this.isShowRefresh = false;
					this.isShowPrinter = false;
				} else {
					this.isShowRefresh = true;
					this.isShowPrinter = true;
				}
			}
		}
	},
	computed: {
		...mapState('eventDetail', [
			'eventInfo',
			'currentEvent'
		]),
		...mapGetters('eventDetail', ['getTeamNames']),
		...mapGetters('sidebar', ['tournamentQuery']),
		...mapState('eventList', ['pageNum', 'pageSize', 'marketGroup', 'sport']),
		// 从sidebar中拿到当前的sportId
		...mapState('sidebar', ['currentSportId', 'currentTournaments', 'currentTime']),
		currentAllMarketIds () {
			const res = this.marketGroup[this.currentSportId];
			if (res) {
				return res.reduce((result, cur) => {
					result = result.concat(cur.markets);
					return result;
				}, []);
			}
			return [];
		},
	},
	methods: {
		...mapActions('eventDetail', [
			'fetchMarketGroup',
			'fetchEventDetail',
			'resetEventData'
		]),
		...mapActions('eventList', [
			'fetchImportMatch',
			'fetchSports'
		]),
		navClick (res) {
			// 最后一级不可以点击
			if (res.router && !(this.list[this.list.length - 1] === res)) {
				this.$router.push(res.router);
			}
		},
		change() {
			this.list = [];
			const { name } = this.$route;
			if (!this.currentSportId) {
				return;
			}
			// 获取sportName
			const currentSportId = this.currentSportId;
			const sportName = sportConfigUpperCase[currentSportId.slice(9)];
			const query = {};
			if (+this.currentTime > 0 && +this.currentTime !== 24) {
				query.time = this.currentTime;
			}
			this.list.push({
				val: sportName,
				router: {
					name: 'eventListDefault',
					params: {
						sportName: sportName.toLowerCase()
					},
					query
				}
			});
			// 如果是详情页面，必须要数据加载后再去看导航
			if (name === 'eventDetail') {
				if (this.eventInfo && this.eventInfo.eventId) {
					this.list.push({
						val: this.eventInfo.categoryName + ' ' + this.eventInfo.tournamentName,
						router: {
							name: 'eventList',
							params: {
								sportName: sportName.toLowerCase(),
								categoryId: this.eventInfo.categoryId,
								tournamentId: this.eventInfo.tournamentId
							}
						}
					}, {
						val: this.getTeamNames
					});
				}
			} else if (name === 'eventListToday') {
				this.list.push({
					val: 'Today games',
					router: {
						name: 'eventListToday',
						params: {
							sportName: sportName.toLowerCase()
						}
					}
				});
			} else if (name === 'eventListUpcoming') {
				this.list.push({
					val: 'Upcoming games',
					router: {
						name: 'eventListUpcoming',
						params: {
							sportName: sportName.toLowerCase()
						},
						query: {
							time: 3
						}
					}
				});
			} else if (name === 'eventList') {
				let val = 'Customer coupons';
				if (this.currentTournaments.length === 1) {
					// 这里的name依赖列表的数据或者 左侧导航的数据可能没有，所以加判断
					val = (this.currentTournaments[0].categoryName || '') + ' ' + (this.currentTournaments[0].tournamentName || '');
				}
				this.list.push({
					val,
					router: {
						name: 'eventList',
						params: {
							sportName: sportName.toLowerCase(),
							categoryId: this.tournamentQuery.categoryId,
							tournamentId: this.tournamentQuery.tournamentId
						}
					}
				});
			}
		},
		printer () {
			window.printJS({
				printable: 'importMatch',
				font: 'arial, simsun',
				documentTitle: 'SportyBet',
				styles: printStyles
			});
		},
		getTodayTime,
		refreshHandle() {
			if (this.refresh) {
				return;
			}
			const name = this.$route.name;
			this.refresh = true;
			if (name.indexOf('eventList') > -1) {
				const params = {
					sportId: this.currentSportId,
					marketId: this.currentAllMarketIds.join(','),
				};
				if (name === 'eventListUpcoming' || name === 'eventListDefault' || name === 'eventListToday') {
					params.pageNum = this.pageNum;
					params.pageSize = this.pageSize;
					if (name === 'eventListToday') {
						params.timeline = this.getTodayTime();
						params.todayGames = true;
					} else if (+this.currentTime > 0) {
						params.timeline = this.currentTime;
					}
					// 默认比赛只显示10个
					if (name === 'eventListDefault') {
						params.option = 1;
					}
					this.fetchImportMatch(params)
					.then(() => this.refresh = false);
				} else if (name === 'eventList') {
					params.tournamentId = [this.tournamentQuery.tournamentId.split('_')];
					if (+this.currentTime > 0) {
						params.timeline = this.currentTime;
					}
					this.fetchSports(JSON.stringify([params]))
					.then(() => this.refresh = false);
				}
			} else {
				this.resetEventData({
					eventId: this.currentEvent,
					sportId: this.currentSportId
				});
				this.fetchEventDetail()
				.then(data => this.fetchMarketGroup())
				.then(() => this.refresh = false);
			}
		}
	}

};
</script>

<style lang="less">
@import 'base/style/icon.less';
.crumb-wrap{
	.crumb {
		margin-bottom: 19px;
		margin-top: 3px;
		height: 16px;
		line-height: 16px;
		color: #2564FA;
		font-size: 12px;
		float: left;
		&>span{
			display: inline-block;
			cursor: pointer;
			&:after{
				content: '/';
				padding: 0 3px;
				display: inline-block;
				color: #9CA0AB;
			}
			&:last-child{
				color: #353A45;
				cursor: normal;
				&:after{
					content: ' '
				}
			}
		}
	}
	.btns {
		float: right;
		.printer{
			cursor: pointer;
			.m-icon-print();
			&::before{
				padding-right: 8px;
				display: inline-block;
			}
		}
		.refresh{
			cursor: pointer;
			.m-icon-refresh();
			&::before{
				display: inline-block;
				padding-right: 8px;
			}
		}
	}
	&:after{
		clear: both;
		content: ' ';
		display: block;
		visibility:hidden;
		height: 0;
	}
}
</style>
