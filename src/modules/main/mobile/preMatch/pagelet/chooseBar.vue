<template>
<div class="m-choose-bar-wrap">
	<div class="overly" v-if="isShowChooseBarList" @click.stop="hideAll"></div>
	<div :class="['m-choose-bar', {
		'm-choose-bar-show': isShowChooseBarList
	}]">
		<div class="m-choose-time" @blur="hideChooseTime" tabindex="0">
			<div :class="{
				'm-title' :true,
				active: isShowChooseTime
			}" @click="toggleChooseTime">{{currentTimeLabel}}</div>
			<div class="m-list" v-show="isShowChooseTime">
				<ul>
					<li v-for="(time, index) in timeData"
						:key="index"
						:class="{checked: isSameTime(time)}"
						@click="selectTime(time)">
						{{time.name}}
					</li>
				</ul>
			</div>
		</div>
		<div class="m-choose-sport" @blur="hideChooseSport" tabindex="0">
			<div :class="{
				'm-title':true,
				active: isShowChooseSport
			}" @click="toggleChooseSport">{{currentSportNameUpper}}</div>
			<div class="m-list"  v-show="isShowChooseSport">
				<ul>
					<li v-for="(sport, index) in sportList"
						:key="index"
						:data-id="sport.id"
						:class="{checked: currentSportId === sport.id}"
						@click="selectSport">{{sport.name}}</li>
				</ul>
			</div>
		</div>
		<!-- 为了列表的长度能够超出去，不能加overflow：hidden -->
		<div class="m-choose-league"  @blur="hideChooseLeague"  tabindex="0">
			<div :class="{
				'm-title':true,
				active: isShowChooseLeague
			}" @click="toggleChooseLeague">{{selectLeageNames}}</div>
			<div class="m-list" v-show="isShowChooseLeague" v-loading:loadingFail="loading">
				<div class="m-regions" v-if="!loading">
					<div class="m-regions-list"
						v-if="categoryList && categoryList.categories">
						<div class="m-scroll-wrap">
							<ul class="m-category">
								<li v-for="(category, index) in categoryList.categories"
									:key="`${category.id}-${index}`"
									:data-id="category.id"
									@click="selectCategory"
									:class="{
										checked: currentCategoryId === category.id
									}">
									<span class="category-name">{{category.name}}</span>
									<span class="select-tournamet-size">
										<em v-if="currentSelectTournamentMap[category.id]">{{getSelectCategoryTourSize(category.id)}}</em>
									</span>
									<span class="event-size">{{category.eventSize}}</span>
								</li>
							</ul>
						</div>
						<div class="m-scroll-wrap">
							<ul v-if="currentCategoryId && categoryList" class="m-tournament">
								<template v-if="tournamentList && tournamentList.tournaments">
									<li
										@click="selectTournament"
										v-for="tournament in tournamentList.tournaments"
										:key="tournament.id"
										:data-tournamentid="tournament.id"
										:data-categroyid = "currentCategoryId"
										:data-tournamentname="tournament.name"
										:data-categroyname = "mapSportSize[currentSportId].categories[currentCategoryId].name"
										:class="{
										checked: currentSelectTournamentMap[currentCategoryId] && currentSelectTournamentMap[currentCategoryId][tournament.id]}"
									>
										<span class="checkbox"></span>
										<span class="tournament-name">{{tournament.name}}</span>
										<span class="event-size">{{tournament.eventSize}}</span>
									</li>
								</template>
							</ul>
							<!-- <div>
							</div> -->
						</div>
					</div>
					<div v-else class="m-regions-list-no-data">
						<p>Sorry，there are no games currently</p>
						<p>available in this category.</p>
						<p>Please try later. Thank you.</p>
					</div>
				</div>
				<div class="m-regions-opt" v-if="!loading">
					<span class="m-regions-reset" @click="resetSelectTournament">Reset</span>
					<span class="m-regions-apply" @click="applySelectTournament">Apply</span>
				</div>
			</div>
		</div>
	</div>
</div>
</template>

<script>
	import 'packages/select/index';
	import { CHANGE_LOADING } from 'store/layout/mutationTypes';
	import { mapActions, mapState, mapMutations, mapGetters } from 'vuex';
	import Vue from 'vue';
	import sportsConfig, { sportsConfigById } from 'config/sports';
	import { getTimeSelector, getTimeParam, getTournamentIds } from './commonFun';

	// 赛前比赛选择工具条
	export default {
		props: {
		},
		data () {
			/**
			 * 这里默认采用key的顺序，如果要改变顺序的话，建议使用以下方式:
			 * ['football', 'basketball', [...key]].map(key => ({
			 * 		id: sportsConfig[key].id,
			 * 		name: sportsConfig[key].text,
			 * }))
			 */
			const sportList = Object.values(sportsConfig).map(sport => ({
				id: sport.id,
				name: sport.text
			}));

			return {
				loading: true,
				isShowChooseSport: false,
				isShowChooseLeague: false,
				isShowChooseTime: false,
				// 空表示没有选择时间
				currentTime: null,
				productId: 3,
				// 当前选择的sportId
				currentSportId: 'sr:sport:1',
				currentSportName: 'football',
				// 当前选择的联赛，必须用数组表示，这个表示已经确定选择的联赛，所有的id是 category_tournaments
				currentTournaments: [],
				// 当前在选择的列表，还没有放入currentTournaments,一旦点击 Apply则放入currentTournaments, 否则清空currentSelectTournaments
				currentSelectTournaments: [],
				// 当前的选择的分类列表-- 表示当前正在展开的那个categpory
				currentCategoryId: null,
				sportList,
				// 这里注意用afSelect如果是数字会和index下标产生混乱
				timeData: getTimeSelector(),
				fromRouter: false,
				resetStatus: false, // 是否点击重置

			};
		},
		watch: {
			isShowChooseLeague (val) {
				// 当显示联赛信息的时候
				if (val) {
					const sportFetch = this.reLoadingSportSize();
					// 初次打开，设置展开第一个category
					if (!this.currentCategoryId) {
						sportFetch.then(() => {
							const list = this.sportSize.find(cur => cur.id === this.currentSportId);
							if (list && list.categories && list.categories.length) {
								this.currentCategoryId = list.categories[0].id;
							}
						});
					}
					this.currentSelectTournaments = this.currentTournaments.slice(0);
				} else {
					// 关闭即清空，不管原因
					this.currentSelectTournaments = [];
				}
			},
			currentTime() {
				this.loading = true;
			},
			// 显示的时候再次更新列表
			currentSportId (val, oldVal) {
				// 切换体育类型当前选中的分类应该清空
				this.currentCategoryId = null;
				this.loading = true;
			},
			currentParams() {
				this.emitChange();
			}
		},
		created () {
			// 组件初始化时， 通过路由获取 组件的初始状态； 后续的状态有组件内部维护
			const { params = {}, name, query } = this.$route;

			// currentSportId
			let currentId = this.currentSportId;
			if (params.sportName) {
				currentId = sportsConfig[params.sportName].id;
				this.sportName = params.sportName;
				this.currentSportName = params.sportName;
			}
			// time
			let time;
			if (query.time) {
				// if (+query.time >= 0) {
				// time = String(time);
				// 查询找到匹配
				const t = this.timeData.find(cur => cur.value === query.time);
				if (t) {
					time = t;
				}
				// } else if (query.time === 'all') {
				// 	time = this.timeData[0];
				// } else if (query.time === 'today') { 	// today
				// 	time = this.timeData[1];
				// }
			}
			if (name === 'eventListToday') {
				time = this.timeData[1];
			}

			// currentTournaments
			let tours = this.currentTournaments;
			// 设置初始数据
			const setCurrentData = () => {
				this.currentTournaments = tours;
				this.currentSportId = currentId;
				this.currentTime = time;
				this.fromRouter = true;
			};

			if (name === 'eventList') {
				const tournamentIds = getTournamentIds(params.tournamentId);
				// 将url上的tournament解析到data中， id 转换为对象
				tours = tournamentIds.map(id => ({
					tournamentId: id
				}));
				// 首次加载， url里面存在 tournament
				if (tournamentIds.length > 0) {
					const loadSportFetch = this.reLoadingSportSize(currentId);
					loadSportFetch.then(() => {
						setCurrentData();
						this.updateTournament();
					}).catch(() => {
						setCurrentData();
					});
				} else {
					setCurrentData();
				}
			} else {
				setCurrentData();
			}
		},
		mounted () {
			window.addEventListener('resize', this.__resize, false);
		},
		beforeDestroy () {
			window.removeEventListener('resize', this.__resize);
		},
		methods: {
			deleteTournament(tournamentId) {
				const tours = this.currentTournaments;
				const index = tours.findIndex(tour => tour.tournamentId === tournamentId);
				if (index > -1) {
					this.currentTournaments.splice(index, 1);
					// this.changeRouter();
				}
			},
			emitChange () {
				// 去重，移除 top category，是重复的部分
				const tours = this.currentTournaments.filter(tour => tour.categoryId !== this.popularCategory.id);

				// 触发事件
				this.$emit('change', {
					currentTime: this.currentTime,
					currentSportId: this.currentSportId,
					currentTournaments: tours,
					fromRouter: this.fromRouter, // 表示是否来自路由的数据
					resetStatus: this.resetStatus
				});
				// 重置状态
				this.fromRouter = false;
				this.resetStatus = false;
			},
			// 根据当前参数修改路由
			changeRouter () {
				// 不穿表示全部， today传递空，取全部
				const time = this.currentTime && this.currentTime.value ? this.currentTime.value : undefined;
				// 没有选择联赛，则进入默认路由
				if (!this.currentTournaments.length) {
					const query = time && time !== 'today' ? { time } : {};
					this.$router.push({
						name: time === 'today' ? 'eventListToday' : 'eventListDefault',
						params: {
							sportName: this.currentSportName
						},
						query
					});
				} else {
					const is = {};
					const result = this.currentTournaments.reduce((result, current) => {
						const { tournaments, categories } = result;
						const { categoryId, tournamentId } = current;
						if (!is[categoryId]) {
							categories.push(categoryId);
							is[categoryId] = true;
						}
						tournaments.push(tournamentId);
						return result;
					}, {
						tournaments: [],
						categories: [],
					});
					this.$router.push({
						name: 'eventList',
						params: {
							sportName: this.currentSportName,
							categoryId: result.categories.join('_'),
							tournamentId: result.tournaments.join('_')
						},
						query: {
							time
						}
					});
				}
			},
			// 切换体育类型的显示隐藏
			toggleChooseSport (e) {
				this.isShowChooseSport = !this.isShowChooseSport;
			},
			// 切换联赛的显示隐藏
			toggleChooseLeague (e) {
				this.isShowChooseLeague = !this.isShowChooseLeague;
			},
			hideChooseTime () {
				window.setTimeout(() => {
					this.isShowChooseTime = false;
				}, 16);
			},
			toggleChooseTime () {
				this.isShowChooseTime = !this.isShowChooseTime;
			},
			// 隐藏体育类型
			hideChooseSport () {
				window.setTimeout(() => {
					this.isShowChooseSport = false;
				}, 16);
			},
			// 隐藏联赛
			hideChooseLeague () {
				window.setTimeout(() => {
					this.isShowChooseLeague = false;
				}, 16);
			},
			hideAll () {
				this.hideChooseTime();
				this.hideChooseSport();
				this.hideChooseLeague();
			},
			selectTime (time) {
				this.currentTime = time;

				this.hideChooseTime();
				// this.changeRouter();
			},
			// 选择体育比赛
			selectSport (e) {
				const id = e.currentTarget.getAttribute('data-id');
				e.preventDefault();
				if (id) {
					this.currentSportId = id;
					this.currentSportName = sportsConfigById[id].name;
					// 换体育类型则换所有 联赛数据
					this.currentTournaments = [];
					// 需要重置 currentCategoryId
					if (this.mapSportSize[id]) {
						const res = this.sportSize.find(current => current.id === this.currentSportId);
						if (res) {
							this.currentCategoryId = (res.categories[0] && res.categories[0].id) || null;
						}
					}
					// this.changeRouter();
					this.hideChooseSport();
				}
			},
			// 选择联赛
			selectCategory (e) {
				const el = e.currentTarget;
				const id = el.getAttribute('data-id');
				if (id) {
					if (this.isOverLimited) {
						return this.$toast('The event number cannot be greater than 20');
					}
					this.currentCategoryId = id;
				}
			},
			selectTournament (e) {
				const el = e.currentTarget;
				const tournamentId = el.getAttribute('data-tournamentid');
				const categoryId = el.getAttribute('data-categroyid');
				const tournamentName = el.getAttribute('data-tournamentname');
				const categoryName = el.getAttribute('data-categroyname');
				if (tournamentId && categoryId) {
					const i = this.currentSelectTournaments
					.findIndex(cur => cur.tournamentId === tournamentId && cur.categoryId === categoryId);

					if (i > -1) {
						// 已经存在代表反选; 移除相同tournamentId
						this.currentSelectTournaments = this.currentSelectTournaments.filter(tour => tour.tournamentId !== tournamentId);
					} else {
						if (this.isOverLimited) {
							return this.$toast('The event number cannot be greater than 20');
						}
						// 可能同时添加两个
						if (this.isInPopular(tournamentId)) {
							if (categoryId === this.popularCategory.id) {
								// 判断sportList下的某个 category
								const category = this.findCategoryByTournamentId(tournamentId);
								if (category) {
									this.currentSelectTournaments.push({
										tournamentId,
										categoryId: category.id,
										categoryName: category.name,
										tournamentName,
									});
								}
							} else {
								// 追加 top leagues类下的 tournament
								this.currentSelectTournaments.push({
									tournamentId,
									categoryId: this.popularCategory.id,
									tournamentName,
									categoryName: this.popularCategory.name,
								});
							}
						}
						this.currentSelectTournaments.push({
							tournamentId,
							categoryId,
							tournamentName,
							categoryName
						});
					}
				}
			},
			// 点击reset，重置选择
			resetSelectTournament (e) {
				// 直接将上次的全部清空，根据产品杨楠的要求
				// this.currentSelectTournaments = this.currentTournaments.slice(0);
				this.currentSelectTournaments = [];
				this.currentTournaments = [];
				this.resetStatus = true;
				// this.changeRouter();
				this.hideChooseLeague();
			},
			// 点击确认，确认选择
			applySelectTournament () {
				this.currentTournaments = this.currentSelectTournaments;
				if (!this.currentTime || this.currentTime.value === '') {
					this.currentTime = this.timeData[0];
				}
				// this.changeRouter();
				this.hideChooseLeague();
			},
			// 加载失败
			loadingFail () {
				this.reLoadingSportSize();
			},
			// 每次点击的时候都从新加载数据
			reLoadingSportSize (currentId) {
				let reqPar = {
					sportId: currentId || this.currentSportId,
					productId: this.productId
				};
				reqPar = Object.assign(reqPar, getTimeParam(this.currentTime));
				// if (!this.sportSize || !this.sportSize.length) {
				// 		this.loading = true;
				// }
				// 更新已经存在的联赛列表，根据sportId和时间
				return this.fetchSportSize(reqPar)
				// .then(() => this.updateTournament)
				.then(() => this.loading = false)
				.catch(() => this.loading = -1);
			},
			// 获取当前打开的category下的tournament的数量，没有返回空
			getSelectCategoryTourSize (categoryId) {
				return this.currentSelectTournamentMap[categoryId] ?
				Object.keys(this.currentSelectTournamentMap[categoryId]).length : '';
			},
			// 每次从url还原的 currentTournament不能还原name，这里再次尝试还原，在比赛列表中还会尝试还原
			updateTournament () {
				if (!this.sportSize || !this.sportSize.length) {
					return;
				}
				const mapTournament = this.currentTournamentMap;
				const list = this.sportSize.find(cur => cur.id === this.currentSportId);
				if (!list || !list.categories) {
					return;
				}
				list.categories.forEach(cur => {
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
			...mapActions('sportSize', ['fetchSportSize']),
			...mapMutations('layout', {
				pageLoading: CHANGE_LOADING
			}),
			isSameTime(time) {
				const cur = this.currentTime;
				if (cur) {
					return cur.value === time.value;
				}
				return false;
			},
			isInPopular(tournamentId) {
				const category = this.popularCategory;
				const tournaments = category && category.tournaments || [];

				return tournaments.some(tour => tour.id === tournamentId);
			},
			// 查找普通category
			findCategoryByTournamentId(tourId) {
				const categoryList = this.categoryList;
				const categories = categoryList.categories;
				return categories.find(cate => {
					const tours = cate.tournaments;
					return cate.id !== this.popularCategory.id && tours.some(tour => tour.id === tourId);
				});
			}

		},
		computed: {
			...mapState('sportSize', ['sportSize']),
			...mapGetters('sportSize', ['mapSportSize']),
			// 根据当前的选择的sportId取name
			currentSportNameUpper () {
				return sportsConfig[this.currentSportName].text;
			},
			// 当前的所有category
			categoryList () {
				return this.sportSize.find(one => one.id === this.currentSportId);
			},
			popularCategory() {
				const categoryList = this.categoryList;
				return categoryList.popularCategory || {};
			},
			// 当前所有的tournamet
			tournamentList () {
				const categoryList = this.categoryList;
				return categoryList && categoryList.categories ? categoryList.categories.find(one => one.id === this.currentCategoryId) : null;
			},
			selectLeageNames() {
				const league = this.isShowChooseLeague ? this.currentSelectTournaments : this.currentTournaments;
				const tmp = {};
				return league.reduce((res, current) => {
					current = current.categoryName || '';
					if (current && !tmp[current]) {
						res += ' ' + current;
						tmp[current] = true;
					}
					return res;
				}, '') || 'League';
			},
			// 当前选定的tournameMap
			currentTournamentMap () {
				const currentTournaments = this.currentTournaments;
				return currentTournaments.reduce((res, current) => {
					res[current.tournamentId] = current;
					return res;
				}, {});
			},
			tournamentQuery () {
				const tmp = {};
				const res = this.currentTournaments.reduce((res, cur) => {
					if (!tmp[cur.categoryId]) {
						tmp[cur.categoryId] = 1;
						res.categoryId.push(cur.categoryId);
					}
					res.tournamentId.push(cur.tournamentId);
					return res;
				}, {
					categoryId: [],
					tournamentId: []
				});
				return {
					categoryId: res.categoryId.join('_'),
					tournamentId: res.tournamentId.join('_')
				};
			},
			// 获取当前选择的tournament, 打开的时候的数据
			currentSelectTournamentMap () {
				return this.currentSelectTournaments
				.reduce((tournaments, current) => {
					const categoryId = current.categoryId;
					const tournamentId = current.tournamentId;
					if (!tournaments[categoryId]) {
						tournaments[categoryId] = {};
					}
					tournaments[categoryId][tournamentId] = current;
					// 处理 top leagues
					if (this.isInPopular(tournamentId)) {
						if (!tournaments[this.popularCategory.id]) {
							tournaments[this.popularCategory.id] = {};
						}
						tournaments[this.popularCategory.id][tournamentId] = current;
					}
					return tournaments;
				}, {});
			},
			// 任意展开选择时间或者体育类型或者league
			isShowChooseBarList () {
				return this.isShowChooseSport ||
					this.isShowChooseLeague ||
					this.isShowChooseTime;
			},
			currentParams() {
				return {
					currentTime: this.currentTime,
					currentSportId: this.currentSportId,
					currentTournaments: this.currentTournaments
				};
			},
			currentTimeLabel() {
				const time = this.currentTime;
				return time && time.name ? time.name : 'Time';
			},
			isOverLimited() {
				// 去出 topPopular重复的
				const tours = this.currentSelectTournaments.filter(tour => tour.categoryId !== this.popularCategory.id);
				return tours.length > 19;
			}
		}
	};
</script>
<style lang="less">
	@import '~base/styles/variable.less';
	@import '~base/styles/mixin.less';
	@import 'base/styles/icon.less';
	.overly{
		position: fixed;
		z-index: 996;
		height: 100%;
		width: 100%;
		top: 0px;
		background-color: @black;
		opacity: 0.6;
	}
	.m-choose-bar{
		display: flex;
		justify-content: space-around;
		border-left: 0px;
		border-right: 0px;
		position: relative;
		background: @white;
		box-sizing: border-box;
		padding: 0 10/@rem;
		border-bottom: 1px solid @lightGray;
		// box-shadow: 0 1px 0px 0px @lightGray;
		// 类别展开的时候变成fixed，顶部显示
		&.m-choose-bar-show{
			position: fixed;
			z-index: 997;
			width: 100%;
			top: 0px;
		}
		.m-choose-time, .m-choose-sport, .m-choose-league{
			flex:1;
			min-width: 34%;
			align-items: center;
			align-content: center;
			background: @white;
			outline: none;
			padding: 11/@rem 0;
			.m-title{
				position: relative;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				color: @blueBlack;
				height: 20/@rem;
				line-height: 20/@rem;
				background-color: @white;
				font-size: 14/@rem;
				font-weight: 700;
				padding: 0 20/@rem 0 8/@rem;
				box-sizing: border-box;
				&:after{
					position: absolute;
					right: 6/@rem;
					top: 1/@rem;
					content: '\e603';
					color: @green;
					font-family: "iconfont" !important;
					font-size: 14/@rem;
					font-style: normal;
					-webkit-font-smoothing: antialiased;
				}
				&.active{
					&::after{
						transform: rotate(180deg);
					}
				}
			}
			.m-list{
				position: absolute;
				width: 100%;
				background:@white;
				left: 0px;
				z-index: 4;
				overflow: auto;
				box-sizing: border-box;
				padding: 10/@rem 0;
				margin-top: 12/@rem;
				li {
					&:active{
						background-color: @fogGray;
					}
					padding: 0 10/@rem;
					height: 36/@rem;
					line-height: 36/@rem;
					font-weight: 700;
					&.checked {
						color: @green;
					}
				}
			}
		}
		.m-choose-time, .m-choose-sport{
			.m-title{
				border-right: 1px solid @lightGray;
				box-shadow: 1px 0 0px 0px @lightGray;
			}
		}
		.m-choose-league{
			.m-regions-list-no-data{
				margin: 0 auto;
				position: absolute;
				top: 30%;
				left: 20%;
				p{
					font-size: 14/@rem;
				}
			}
			.m-list {
				padding: 0px;
				position: fixed;
				height: 70%;
				overflow: hidden;
				.m-regions-list{
					position: absolute;
					top: 0;
					left: 0;
					width: 100%;
					height: 100%;
					overflow: hidden;
					box-sizing: border-box;
					padding: 0 10/@rem;
					padding-bottom: 64/@rem;
					.clearfix();
					.m-scroll-wrap{
						.clearfix();
						width: 50%;
						float: left;
						height: 100%;
						overflow: auto;
						.m-category,.m-tournament{
							min-height: 100%;
							li {
								height: 36/@rem;
								line-height: 36/@rem;
								display: block;
								&:active{
									background-color: @fogGray;
								}
							}
						}
						.m-category{
							border-right: 1px solid @fogGray;
							li{
								box-sizing: border-box;
								padding-right: 10/@rem;
								font-size: 0;
								white-space: nowrap;
								word-break: break-all;
								&>span{
									font-size: 14/@rem;
									display: inline-block;
									white-space: nowrap;
									overflow: hidden;
									text-overflow: ellipsis;
								}
								.category-name{
									width: 65%;
								}
								.select-tournamet-size{
									width: 15%;
									text-align: center;
									em{
										display: inline-block;
										color: @white;
										height: 18/@rem;
										min-width: 18/@rem;
										border-radius: 18/@rem;
										background-color: @red;
										vertical-align: middle;
										line-height: 1.5;
										max-width: 2.5rem;
									}
								}
								.event-size{
									width: 20%;
									text-align: right;
								}
								&.active{
									.category-name{
										color: @green;
									}
									.select-tournamet-size{
										color: @dark;
									}
									.event-size{
										color: @dark;
									}
								}
							}
						}
						.m-tournament{
							li{
								box-sizing: border-box;
								padding-left: 10/@rem;
								font-size: 0;
								&>span{
									font-size: 14/@rem;
									display: inline-block;
									white-space: nowrap;
									overflow: hidden;
									text-overflow: ellipsis;
								}
								.tournament-name{
									width: 70%;
								}
								.checkbox{
									width: 15%;
									&::before{
										content: '';
										width: 15/@rem;
										height: 15/@rem;
										border: 1px solid @midGray;
										font-family: 'iconfont';
										border-radius: 3/@rem;
										font-size: 12/@rem;
										display: inline-block;
										text-align: center;
										line-height: 1.3;
										vertical-align: text-top;
									}
								}
								.event-size{
									width: 15%;
									text-align: right;
								}
							}
							.checked{
								.checkbox{
									&::before{
										content: '\e611';
										border: 1px solid @green;
										background-color: @green;
										color: @white;
									}
								}
							}
						}
					}
				}
				.m-regions-opt{
					display: flex;
					position: absolute;
					bottom: 0px;
					justify-content: space-around;
					border-top: 1px solid @fogGray;
					width: 100%;
					padding: 10/@rem 14/@rem;
					box-sizing: border-box;
					background-color: @white;
					&>span{
						display: block;
						text-align: center;
						flex:1;
						height: 36/@rem;
						line-height: 36/@rem;
						color: @green;
						border-radius: 3/@rem;
						border: 1px solid @green;
						&.m-regions-reset{
							background-color: @white;
							margin-right: 10/@rem;
						}
						&.m-regions-apply{
							background: @green;
							color: @white;
						}
					}
				}
			}
		}
	}
</style>
