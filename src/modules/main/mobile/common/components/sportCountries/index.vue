<template>
	<div class="m-countries-panel" v-loading:fetchData="loading">
		<template v-if="isShowAll">
			<template v-if="sportId === 'sr:sport:1' && popularEvents && popularEvents.length > 0">
				<div class="m-countries-block">
					<div class="m-countries-block-title" v-if="isShowPopularTitle">{{c2cTitleText}}</div>
					<div class="m-country-list">
						<League :isShowContent="false"
							v-for="cg in popularEvents"
							:eventSize="cg.eventSize"
							:name="cg.name"
							:key="cg.id">
							<div class="m-tournament-list">
								<ul class="m-country-row">
									<li v-for="tournament in cg.tournaments"
										:key="tournament.id">
										<a :href="getTournamentLink(cg.id, tournament.id)">
											<div class="m-item-left">{{tournament.name}}</div>
											<div class="m-item-right">{{tournament.eventSize}}</div>
										</a>
									</li>
								</ul>
							</div>
						</League>
					</div>
				</div>
			</template>

			<div class="m-countries-block">
				<template v-if="categories.length > 0">
					<div class="m-countries-block-title" v-if="!!popularEvents">{{az2cTitleText}}</div>
					<div class="m-countries-block-title" v-else>{{c2cTitleText}}</div>
				</template>

				<div class="m-country-list">
					<League
						:isShowContent="false"
						v-for="cg in categories"
						:name="cg.name"
						:eventSize="cg.eventSize"
						:key="cg.id">
						<div class="m-tournament-list">
							<ul class="m-country-row">
								<li v-for="tournament in cg.tournaments"
									:key="tournament.id">
									<a :href="getTournamentLink(cg.id, tournament.id)">
										<div class="m-item-left">{{tournament.name}}</div>
										<div class="m-item-right">{{tournament.eventSize}}</div>
									</a>
								</li>
							</ul>
						</div>
					</League>
				</div>
			</div>
		</template>
	</div>
</template>

<script>
import League from 'components/eventsList/league.vue';
import { sportPageById } from 'config/pageConfig';

export default {
	name: 'SportCountries',
	components: {
		League
	},
	props: {
		// 默认是 Football
		sportId: {
			type: String,
			'default': 'sr:sport:1'
		},
		// 是否显示 popular events title
		isShowPopularTitle: {
			type: Boolean,
			'default': true
		},
		// 是否显示 top leagues
		isShowTopLeagues: {
			type: Boolean,
			'default': true
		},
		// 是否在加载错误时显示reload
		hasReload: {
			type: Boolean,
			'default': false
		},
		source: {
			type: String,
			'default': 'sport_menu'
		},
		// 当前组件是否可见，用于控制动态加载数据
		visible: {
			type: Boolean,
			'default': true
		}
	},
	data () {
		return {
			loading: false, // 三种状态：true, false, -1  （-1 可以显示reload）
			totalListData: {},
			popularEvents: [],
			categories: [],
			country: window.country,
			isOnceRequested: false // 是否请求过数据
		};
	},
	computed: {
		isShowAll () {
			return this.hasReload ? this.loading !== true : this.loading === false;
		},
		c2cTitleText () {
			return this.sportId === 'sr:sport:1' ? 'Countries' : 'Categories';
		},
		az2cTitleText () {
			return this.sportId === 'sr:sport:1' ? 'A-Z' : 'Categories';
		},
		hasData() {
			return this.popularEvents && this.popularEvents.length;
		}
	},
	watch: {
		sportId (value, oldValue) {
			this.setListData(value);
		},
		visible: {
			immediate: true,
			handler(val) {
				if (val) {
					if (!this.isOnceRequested) {
						this.fetchData();
						this.isOnceRequested = true;
					}
				}
			}
		}
	},
	methods: {
		jumpTournament (categoryId, tournamentId) {
			const tournamentLink = `${sportPageById[this.sportId]}${categoryId}/${tournamentId}`;
			window.location.href = URL.addPara(tournamentLink, {
				// change_game: '1',
				is_league: 1, // 用于追踪是否是league页
				time: 'all', // 用于时间筛选选中all
				source: this.source
			});
		},
		getTournamentLink (categoryId, tournamentId) {
			const tournamentLink = `${sportPageById[this.sportId]}${categoryId}/${tournamentId}`;
			return URL.addPara(tournamentLink, {
				// change_game: '1',
				is_league: 1, // 用于追踪是否是league页
				time: 'all', // 用于时间筛选选中all
				source: this.source
			});
		},
		setListData (sportId) {
			const currentPopularEvents = this.totalListData.popularEvents.find(x => x.id === sportId);
			const currentSportList = this.totalListData.sportList.find(x => x.id === sportId);
			let popularEvents = currentPopularEvents ? currentPopularEvents.categories : [];
			if (!this.isShowTopLeagues) {
				popularEvents = popularEvents.filter(x => (x.name || '').toLowerCase() !== 'top leagues');
			}
			this.popularEvents = popularEvents;
			this.categories = currentSportList ? currentSportList.categories : [];
		},
		// 获取 ke sports list
		async getSportsList() {
			this.loading = true;
			try {
				// 根据条件获取相应的国家及队伍比赛信息，product=3表示prematch
				const { bizCode, data = {}} = await fetch('/factsCenter/popularAndSportList', {
					method: 'GET',
					body: {
						productId: 3
					}
				}).then(res => res.json());

				if (bizCode === 10000) {
					this.totalListData = data;
					this.setListData(this.sportId);
					this.loading = false;
				} else {
					this.loading = -1;
				}
			} catch (error) {
				console.log(error); // eslint-disable-line
				this.loading = -1;
			}
		},
		// 获取 ng sports list
		async getWapPopularAndSportOption() {
			this.loading = true;
			try {
				// 根据条件获取相应的国家及队伍比赛信息，product=3表示prematch
				const { bizCode, data = {}} = await fetch('/factsCenter/wapPopularAndSportOption', {
					method: 'GET',
					body: {
						productId: 3
					}
				}).then(res => res.json());

				if (bizCode === 10000) {
					this.totalListData = data;
					this.setListData(this.sportId);
					this.loading = false;
				} else {
					this.loading = -1;
				}
			} catch (error) {
				console.log(error); // eslint-disable-line
				this.loading = -1;
			}
		},
		fetchData () {
			switch (this.country) {
			case 'ke':
				this.getSportsList();
				break;
			case 'ng':
				this.getWapPopularAndSportOption();
				break;
			case 'gh':
				this.getWapPopularAndSportOption();
			default:
				this.getWapPopularAndSportOption();
			}
		}
	}
};
</script>

<style lang="less">
@import 'base/styles/variable.less';
@import 'base/styles/mixin.less';

.m-countries-block {
	&:not(:first-child) {
		margin-top: 20/@rem;
	}

	&-title{
		color: @dark;
		font-size: 18/@rem;
		font-weight: bold;
		margin-bottom: 9/@rem;
		padding: 0 10/@rem;
	}

	.m-country-list{
		box-sizing: border-box;
		padding: 0 10/@rem;

		.m-league{
			margin: 0;
			border-bottom: 1px solid rgba(53,58,69,0.7);

			.m-league-title{
				border: 0;
				background-color: @dark;
				color: @white;
				height: 32/@rem;
				line-height: 32/@rem;
			}
		}
	}

	.m-country-row{
		background-color: @darker;
		color: @white;
		li{
			height: 36/@rem;
			line-height: 36/@rem;
			& > a {
				display: flex;
				justify-content: space-between;
				box-sizing: border-box;
				padding: 0 10/@rem;
				margin-left: 40/@rem;
				border-bottom: 1/@rem solid rgba(53,58,69,0.7);
				color: @white;
				text-decoration: none;

				&:active,
				&:hover{
					background-color: #2a2f37;
				}
			}

			&:last-child{
				border-bottom: 0;

				& > a {
					border-bottom: 0;
				}
			}
		}
		.m-item-left{
			text-align: left;
			.ellipsis();
		}
		.m-item-right{
			text-align: right;
		}
	}
}
</style>
