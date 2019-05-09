<template>
	<div id="sportList">
		<div class="titles">
			<div class="sportList-title" @click.stop="goTodayGames">Today games</div>
			<div class="sportList-subtitle" @click.stop="goUpcomingGames">Upcoming games</div>
		</div>
		<div class="time-wrap">
			<div class="time-title">Filter by start time</div>
			<AfSlider
				:value="currentTime"
				@input='changeTime'
				@callback="toggleTime"
				:data="timeData"
				:bgStyle="bgStyle"
				:processStyle="processStyle"
				:sliderStyle="sliderStyle"
				:formatter="formatterLablel"
				:dotSize="12"
				:piecewiseStyle="{
					backgroundColor:'#ffffff',
					width: '4px',
					height: '4px',
					top: '2px'
				}"
				:piecewiseActiveStyle="{
					backgroundColor:'#ffffff',
					width: '4px',
					height: '4px',
					top: '2px'
				}"
				:piecewiseLabel="true"
				:piecewise="true"
				:lazy="true"
				:labelStyle="labelStyle"
			></AfSlider>
		</div>
		<div class="game-list" v-if="(popularEvents && popularEvents.length) || (sportList && sportList.length)">
			<ul class="popular-list" v-if="popularEvents && popularEvents.length">
				<li v-for="category in popularEvents" v-if="category.tournaments && category.tournaments.length" :key="category.id" class="category-list-item" @mouseover="mouseover" @mouseout="mouseout">
					<div class="category-item">
						<span>{{category.name}}</span>
						<span class="event-size">{{category.eventSize || ''}}</span>
					</div>
					<div :class="['tournament-list', {
						'tournament-list--one': category.tournaments.length <= 3
					}]">
						<ul>
							<li class="tournament-list-item" :title="tournament.name"
								v-for="tournament in category.tournaments"
								@click="toggleTournament(tournament.id, tournament.name, category.id, category.name)"
								:key="tournament.id">
								<Checkbox
								 :id="tournament.id"
								 ></Checkbox>
								<span class="tournament-name">{{tournament.name}}</span>
								<span class="event-size">({{tournament.eventSize}})</span>
							</li>
						</ul>
						<div class="tournament-err" v-show="isShowMaxLeage">10 options is the maximum allowed</div>
					</div>
				</li>
			</ul>
			<div class="sport-title" v-if="sportList && sportList.length">A-Z</div>
			<ul v-if="sportList && sportList.length" class="sport-list">
				<li v-for="category in sportList" :key="category.id"  v-if="category.tournaments && category.tournaments.length" class="category-list-item" @mouseover="mouseover" @mouseout="mouseout">
					<div class="category-item">
						<span>{{category.name}}</span>
						<span class="event-size">{{category.eventSize || ''}}</span>
					</div>
					<div :class="['tournament-list', {
						'tournament-list--one': category.tournaments.length <= 3
					}]">
						<ul>
							<li class="tournament-list-item" :title="tournament.name"
								@click="toggleTournament(tournament.id, tournament.name, category.id, category.name)"
								v-for="tournament in category.tournaments"
								:key="tournament.id">
								<Checkbox
								 :id="tournament.id"
								 ></Checkbox>
								<span class="tournament-name">{{tournament.name}}</span>
								<span class="event-size">({{tournament.eventSize}})</span>
							</li>
						</ul>
						<div class="tournament-err" v-show="isShowMaxLeage">10 options is the maximum allowed</div>
					</div>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
import { mapActions, mapMutations, mapState, mapGetters } from 'vuex';
import { sportType2Id, sportConfigLowerCase } from 'config/sportsType';
import Vue from 'vue';
import debounce from 'utils/debounce';
import 'packages/slider';
import { CHANGE_SPORT,
	CHANGE_TIME,
	TOGGLE_TOURNAMENTS,
	FETCH_SIDEBAR,
	RESET_TOURNAMENTS } from 'store/preMatchSidebar/mutationTypes';
import Checkbox from './checkbox';

export default {
	name: 'siderBar',
	components: {
		Checkbox
	},
	data() {
		return {
			// 这里注意用afSelect如果是数字会和index下标产生混乱
			timeData: ['1', '3', '6', '24', '0'],
			bgStyle: {
				backgroundColor: '#787878',
				height: '4px'
			},
			processStyle: {
				backgroundColor: '#0D9737'
			},
			sliderStyle: {
				backgroundColor: '#32CE62',
				boxShadow: '0.5px 0.5px 0px 0px rgba(50, 206, 98, 0.32)',
				top: '-5px'
			},
			labelStyle: {
				marginTop: '-2px'
			},
			sportName: null,
			isShowMaxLeage: false
		};
	},
	watch: {
		// 详情页面的sportId发生变化就重新请求左边的列表
		detailSportId (val) {
			if (val) {
				this.sportName = sportConfigLowerCase[val.slice(9)];
				this[CHANGE_SPORT](val);
			}
		},
		// sport id 发生变化就请求数据
		currentSportId (val, pre) {
			if (val) {
				// 每次数据改变才清除，如果第一次是null则不清除
				if (pre !== null) {
					this[FETCH_SIDEBAR]({});
				}
				this.fetchData();
			}
		},
		currentTime (val) {
			this.fetchData();
		},
		$route: {
			immediate: true,
			handler (route) {
				const { params = {}, name, query } = route;
				// 详情页面可能拿不到 eventId，这个时候只能在详情页面加载后取数据中取eventId
				if (params.sportName && sportType2Id[params.sportName]) {
					const id = `sr:sport:${sportType2Id[params.sportName]}`;
					this.sportName = params.sportName;
					if (id !== this.currentSportId) {
						this[CHANGE_SPORT](id);
					}
				}
				if (name === 'eventListUpcoming' || name === 'eventListDefault' || name === 'eventListToday') {
					this[RESET_TOURNAMENTS]();
					let time;
					if (query.time && +query.time >= 0) {
						time = +query.time;
					}
					if (!(time >= 0)) {
						if (name === 'eventListDefault' || name === 'eventListToday') {
							time = '0';
						} else if (name === 'eventListUpcoming') {
							time = '3';
						}
					}
					if (this.currentTime !== time) {
						this[CHANGE_TIME](String(time));
					}
				}
				// 解析tournament
				if (name === 'eventList') {
					const data = [];
					const tournaments = (params.tournamentId || '').split('_');
					// 将url上的tournament解析到data中
					// 这里只解析了tournamentId到数据中
					if (this.tournamentQuery.tournamentId !== params.tournamentId) {
						tournaments.forEach(cur => data.push({
							tournamentId: cur
						}));
						this[RESET_TOURNAMENTS](data);
						// 回填categoryId categoryName tournamentName信息
						if (this.popularEvents) {
							this.updateTournament(this.popularEvents);
						}
						if (this.sportList) {
							this.updateTournament(this.sportList);
						}
					}
				}
			}
		}
	},
	computed: {
		...mapState('sidebar', ['popularEvents',
			'sportList',
			'currentSportId',
			'currentTime',
			'currentTournaments',
			'productId']),
		...mapGetters('sidebar', ['tournamentQuery', 'mapTournament']),
		...mapState('eventDetail', {
			detailSportId: 'currentSport'
		}),

	},
	methods: {
		...mapActions('sidebar', ['fetchSideList']),
		...mapMutations('sidebar', [CHANGE_SPORT,
			CHANGE_TIME,
			TOGGLE_TOURNAMENTS,
			FETCH_SIDEBAR,
			RESET_TOURNAMENTS]),
		formatterLablel (res) {
			return res === '0' ? 'All' : res + 'h';
		},
		toggleTournament(tournamentId, tournamentName, categoryId, categoryName) {
			if (!tournamentId) {
				return;
			}
			const index = this.currentTournaments.findIndex(cur => cur.tournamentId === tournamentId);
			if (index < 0 && this.currentTournaments.length >= 10) {
				this.isShowMaxLeage = true;
				return;
			}
			this[TOGGLE_TOURNAMENTS]({
				tournamentId,
				tournamentName,
				categoryId,
				categoryName
			});
			if (this.currentTournaments.length) {
				this.$router.push({
					name: 'eventList',
					params: {
						sportName: this.sportName.toLowerCase(),
						categoryId: this.tournamentQuery.categoryId,
						tournamentId: this.tournamentQuery.tournamentId
					}
				});
			} else {
				this.$router.push({
					name: 'eventListDefault',
					params: {
						sportName: this.sportName.toLowerCase()
					}
				});
			}
		},
		toggleTime (val) {
			let { name, params, query } = this.$route;
			this[CHANGE_TIME](val);
			// 如果是today则跳转到 upcoming
			if (name === 'eventListToday') {
				name = 'eventListUpcoming';
			}
			// 只更新时间参数-- 只有upcoming和默认比赛列表受到时间控制
			if (name === 'eventListUpcoming' || name === 'eventListDefault') {
				if (val === '3' && name === 'eventListUpcoming') {
					val = null;
				}
				if (val === '0' && name === 'eventListDefault') {
					val = null;
				}
				const q = { ...query };
				delete q.time;
				if (val) {
					q.time = val;
				}
				this.$router.push({
					name,
					params,
					query: q
				});
			}
		},
		mouseover (e) {
			const target = e.currentTarget;
			if (target) {
				target.addClass('hover');
				target.querySelector('.tournament-list').style.display = 'block';
			}
		},
		mouseout (e) {
			const target = e.currentTarget;
			if (target) {
				target.removeClass('hover');
				target.querySelector('.tournament-list').style.display = 'none';
				this.isShowMaxLeage = false;
			}
		},
		fetchData () {
			this.fetchSideList({
				sportId: this.currentSportId,
				timeline: +this.currentTime === 0 ? null : this.currentTime,
				productId: this.productId
			})
			.then(() => {
				if (this.popularEvents) {
					this.updateTournament(this.popularEvents);
				}
				if (this.sportList) {
					this.updateTournament(this.sportList);
				}
			});
		},
		// 每次从url还原的 currentTournament不能还原name，这里再次尝试还原，在比赛列表中还会尝试还原
		updateTournament (list = []) {
			const mapTournament = this.mapTournament;
			list.forEach(cur => {
				if (cur.tournaments) {
					cur.tournaments.forEach(tour => {
						const res = mapTournament[tour.id];
						if (res) {
							Vue.set(res, 'categoryId', cur.id);
							Vue.set(res, 'categoryName', cur.name);
							Vue.set(res, 'tournamentName', tour.name);
						}
					});
				}
			});
		},
		// Today Games, 更新路由, 更新 vuex
		goTodayGames() {
			this.$router.push({
				name: 'eventListToday',
				params: {
					sportName: this.sportName
				}
			});
		},
		// Upcoming Games, 默认显示3小时
		goUpcomingGames() {
			// 更新路由
			this.$router.push({
				name: 'eventListUpcoming',
				params: {
					sportName: this.sportName
				},
				query: {
					time: '0'
				}
			});
		},
	},
	created() {
		// 防止多个数据修改调用多次
		this.fetchData = debounce(this.fetchData, 10);
		// 30s 刷新一次 siderBar
		setInterval(() => {
			if (this.currentSportId) {
				const params = {
					sportId: this.currentSportId
				};
				if (+this.currentTime > 0) {
					params.timeline = this.currentTime;
				}
				this.fetchSideList(params);
			}
		}, 30000);
	}
};
</script>

<style lang="less">
@import './siderBar';
</style>
