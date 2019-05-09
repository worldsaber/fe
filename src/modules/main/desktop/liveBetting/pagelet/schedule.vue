<template>
  <div class="m-schedule">
	<div class="sport-name">
		<div :class="['sport-name-item', { active: currentSportId.id === sport.id }]"
			v-for="sport in preSportList"
			:key="sport.id"
			@click="onChangeSport(sport.name)">
			<div class="text">{{sport.name}}</div>
		</div>
		<SimpleSelect :class="['sport-simple-select', isSelectedActive ? 'sport-simple-select-active' : '' ]" 
			:data="postSportList" placeholder="More Games" 
			@selected="onSelectedSport" :defaultIndex="defaultIndex" ref="select"></SimpleSelect>
	</div>
	<div class="m-choose-date">
		<div :class="[
			'm-choose-date-item',
			{
				active: date === currentDate
			}
		]"
		v-for="date in dateList"
		@click="changeDate(date)"
		:key="date.time">
			<span>{{date.dayNames}}</span>
			<span>{{date.date}}</span>
		</div>
	</div>
	  <div v-loading:fetchData.dark="loading">
		<template v-if="loading === false">
			<AfTable class="live-list-table" v-if="data && data.length">
				<AfTableRow class="live-list-table-header">
					<AfTableCell class="time">Time</AfTableCell>
					<AfTableCell class="vs">Event</AfTableCell>
					<AfTableCell class="league">League</AfTableCell>
					<AfTableCell class="detail"></AfTableCell>
				</AfTableRow>
				<AfTableRow
					v-for="(event, index) in data"
					:key="index"
					class="live-list-table-list"
					@click.native="handleClick(event.sportName, event.categoryId, event.tournamentId, event.eventId)">
					<AfTableCell class="time">{{event.clockTime}}</AfTableCell>
					<AfTableCell class="vs">
						<span>{{event.hostTeam}}</span>
						<span>{{event.awayTeam}}</span>
					</AfTableCell>
					<AfTableCell class="league">
						<span>{{event.categoryName}}</span>
						<span>{{event.tournamentName}}</span>
					</AfTableCell>
					<AfTableCell class="detail"><span>Details</span></AfTableCell>
				</AfTableRow>
			</AfTable>
			<div class="m-schedule-no-data" v-else>
				<p>Sorry, there are no games currently available in this category. </p>
				<p>Please try later. Thank you.</p>
			</div>
		</template>
	  </div>
  </div>
</template>

<script>
	import { sportType2Id, sportConfigLowerCase, sportListUpperCase, getSportRoute } from 'config/sportsType';
	import 'components/loading';
	import AfTable from 'packages/tableLayout/table';
	import AfTableCell from 'packages/tableLayout/tableCell';
	import AfTableRow from 'packages/tableLayout/tableRow';
	import SimpleSelect from 'components/simpleSelect';
	import dateFormat from 'kernel/js/dateFormat';
	import { baseUrl } from 'config/pageConfig';
	import '../../mockData/schedule/schedule?debug';

	export default {
		components: {
			AfTable,
			AfTableCell,
			AfTableRow,
			SimpleSelect
		},
		data () {
			return {
				dateList: [],
				// 所有的运动类型写死
				sportList: sportListUpperCase.map(cur => ({
					...cur,
					id: 'sr:sport:' + cur.id
				})),
				currentDate: '',
				currentSportId: '',
				loading: false,
				data: []
			};
		},
		computed: {
			preSportList() {
				return this.sportList.slice(0, 7);
			},
			postSportList() {
				const list = this.sportList.slice(7);
				return list.map(item => ({
					...item,
					label: item.name
				}));
			},
			postSportId() {
				return this.postSportList.map(item => item.id);
			},
			isSelectedActive() {
				return this.postSportId.includes(this.currentSportId.id);
			},
			defaultIndex() {
				return this.postSportList.findIndex(item => item.id === this.currentSportId.id);
			},
		},
		created () {
			const d = new Date();
			const dateList = [];
			for (let i = 1; i <= 5; i++) {
				const res = {
					index: i - 1,
					dayNames: i === 1 ? 'Today' : i === 2 ? 'Tomorrow' : dateFormat.format(d, 'dddd'),
					date: dateFormat.format(d, 'DD/MM')
				};
				dateList.push(res);
				d.setDate(d.getDate() + 1);
			}
			this.dateList = dateList;
		},
		watch: {
			$route: {
				immediate: true,
				handler () {
					const { params = {}} = this.$route;
					// url参数全部小写
					const sportName = (params.sportName || '');
					this.$nextTick(() => {
						if (sportType2Id[sportName]) {
							let sportId = sportType2Id[sportName];
							sportId = `sr:sport:${sportId}`;
							this.currentSportId = this.sportList.find(current => current.id === sportId);
						}
						if (!this.currentSportId) {
							this.currentSportId = this.sportList[0];
						}
						this.currentDate = this.dateList[0];
						this.fetchData();
					});
				}
			}
		},
		methods: {
			changeSport (name) {
				this.$router.push({
					name: 'schedule',
					params: {
						sportName: getSportRoute(name)
					}
				});
			},
			changeDate(date) {
				this.currentDate = date;
				this.fetchData();
			},
			// 点击任意条目，跳转至该比赛的Prematch Market页面
			handleClick(sportName, categoryId, tournamentId, eventId) {
				location.href = `${baseUrl}sport/${sportName}/${categoryId}/${tournamentId}/${eventId}`;
			},
			fetchData () {
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
						sportId: this.currentSportId.id,
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
							ret.sportName = sportConfigLowerCase[ret.sportId.slice(9)];
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
					this.$nextTick(() => this.loading = false);
				})
				.catch(() => {
					this.loading = -1;
				});
			},
			onSelectedSport(payload) {
				const name = payload.item.name;
				this.changeSport(name);
			},
			onChangeSport(name) {
				this.changeSport(name);
				const $select = this.$refs.select;
				$select && $select.clear();
			}
		},
	
	};
</script>

<style lang="less">
@import '~base/style/variable.less';
@import '~base/style/mixin.less';
@import 'base/style/icon.less';

.m-schedule{
	text-align: center;
	width: 745px;
	margin-right: 15px;
	background-color: @dark;
	color:@white;
	box-sizing: border-box;
	padding: 0 10px;
	.sport-name {
		cursor: pointer;
		border-bottom: 1px solid fade(@lightGray, 15%);
		text-align: left;
		.clearfix();
		padding-left: 3px;
		display: flex;
		// text-align: center;
		justify-content: space-between;
		.sport-name-item{
			height: 48px;
			line-height: 48px;
			padding: 0 15px;
			margin-bottom: -1px;
			.text {
				font-size: 14px;
				color: @white;
			}
			&:hover{
				border-bottom: 4px solid fadeout(@green, 30%);
			}
			&.active {
				font-weight: 700;
				border-bottom: 4px solid @green
			}
		}
		.sport-simple-select{
			height: 48px;
			line-height: 48px;
			color: #FFF;
			width: 130px;
			font-size: 14px;
			background-color: #353a45;
			margin-bottom: -1px;
			&:hover{
				border-bottom: 4px solid rgba(13, 151, 55, 0.7);
			}
		}
		.sport-simple-select-active{
			border-bottom: 4px solid #0D9737;
		}
	}
	.m-choose-date{
		text-align: left;
		font-size: 0px;
		margin-top: 10px;
		.clearfix();
		&-item{
			cursor: pointer;
			background-color: fade(@lightGray, 15%);
			width: 116px;
			border-radius: 4px;
			// height: 47px;
			padding: 6px 0;
			font-size: 12px;
			font-weight: 700;
			display: block;
			margin-right: 3px;
			text-align: center;
			float: left;
			box-sizing: border-box;
			padding-top: 6px;
			>span{
				display: block;
			}
			&.active{
				color: @dark;
				background-color: @midGreen;
				&:hover{
					background-color: @lightGreen;
				}
			}
		}
	}
	.live-list-table{
		text-align: left;
		margin: 10px 0;
		.m-table-cell{
			font-size: 14px;
		}
		&-header,&-list {
			text-align: left;
			border-bottom: 1px solid fade(@lightGray, 15%);
			justify-content: center;
			align-items: center;
			table-layout: fixed;
			.time {
				width: 80px;
				box-sizing: border-box;
				padding-left: 14px;
				flex: 0 0 auto;
			}
			.vs{
				width: 295px;
				flex: 0 0 auto;
				>span{
					display: block;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
					padding-right: 10px;
				}
			}
			.detail{
				width: 60px;
				flex: 0 0 auto;
			}
			.league{
				padding-right: 10px;
				>span{
					display: block;
					white-space: nowrap;
					text-overflow: ellipsis;
					overflow: hidden;
					word-wrap: keep-all;
				}
			}
		}
		&-header{
			border-top: 1px solid fade(@lightGray, 15%);
			height: 28px;
			color: @darkGray;
		}
		&-list{
			cursor: pointer;
			height: 52px;
			&:last-child{
				border-bottom: 0px;
			}
			.vs{
				color: @green;
			}
			.detail{
				&>span{
					color: @green;
					&:after {
						content: '\e608';
						.iconfont();
						vertical-align: middle;
					}
				}
			}
		}
	}
	.m-schedule-no-data {
		text-align: left;
		color: @midGray;
		font-size: 14px;
		margin: 0 auto;
		display: inline-block;
		padding: 75px 0;
		p{
			word-break: keep-all;
			white-space: nowrap;
		}
	}
}
</style>
