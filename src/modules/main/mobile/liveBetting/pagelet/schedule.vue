<template>
  <div class="m-schedule">
	<!-- 黑色的背景层 -->
	<div class="overly" v-if="isShowOverly"></div>
	<div class="m-active-top">
		<BackBar backText="Back" @backClick="backToOverView"></BackBar>
		<Banner :periodId="periodId" source="live_schedule" v-if="isDuringClaim"/>
		<div :class="['m-choose-nav', {
			'm-choose-nav--active': isShowOverly
		}]">
			<AfSelect :data="dateList" v-model="currentDate"
				ref="chooseTime"
				@input="changeDate"
				@display="changeDisplay"
				:ListWidth="null"
				:isComputedPos="false"
				:itemListCls="['m-sport-item-list']"
				:itemTemplate='itemTemplate'
				class="m-choose-time">
			</AfSelect>
			<AfSelect :data="sportList" v-model="currentSport"
				ref="chooseSport"
				@input="changeSport"
				@display="changeDisplay"
				:ListWidth="null"
				:isComputedPos="false"
				:itemListCls="['m-sport-item-list']"
				class="m-choose-sport">
			</AfSelect>
		</div>
	</div>
	<div v-loading:fetchData.dark="loading" class="m-game-wrap">
		<template v-if="loading === false">
			<template v-if="data && data.length">
				<div class="live-schedule-tip">Events yet to start. You can bet on these events in Prematch.</div>
				<AfTable class="live-list-table">
					<AfTableRow
						v-for="event in data"
						:key="event.eventId"
						class="live-list-table-list"
						@click.native="handleClick(event.sportName, event.categoryId, event.tournamentId, event.eventId)">
						<div class="time-label">{{event.clockTime}}</div>
						<AfTableCell class="time"></AfTableCell>
						<AfTableCell class="vs">
							<span class="team">{{event.hostTeam}}</span>
							<span class="team">{{event.awayTeam}}</span>
							<span>{{event.categoryName}} {{event.tournamentName}}</span>
						</AfTableCell>
						<AfTableCell class="arrow"><i class="m-icon-right"/></AfTableCell>
					</AfTableRow>
				</AfTable>
			</template>
			<div class="no-data" v-else>
				<p>Sorry, there are no games currently </p>
				<p>available in this category. Please try later.</p>
				<p>Thank you.</p>
			</div>
		</template>
	</div>
  </div>
</template>

<script>
	import 'components/loading';
	import 'packages/select/index';
	import BackBar from 'components/navbar';
	import { CHANGE_LOADING } from 'store/layout/mutationTypes';
	import { mapMutations, mapGetters, mapState } from 'vuex';
	import AfTable from 'packages/tableLayout/table';
	import AfTableCell from 'packages/tableLayout/tableCell';
	import AfTableRow from 'packages/tableLayout/tableRow';
	import dateFormat from 'kernel/js/dateFormat';
	import { /* pagePath,*/ baseUrl } from 'config/pageConfig';
	import sportsConfig, { sportsConfigById } from 'config/sports';
	import Banner from 'components/oddsBoost/banner';

	// 下拉列表自定义
	const itemTemplate = {
		name: 'item',
		props: {
			data: {
				type: [Object],
				required: true,
			}
		},
		render (h) {
			const result = [];
			// 比分
			result.push(h('span', { 'class': 'event-match-item-left' }, this.data.dName));
			result.push(h('span', { 'class': 'event-match-item-right' }, this.data.date));
			return h('span', { 'class': ['af-select-item'] }, result);
		}
	};
	export default {
		components: {
			AfTable,
			AfTableCell,
			AfTableRow,
			BackBar,
			Banner
		},
		data () {
			return {
				dateList: [],
				sportList: Object.values(sportsConfig).map(sport => ({
					id: sport.id,
					name: sport.text
				})),
				currentDate: '',
				currentSport: {},
				loading: false,
				data: [],
				listWidth: document.documentElement.clientWidth,
				// 是否显示蒙曾- 即select是否打开
				isShowOverly: false,
				// homeUrl: pagePath.home
			};
		},
		computed: {
			...mapState('oddsBoost', [
				'periodId'
			]),
			...mapGetters('oddsBoost', [
				'isDuringClaim'
			])
		},
		created () {
			this.itemTemplate = itemTemplate;
			const d = new Date();
			const dateList = [];
			for (let i = 1; i <= 5; i++) {
				const res = {
					index: i - 1,
					dName: i === 1 ? 'Today' : i === 2 ? 'Tomorrow' : dateFormat.format(d, 'dddd'),
					date: dateFormat.format(d, 'DD/MM')
				};
				res.name = res.dName + '  ' + res.date;
				dateList.push(res);
				d.setDate(d.getDate() + 1);
			}
			this.dateList = dateList;
		},
		watch: {
			$route: {
				immediate: true,
				handler () {
					const { params = {}, query = {}} = this.$route;
					const sport = sportsConfig[params.sportName];
					const date = query.date;
					this.$nextTick(() => {
						let index = 0;
						if (date) {
							index = this.dateList.findIndex(cur => cur.date === date);
						}
						if (sport) {
							this.currentSport = {
								id: sport.id,
								name: sport.text
							};
						} else {
							this.currentSport = this.sportList[0];
						}
						this.currentDate = this.dateList[index] ? this.dateList[index] : this.dateList[0];
						this.fetchData();
					});
				}
			}
		},
		methods: {
			...mapMutations('layout', {
				pageLoading: CHANGE_LOADING
			}),
			changeDisplay(isDisplay) {
				const { chooseTime, chooseSport } = this.$refs;
				if (isDisplay) {
					this.isShowOverly = true;
				} else if (!chooseTime.isShowList && !chooseSport.isShowList) {
					this.isShowOverly = false;
				}
			},
			backToOverView() {
				this.$router.back();
			},
			changeSport (val) {
				this.$router.replace({
					name: 'schedule',
					params: {
						sportName: sportsConfigById[val.id].name
					},
					query: {
						date: this.currentDate ? this.currentDate.date : this.dateList[0].date
					}
				});
			},
			changeDate(date) {
				this.currentDate = date;
				this.$router.replace({
					name: 'schedule',
					params: {
						sportName: sportsConfigById[this.currentSport.id].name
					},
					query: {
						date: this.currentDate ? this.currentDate.date : this.dateList[0].date
					}
				});
			},
			// 点击任意条目，跳转至该比赛的Prematch Market页面
			handleClick(sportName, categoryId, tournamentId, eventId) {
				location.href = `${baseUrl}sport/${sportName}/${categoryId}/${tournamentId}/${eventId}`;
			},
			fetchData () {
				this.pageLoading(false);
				this.loading = true;
				const first = new Date();
				const next = new Date(+first);
				next.setHours(0);
				next.setMinutes(0);
				next.setSeconds(0);
				next.setMilliseconds(0);
				next.setDate(next.getDate() + 1);
				const t = (next - first) / (60 * 60 * 1000);
				const currentDate = this.currentDate;
				const index = currentDate.index;
				let startTimeline;
				let timeline;
				if (index === 0) {
					startTimeline = 0;
					timeline = t;
				} else {
					startTimeline = t + (index - 1) * 24;
					timeline = t + index * 24;
				}
				startTimeline = startTimeline.toFixed(2);
				timeline = timeline.toFixed(2);
				return fetch('/factsCenter/schedule', {
					body: {
						sportId: this.currentSport.id,
						startTimeline,
						timeline
					}
				})
				.then(res => res.json())
				.then(res => {
					if (res.bizCode === 10000) {
						const data = res.data || [];
						/* 格式化 event :
						* {
						*   clockTime: '19:30',
						*   hostTeam: 'Manchester United',
						*   awayTeam: 'Real Madrid',
						*   categoryName: 'xxx';
						* 	 tournamentName: 'yyy';
						*/
						this.data = data.reduce((result, event) => {
							const ret = {};
							if (!event.sport || !event.sport.id) {
								return result;
							}
							ret.clockTime = event.estimateStartTime ? dateFormat.format(event.estimateStartTime, 'HH:mm') : '';
							ret.hostTeam = event.homeTeamName;
							ret.awayTeam = event.awayTeamName;
							ret.sportId = event.sport.id;
							ret.sportName = sportsConfigById[ret.sportId].name;
							ret.eventId = event.eventId;
							ret.categoryName = event.sport.category.name;
							ret.categoryId = event.sport.category.id;
							ret.tournamentName = event.sport.category.tournament.name;
							ret.tournamentId = event.sport.category.tournament.id;
							result.push(ret);
							return result;
						}, []);
						return;
					}
					return Promise.reject();
				})
				.then(res => {
					this.$nextTick(() => {
						this.loading = false;
					});
				})
				.catch(e => {
					console.log(e); // eslint-disable-line
					this.loading = -1;
				});
			}
		}
	};
</script>

<style lang="less">
@import '~base/styles/variable.less';
@import '~base/styles/mixin.less';
@import 'base/styles/icon.less';
html,body{
	background-color: @dark;
}
.m-schedule{
	.no-data{
		text-align: center;
		margin-top: 15%;
		margin-bottom: 15%;
		.m-icon-exclamation();
		padding: 28/@rem;
		color: @darkGray;
		&:before{
			color: fade(@lightGray, 15%);
			font-size: 30/@rem;
		}
	}
	.m-loading-wrap{
		margin-top: 15%;
	}
	.overly{
		background-color: #000;
		opacity: .6;
		position: fixed;
		z-index: 666;
		height: 100%;
		width: 100%;
	}
	.m-active-top{
		position: relative;
		z-index: 777;
		top: 0px;
		left: 0px;
		width: 100%;
	}
	.m-change-see-wrap{
		background-color: @white;
		.m-change-see{
			height: 48/@rem;
			width: 48/@rem;
			display: flex;
			width: (240/360) * 100%;
			margin: 0 auto;
			li{
				text-align: center;
				font-size: 14/@rem;
				flex: 1;
				color: @dark;
				line-height: 48/@rem;
				&.active{
					border-bottom: 4px solid @red;
				}
			}
		}
	}
	text-align: center;
	color:@white;
	box-sizing: border-box;
	.m-choose-nav{
		padding: 14/@rem 10/@rem 0;
		display: flex;
		position: relative;
    	background-color: @dark;
		.m-choose-sport, .m-choose-time{
			flex:1;
			position: static!important;
			.af-select-title{
				background-color: @dark;
				border: 1px solid @dark;
				border-radius: 2/@rem;
				height: 36/@rem;
				.af-select-input{
					height: 36/@rem;
					line-height: 36/@rem;
				}

			}
			.af-select-icon-item{
				.icon{
					line-height: 36/@rem;
					height: 36/@rem;
					font-size: 0px;
					.m-icon-arrow--down();
					padding-right: 10/@rem;
					&:before{
						color: @white;
						opacity: .4;
					}
				}
			}
			&.af-select-open{
				.af-select-title{
					background-color: @dark;
					border: 1px solid @dark;
				}
				.af-select-icon-item{
					.icon{
						.m-icon-arrow--up();
						&:before{
							opacity: .9;
						}
					}
				}
			}
		}
		.m-choose-time{
			margin-right: 4/@rem;
		}
		.m-sport-item-list{
			width: 100%;
			background: @dark;
			border: 0px;
			left: 0px!important;
			padding: 10/@rem;
			margin-top: 0/@rem;
			box-sizing: border-box;
			.af-select-item{
				color: @white;
				height: 36/@rem;
				line-height: 36/@rem;
				text-align: left;
				display: flex;
				&:active{
					background-color: fade(@lightGray, 15%);
				}
				&.active{
					background: transparent;
					color:@green;
					&>span{
						&:last-child{
							color:@white;
						}
					}
				}
				&>span{
					flex:1;
					display: block;
					width: 50%;
					&:last-child{
						opacity: .5;
						text-align: right;
					}
				}
			}
		}
		&--active{
			background-color: @dark;
		}
	}

	.live-schedule-tip {
		padding: 9/@rem 6/@rem;
		font-size: 12/@rem;
		color: @fogGray;
		line-height: 14/@rem;
		background-color: #21683e;
		text-align: left;
	}

	.live-list-table{
		padding: 0 10/@rem;
		box-sizing: border-box;
		text-align: left;
		.m-table-cell{
			font-size: 14px;
		}
		&-list {
			position: relative;
			text-align: left;
			border-bottom: 1px solid fade(@lightGray, 15%);
			justify-content: center;
			align-items: center;
			table-layout: fixed;
			.time {
				box-sizing: border-box;
				flex: 0 1 auto;
				width: 14%;
				white-space: nowrap;
			}
			.time-label {
				position: absolute;
				top: 10/@rem;
				left: 0;
			}
			.vs{
				flex: 1;
				box-sizing: border-box;
				padding: 10/@rem;
				>span{
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
					display: block;
					box-sizing: border-box;
				}
				.team{
					color: @green;
				}
			}
			.arrow {
				flex: 0 0 auto;
				padding: 10/@rem;
			}
			.m-icon-right {
				.m-icon-arrow--right();
				&::before {
					color: @lightGreen;
				}
			}
		}
	}
	.m-schedule-no-data {
		text-align: left;
		color: @midGray;
		font-size: 14/@rem;
		margin: 0 auto;
		display: inline-block;
		padding: 75/@rem 0;
		p{
			word-break: keep-all;
			white-space: nowrap;
		}
	}
}
</style>
