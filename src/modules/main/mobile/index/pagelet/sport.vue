<template>
	<div class="m-sports">
		<!-- 只有在分类和默认收据加载成功才能触发 -->
		<div class="m-sports-title m-title">Football</div>
		<af-tabs v-model="currentTab" class="m-bet-tab" size="small">
			<af-tab-pane label="Highlights" name="highlights">
				<Highlights :visible="currentTab === 'highlights'"></Highlights>
			</af-tab-pane>

			<af-tab-pane label="Today" name="today">
				<TodaySports :visible="currentTab === 'today'"></TodaySports>
			</af-tab-pane>

			<!-- <af-tab-pane label="Top Leagues" name="topLeagues">
				<TopLeagues :visible="currentTab === 'topLeagues'"></TopLeagues>
			</af-tab-pane> -->

			<af-tab-pane label="Countries" name="countries">
				<SportCountries
					:sportId="currentSportId"
					source="home"
					:isShowPopularTitle="false"
					:isShowTopLeagues="false"
					:visible="currentTab === 'countries'"
					:isShowAll="true">
				</SportCountries>
			</af-tab-pane>
		</af-tabs>
	</div>
</template>

<script>
import 'packages/tabs';
import { mapState } from 'vuex';
import SportCountries from 'components/sportCountries';
import TodaySports from './todaySports';
import Highlights from './highlights.vue';
// import TopLeagues from './topLeagues.vue';

export default {
	components: {
		SportCountries,
		TodaySports,
		Highlights,
		// TopLeagues
	},
	data () {
		return {
			currentTab: 'today',
			scrollElement: null, // 滚动元素
			sportTab: null // tab元素
		};
	},
	computed: {
		...mapState('home', [
			'currentSportId'
		]),
	},
	watch: {
		currentTab: {
			immediate: true,
			handler (value) {
				// 切换tab时，让容器滚动到当前tab的开始
				if (this.scrollElement) {
					if (this.scrollElement.scrollTop >= this.sportTab.offsetTop) {
						this.scrollElement.scrollTop = this.sportTab.offsetTop;
					}
				}
			}
		}
	},
	methods: {
		handleScroll() {
			const { scrollElement } = this;
			const sportTab = document.querySelector('.m-sports .m-bet-tab');
			this.sportTab = sportTab;

			if (scrollElement) {
				if (scrollElement.scrollTop >= sportTab.offsetTop) {
					!sportTab.hasClass('nav-fixed') && sportTab.addClass('nav-fixed');
				} else {
					sportTab.hasClass('nav-fixed') && sportTab.removeClass('nav-fixed');
				}
			}
		},
		handleScrollFixedNav () {
			const scrollElement = document.querySelector('.m-main-mid');
			this.scrollElement = scrollElement;
			scrollElement.addEventListener('scroll', this.handleScroll);
		}
	},
	mounted () {
		this.handleScrollFixedNav();
	},
	beforeDestroy() {
		const { scrollElement } = this;
		scrollElement && scrollElement.removeEventListener('scroll', this.handleScroll);
	}
};
</script>

<style lang="less">
@import '~base/styles/variable.less';

.m-sports {
	padding: 23/@rem 0 0;
	background-color: @white;
	color:@dark;

	.view-all{
		border-top: 1px solid @fogGray;

		a, a:hover,a:visited,a:active, a:after {
			color: @green;
			text-decoration: none;
		}
	}

	.m-bet-tab {
		position: relative;

		.m-bet-content {
			.m-league{
				.m-league-conent{
					margin-top: 4/@rem;
				}
			}
		}

		&.nav-fixed {
			padding-top: 44/@rem;

			.m-tabs-nav {
				position: fixed;
				top: 0;
				left: 0;
				z-index: 99;
				width: 100%;
				background-color: #fff;
			}
		}

		.m-tabs-nav {
			width: 100%;
			border-bottom: 1px solid @fogGray;
		}

		.m-tabs-tab {
			margin: 0;
			color: @dark;
			font-weight: 500;
			font-size: 14/@rem;
			line-height: 44/@rem;
			padding: 0 16/@rem;

			&.m-tabs-tab-active {
				color: @blueBlack;
				font-weight: bold;
			}
		}

		.m-tabs-tabpane {
			// 消除 date row 下首个 m-event-sport 的 border-top
			.m-date-row {
				margin-bottom: -1px;
			}
		}

		.m-tabs-ink-bar {
			height: 4/@rem;
			background: @green;
			bottom: 0;
		}
	}

	.m-countries-panel {
		margin-bottom: 10/@rem;

		.m-countries-block {
			margin-top: 0;

			&-title{
				font-size: 12/@rem;
				font-weight: normal;
				color: @dark;
				height: 24/@rem;
				line-height: 24/@rem;
				background: @fogGray;
				padding-left: 10/@rem;
				margin: 0;
			}

			.m-country-list{
				padding: 0;

				.m-league {
					border-bottom: 0;

					&:last-child {
						border-bottom: 1px solid @fogGray;
					}

					.m-league-title{
						background-color: @white;
						color: @darker;
						font-size: 14/@rem;
						height: 44/@rem;
						line-height: 44/@rem;
						padding: 0 40/@rem 0 10/@rem;
						box-sizing: border-box;
						border-top: 1px solid @fogGray;
					}
				}
			}
		}
	}
}
</style>
