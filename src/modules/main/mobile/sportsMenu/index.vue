<template>
<Layout :isHaveBottomNav="false" :isHasFooter="false" :isNeedScroll="true">
	<div class="m-sports-menu" slot="mid">
		<BackNavBar backText="Back" :link="homeUrl" id="top-navbar"></BackNavBar>
		<div class="sports-menu-fixed" ref="fixed">
			<AFSnapNav :class="['m-sports-choose', isFixed ? 'm-sports-choose-fixed': '']" v-model="currentSportName">
				<template v-for="(sport, index) in sportsMenu">
					<AFSnapNavItem class="m-sports-choose-item" :key="index" :name="sport.name">
						<div :class="['sprot-icon', sport.icon]"></div>
						<div class="sport-text">{{sport.text}}</div>
						<NewBadge v-if="sport.id === 'sr:sport:21'" ref="newBadge"/>
					</AFSnapNavItem>
				</template>
			</AFSnapNav>
		</div>

		<div class="m-top-menu">
			<template v-for="(item, index) in topMenuList">
				<MenuItem :key="index" :linkUrl="item.linkUrl" v-if="!item.isHide">{{item.text}}</MenuItem>
			</template>
		</div>

		<DailyMenu v-if="isShowDaily" :currentSportId="currentSportId"></DailyMenu>

		<SportCountries class="m-sports-countries" :sportId="currentSportId"></SportCountries>
	</div>
</Layout>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import { CHANGE_LOADING } from 'store/layout/mutationTypes';
import Layout from 'components/layout/main.vue';
import NewBadge from 'components/new-badge/index';

import 'components/sanpNav';
import BackNavBar from 'components/navbar';
import SportCountries from 'components/sportCountries';
import { pagePath, sportPageById } from 'config/pageConfig';
import sportsConfig from 'config/sports';
import DailyMenu from './pagelet/Daily.vue';
import MenuItem from './pagelet/MenuItem.vue';

export default{
	name: 'SportsMenu',
	components: {
		Layout,
		BackNavBar,
		SportCountries,
		DailyMenu,
		MenuItem,
		NewBadge
	},
	data() {
		const sportsMenu = [
			'football',
			'basketball',
			'tennis',
			'rugby',
			'cricket',
			'volleyball',
			'iceHockey',
			'handball',
			'darts',
			'beachVolley'
		].map(key => {
			const sport = sportsConfig[key];
			sport.liveMatchSize = 0;
			return sport;
		});

		return {
			sportsMenu,

			homeUrl: URL.addPara(pagePath.home, {
				source: 'sport_menu'
			}),
			currentSportName: sportsMenu[0].name,
			popularObj: {},
			// 从currentPopular中找出的Euro的比赛,应该只有足球有这个选项
			euroItem: null,
			// 从currentPopular找出的其他比赛，如果找不到euroItem就等同于currentPopular
			popluarList: [],
			isFixed: false,
		};
	},
	watch: {
		// 产品要求 将popular中的 EuroList放到前面，这里采用不安全的文字检查方法，如果检测到，就放，检测不到就算了
		currentPopular (val) {
			if (val && val.length) {
				const index = val.findIndex(cur => (cur.text || '').trim() === 'Euro List');
				if (index > -1) {
					// 为 Euro list linkUrl添加source参数
					this.euroItem = Object.assign({}, val[index], {
						linkUrl: val[index].linkUrl
					});
					this.popluarList = val.slice(0);
					// 删除EuroList那个选项
					this.popluarList.splice(index, 1);
				} else {
					this.popluarList = val.slice(0);
					this.euroItem = null;
				}
			} else {
				this.euroItem = null;
			}
		},
		scrollPayload(value) {
			const $fixed = this.$refs.fixed;
			if ($fixed) {
				const rect = $fixed.getBoundingClientRect();
				this.isFixed = rect.top <= 0;
			}
		},
		currentSport(sport) {
			// Cricket
			if (sport && sport.id === 'sr:sport:21') {
				this.setBadge();
			}
		}
	},
	computed: {
		...mapState('layout', [
			'scrollPayload'
		]),
		isShowDaily () {
			// ke 不显示 daily
			// const isRightCountry = window.country === 'ng' || window.country === 'gh';
			return this.currentSportName === 'football';
		},
		currentPopular () {
			const { popularObj, currentSportId } = this;
			if (popularObj && popularObj[currentSportId] && popularObj[currentSportId].length) {
				return popularObj[currentSportId];
			}
		},
		currentSportId () {
			return this.currentSport.id;
		},
		currentSport () {
			return sportsConfig[this.currentSportName];
		},
		topMenuList () {
			const { euroItem, currentSport } = this;

			const popluarList = this.popluarList.map(x => {
				x.isHide = !x.text || !x.linkUrl;
				return x;
			});

			const sportPage = sportPageById[this.currentSportId];

			return [
				{
					text: 'Today Games',
					linkUrl: `${sportPage}today`
				}, {
					text: euroItem && euroItem.text,
					linkUrl: euroItem && euroItem.linkUrl,
					isHide: !euroItem
				}, {
					text: `Live (${currentSport.liveMatchSize})`,
					linkUrl: `${sportPage}live_list`,
					isHide: currentSport.liveMatchSize < 1
				}, {
					text: `All ${currentSport.text || ''}`,
					linkUrl: URL.addPara(sportPage, { time: 'all' })
				},
				...popluarList
			].map(x => {
				x.linkUrl = URL.addPara(x.linkUrl, {
					source: 'sport_menu'
				});
				return x;
			});
		}
	},
	methods: {
		...mapMutations('layout', {
			pageLoading: CHANGE_LOADING
		}),
		// popular 链接可配置
		/**
		 * data：{
			"sr:sport:1":[{
					"sportId":"sr:sport:1",
					"text":"Euro List",
					"linkUrl":"www.xxx.com"
				},{
					"sportId":"sr:sport:1",
					"text":"Popular",
					"linkUrl":"www.xxx.com"
				}]
			}
		 */
		async getPopularSport() {
			try {
				const { bizCode, data } = await fetch('/factsCenter/extendPopularSports')
					.then(response => response.json());
				if (bizCode === 10000) {
					this.popularObj = data || {};
				}
			} catch (err) {
				console.log(err); // eslint-disable-line
			}
		},
		// 获取live比赛个数，product=1表示live
		async getLiveMatchSize() {
			try {
				const res = await fetch('/factsCenter/sportList', {
					method: 'GET',
					body: {
						productId: 1,
						option: 1
					}
				}).then(response => response.json());

				if (res.bizCode === 10000) {
					const events = res.data || [];
					events.forEach((evt, key) => {
						const sport = this.sportsMenu.find(x => x.id === evt.id);
						if (sport) {
							sport.liveMatchSize = +evt.eventSize;
						}
					});
				}
			} catch (err) {
				console.log(err); // eslint-disable-line
			}
		},
		// 设置点击标记
		setBadge() {
			let newBadge = this.$refs.newBadge || [];
			newBadge = newBadge[0];
			if (newBadge) {
				newBadge.setMark && newBadge.setMark();
			}
		}
	},
	created () {
		this.pageLoading(false);

		// 数组下标代表激活的tab
		this.currentSportName = (URL.getPara('sport') || 'football');

		this.getPopularSport();
		this.getLiveMatchSize();
	}
};
</script>

<style lang="less">
@import 'base/styles/variable.less';
@import 'base/styles/mixin.less';

.m-sports-menu {
	position: relative;
	.sports-menu-fixed{
		height: 73/@rem;
	}
	.m-sports-choose-fixed{
		position: fixed;
		top: 0;
		z-index: 10;
	}
	.m-sports-choose {
		box-sizing: border-box;
		width: 100%;
		border-bottom: 1px solid @lightGray;
		background-color: white;

		.m-sports-choose-item {
			position: relative;
			width: 60/@rem;
			min-height: 60/@rem;
			padding: 14/@rem 4/@rem 9/@rem;
			box-sizing: border-box;
			flex: none!important;

			&:first-child {
				margin-left: 10/@rem;
			}

			&:last-child {
				margin-right: 10/@rem;
			}

			&.active {
				border-bottom: 3/@rem solid @red;
			}

			.sport-text {
				margin-top: 3/@rem;
				font-size: 12/@rem;
				line-height: 14/@rem;
				white-space: normal;
			}

			.sprot-icon{
				text-align: center;
				display: block;

				&:before{
					color: @dark;
					font-size: 18/@rem;
					vertical-align: top;
					line-height: 1;
				}
			}
		}
	}

	.m-top-menu{
		// margin-top: 10/@rem;
		margin: 20/@rem 6/@rem 0 10/@rem;
		.clearfix();
	}
}

.m-sports-countries {
	margin: 20/@rem 0;

	.m-countries-block {
		.m-countries-block-title {
			line-height: 21/@rem;
			margin-bottom: 9/@rem;
		}
	}

	.m-country-list{
		box-sizing: border-box;
		margin: 0 10/@rem;
		border-radius: 2px;
		padding: 0;
		overflow: hidden;

		.m-league{
			margin: 0 0;
			border-bottom: 1px solid #4a4e58;

			.m-league-title{
				border-radius: 0;

				.m-event-size {
					display: none;
				}
			}
		}
	}
}
</style>
