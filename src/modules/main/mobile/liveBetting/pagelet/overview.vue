<template>
<div class="m-overview">
	<BackBar backText="Back" :link="sports">
		<span slot="right" @click.stop="jmpToSchedule" class="m-icon-schedule">Schedule</span>
	</BackBar>
	<!-- <div class="m-change-see-wrap">
		<ul class="m-change-see">
			<li class="active" @click="handleChange('overview')">Live</li>
			<li @click="handleChange('schedule')" >Schedule</li>
		</ul>
	</div> -->
	<Banner :periodId="periodId" source="live_overview" v-if="isDuringClaim"/>
	<div class="m-live">
		<AFSnapNav :value="currentSportId" @change="chooseSport" class="m-sport-type">
			<AFSnapNavItem
				class="m-sport-type-item"
				v-for="item in sportList"
				:key="item.id"
				:name="item.id">
				<span class="m-event-size">{{item.eventSize}}</span>
				<i :class="['m-sport-icon', item.icon]"></i>
				<div class="m-sport-text">{{item.name}}</div>
			</AFSnapNavItem>
		</AFSnapNav>

		<template v-if="getCurrentSubTabs.length">
			<AFSnapNav :value="curMarketId" @change="chooseMarket" class="m-mkt-type">
				<AFSnapNavItem class="m-sport-type-item" v-for="item in getCurrentSubTabs" :key="item.key" :name="item.key">{{item.name}}</AFSnapNavItem>
			</AFSnapNav>
		</template>

		<div class="m-filter-bar">
			<Check class="auto-accept-change" :checked='filterLiveStream' @input="chgFilterStatus"><span slot="before" class="before-text">Streaming Events Only</span></Check>
		</div>

		<div class="m-bet-content" v-loading:loadingFail.dark="changeSportsLoading">
			<template v-if="!changeSportsLoading">
				<div v-if="productStatus === 1" class="m-sport-bet-error">
					Failed to load game data. An error occurred while connecting to server.
				</div>
				<div v-else-if="!sport || !sport.tournamentOrder || !sport.tournamentOrder.length" class="no-data">
					<p>Sorry, there are no games currently </p>
					<p>available in this category. Please try later.</p>
					<p>Thank you.</p>
				</div>
				<div class="no-data" v-else-if="!getShowTournments.length">
					<p>No Streaming Events Available.</p>
				</div>
				<template v-for="(tournament, index) in getShowTournments" v-else>
					<league :isShowContent="true" :key="index" :name="getLeagueTitle(sport.map[tournament])" :isBoost="isTournamentBoost({tournamentId: tournament})">
						<EventsList
							:eventOrder = "sport.map[tournament].eventOrder"
							:events = "sport.map[tournament].events"
							:currentMarketIds = "marketIds[currentSportId].filter(item => item === +curMarketId)"
							:sportId = "currentSportId"
							:productId="productId"
							:onlyShowLiveStream="filterLiveStream"
							:isEventBoost="isEventBoost">
						</EventsList>
					</league>
				</template>
			</template>
		</div>
	</div>
	<template v-if="upComingEvents.length && !sportProductStatus">
		<div class="m-live-upcoming">
			<h3 class="m-title">Upcoming Live</h3>
			<OrderEventsList
			  :events="upComingEvents"
			  :currentMarketIds="[upComingMarketIds[currentSportId]]"
			  :sportId="currentSportId"
			  productId="3"
			  :isShowEventLeagueName="true">
			</OrderEventsList>
		</div>
	</template>
</div>
</template>

<script>
	import BackBar from 'components/navbar';
	import 'components/loading';
	import EventsList from 'components/eventsList';
	import OrderEventsList from 'components/eventsList/orderEventsList';
	import League from 'components/eventsList/league.vue';
	import { CHANGE_LOADING } from 'store/layout/mutationTypes';
	import { CHANGE_SPORTS_LOADING, CHANGE_SPORT, UPDATE_CURRENT_MARKETS, UPDATE_FILTER_LIVE_STREAM, UPDATE_SPORT_SIZE } from 'store/eventList/liveBetting/mutationTypes';
	import { mapGetters, mapActions, mapState, mapMutations } from 'vuex';
	import { pagePath } from 'config/pageConfig';
	import sportsConfig, { sportsConfigById } from 'config/sports';
	import 'components/sanpNav';
	import 'components/tabs';
	import Banner from 'components/oddsBoost/banner';
	import Check from 'components/betslip/pagelet/check.vue';

	export default {
		name: 'Overview',
		components: {
			BackBar,
			EventsList,
			OrderEventsList,
			League,
			Banner,
			Check
		},
		data () {
			return {
				// 当前玩法是live
				productId: 1,
				sports: pagePath.sports
			};
		},
		created () {
			// 获取各种sport的 eventSize 值
			this.getLiveSportSize();

			const { params = {}} = this.$route;
			const sportId = sportsConfig[params.sportName].id;
			// sportId不是默认值 -- 切换运动类型后加载数据
			if (sportId && sportId !== this.currentSportId) {
				this.chooseSport(sportId || 'sr:sport:1');
			}
			// 默认足球加载数据
			// 全屏幕加载中，等待第一屏幕数据加载成功
			this.pageLoading(true);
			this.fetchSport()
			.then(() => this.pageLoading(false));
			this.subProductStatus();
		},
		beforeDestroy () {
			this.unSubProductStatus();
		},
		watch: {
			currentSportId (val, oldVal) {
				this.chgFilterStatus(false);
				if (!val || !oldVal) {
					return;
				}
				this.unsub(oldVal);
				// 控制路由切换
				this.$router.push({
					name: 'overview',
					params: {
						sportName: sportsConfigById[val].name
					}
				});
			},
			$route: {
				immediate: false,
				handler (val) {
					const { params } = val;
					const sportName = params.sportName;
					const id = sportsConfig[sportName].id;
					if (id) {
						this.chooseSport(id);
						this.fetchSport();
					}
				}
			}
		},
		computed: {
			...mapState('eventList', ['changeSportsLoading', 'sport', 'marketIds',
				'sportList', 'currentSportId', 'productStatus', 'curMarketId',
				'upComingEvents', 'upComingMarketIds', 'filterLiveStream', 'sportProductStatus']),
			...mapGetters('eventList', ['getCurrentSubTabs', 'getShowTournments']),
			...mapState('oddsBoost', [
				'periodId'
			]),
			...mapGetters('oddsBoost', ['isDuringClaim', 'isTournamentBoost', 'isEventBoost'])
		},
		destroyed() {
			this.unsub(this.currentSportId);
		},
		methods: {
			...mapActions('liveSportSize', ['fetchSportSize']),
			...mapMutations('eventList', {
				updateSportSize: UPDATE_SPORT_SIZE
			}),
			// handleChange (n) {
			// 	const { name } = this.$route;
			// 	if (name !== n) {
			// 		this.$router.push({
			// 			name: n,
			// 			params: {
			// 				sportName: sportsConfigById[this.currentSportId].name
			// 			}
			// 		});
			// 	}
			// },
			jmpToSchedule() {
				this.$router.push({
					name: 'schedule',
					params: {
						sportName: sportsConfigById[this.currentSportId].name
					}
				});
			},
			getLeagueTitle (tournamentData) {
				return tournamentData.categoryName + ' - ' + tournamentData.name || tournamentData.tournamentName;
			},
			loadingFail () {
				this.fetchSport();
			},
			fetchSport () {
				this.changeTabLoading(true);
				this.getUpcomingEvents(this.currentSportId);
				return this.fetchSports(this.currentSportId)
				.then(() => this.changeTabLoading(false))
				.then(() => this.pageLoading(false))
				.catch(err => {
					console.log(err); // eslint-disable-line
					this.changeTabLoading(-1);
				});
			},
			...mapMutations('layout', {
				pageLoading: CHANGE_LOADING
			}),
			...mapActions('eventList', ['fetchSports', 'unsub', 'subProductStatus', 'unSubProductStatus', 'getUpcomingEvents']),
			...mapMutations('eventList', {
				changeTabLoading: CHANGE_SPORTS_LOADING,
				chooseSport: CHANGE_SPORT,
				chooseMarket: UPDATE_CURRENT_MARKETS,
				chgFilterStatus: UPDATE_FILTER_LIVE_STREAM
			}),
			async getLiveSportSize () {
				try {
					const sportSize = await this.fetchSportSize({
						option: 1,
						productId: 1
					});
					this.updateSportSize(sportSize);
				} catch (err) {
					console.log(err); // eslint-disable-line
				}
			}
		}
	};
</script>

<style lang="less">
@import '~base/styles/variable.less';
@import 'base/styles/icon.less';
body,html{
	background: @darker;
}
.m-overview{
	background-color: @darker;

	.m-loading.dark {
		background-color: @darker;
	}

	.m-icon-schedule {
		.m-icon-schedule();
		&:before {
			margin-right: 8/@rem;
			line-height: 1;
			font-size: 16/@rem;
		}
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
				line-height: 48/@rem;
				&.active{
					border-bottom: 4px solid @red;
				}
			}
		}
	}
	.m-live{
		// background-color: @darker;
		color:@white;
		// padding: 0 10/@rem;
		.m-sport-bet-error{
			padding: 30/@rem 0 10/@rem;
		}
		.no-data{
			margin-top: 15%;
			margin-bottom: 15%;
			text-align: center;
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

		.m-sport-type {
			background-color: @darker;
			padding: 10/@rem 0 0;

			.m-sport-type-item{
				flex: none;
				font-size: 12/@rem;
				line-height: 14/@rem;
				padding: 11/@rem 3/@rem 4/@rem;
				width: 60/@rem;
				min-height: 58/@rem;
				box-sizing: border-box;
				text-align: center;
				color: @midGray;
				position: relative;

				// 解决右侧滑动间距被遮盖的情况
				&:first-child {
					margin-left: 10/@rem;
				}
				&:last-child {
					margin-right: 10/@rem;
				}

				&.active{
					border-bottom: 3px solid @midGreen;
					color: @white;

					.m-sport-icon {
						&:before {
							color: @white;
						}
					}
				}

				.m-event-size {
					position: absolute;
					top: 3/@rem;
					right: 11/@rem;
					display: block;
					min-width: 20/@rem;
					font-size: 10/@rem;
					line-height: 11/@rem;
					color: @midGreen;
					background: #393c43;
					border-radius: 2/@rem;
					text-align: center;
				}

				.m-sport-icon {
					&:before {
						font-size: 20/@rem;
						line-height: 1;
						color: @midGray;
						vertical-align: top;
					}
				}

				.m-sport-text {
					margin-top: 3/@rem;
					white-space: normal;
				}
			}
		}

		.m-mkt-type {
			border-bottom: 1px solid fade(@lightGray, 15%);
			.m-sport-type-item{
				font-size: 12/@rem;
				line-height: 14/@rem;
				padding: 11/@rem 12/@rem;
				box-sizing: border-box;
				font-weight: normal;
				&.active{
					border-bottom: 2px solid @green;
				}
			}
		}

		.m-league{
			margin: 0;
			.m-league-title{
				border-top: 0;
				border-bottom: 1px solid fade(@fogGray, 15%);
				background: @darker;
				color:@white;
			}
			.m-league-conent{
				margin-bottom: 0;

				.m-live-table {
					.m-name-row{
						display:flex;
						.m-name-cell{
							display: flex;
							justify-content: flex-end;
							background: fade(@lightGray, 15%);
							color: @darkGray;
							.m-name {
								width: 55%;
								display:flex;
								&>div{
									height: 24/@rem;
									line-height: 24/@rem;
									text-align: center;
									flex: 1
								}
							}
							border-bottom: 1px solid fade(@lightGray, 15%);
						}
					}
					.m-live-title-row{
						padding-top: 10/@rem;
						padding-bottom: 4/@rem;
						.m-market-size{
							text-align: right;
							color: @green;
							&:after{
								content: "\e608";
								font-family: 'iconfont';
								display: inline-block;
								text-indent: 10/@rem;
								color:@green;
							}
						}
						.game-id{
							color: @darkGray;
						}
					}

					&.tennis {
						.m-info-cell {
							width: 26%;
							padding-right: 10/@rem;
							box-sizing: border-box;
						}
						.game-score, .point{
							color: @midGray;
							opacity: .5;
						}
					}
				}
			}
		}

		.m-filter-bar {
			text-align: right;
			padding: 15/@rem 16/@rem 12/@rem;
			box-sizing: border-box;

			label {
				margin-left: 10/@rem;
			}
		}
	}

	.m-live-upcoming {
		background: @white;
		padding: 20/@rem 0;
		box-sizing: border-box;

		.m-title {
			font-size: 18/@rem;
			line-height: 22/@rem;
			margin-bottom: 9/@rem;
			margin-left: 16/@rem;
			font-weight: bold;
		}
	}
}
.m-bottom-nav{
	background-color: @dark;
}
</style>
