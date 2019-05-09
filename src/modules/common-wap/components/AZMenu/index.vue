<template>
  <div class="m-azmenu" @click.stop="!!false">
	<div class="top">
		<div class="opt">
            <div class="m-l-left">
                <span class="m-icon m-back-icon" @click="toggleLeft"></span>
            </div>
            <div class="m-l-right">   
                <a class="m-icon m-icon-home" :href="homeLink">Home</a>
            </div>
		</div>
		<a  class="azmenu-search-wrap " :href="searchLink">
			<span class="m-icon m-icon-search"></span>
			Search
		</a>
		<AFSnapNav class="m-azmenu-nav">
			<AFSnapNavItem class="m-azmenu-nav-item" v-for="(cfg, index) in topListUrl" :key="index" :name="cfg.name">
				<a :href="cfg.url">
					<span :class="['sprot-icon', cfg.cls]"></span>
					<span class="sport-text">{{cfg.name}}</span>
				</a>
			</AFSnapNavItem>
		</AFSnapNav>
	</div>
	<div class="sport-menu" v-loading:loadingData = "loading">
		<template v-for="(menu, index) in menuList">
			<a :class="['m-menu', menu.icon]" :href="menu.url" v-if="menu.url" v-show="loading === false">
				<span class="m-menu-title">{{menu.name}}</span>
			</a>

			<FlodMenu
				:class="[menu.icon]"
				v-else-if="menu.children && menu.children.length"
				:key="menu.name"
				:name="menu.name"
				v-show="loading === false">
				<a v-for="(one, index) in menu.children" :key="index" :href="one.url">
					<span>{{one.name}}</span>
					<span v-if="one.eventSize || one.eventSize === 0">{{one.eventSize}}</span>
				</a>
			</FlodMenu>
		</template>
	</div>
  </div>
</template>
<script>
	import 'components/tabs/index';
	import 'components/loading';
	import { TOGGLE_LEFT } from 'store/layout/mutationTypes';
	import { mapState, mapMutations } from 'vuex';
	import { pagePath, baseUrl } from 'config/pageConfig';
	import { userCenterUrl } from 'config/mycenter/dataConfig';
	import { sportsConfigById } from 'config/sports';
	import FlodMenu from './flodMenu.vue';
	import { topListUrl, userList } from './list';

	const country = window.country;

	export default {
		components: {
			FlodMenu
		},
		data () {
			return {
				topListUrl,
				loading: false,
				live: [],
				sports: [],
				country: window.country
			};
		},
		watch: {
			showLeft (val) {
				if (val) {
					this.loadingData();
				}
			}
		},
		methods: {
			...mapMutations('layout', [TOGGLE_LEFT]),
			async loadingData () {
				this.loading = true;
				try {
					let res = await fetch('/factsCenter/wapAzMenu');
					res = await res.json();
					if (res && res.bizCode === 10000) {
						const data = res.data || {};
						this.live = (data.Live || []).map(cur => {
							if (!cur.url) {
								const sportName = sportsConfigById[cur.id].name;
								cur.url = `${baseUrl}sport/${sportName}/live_list/`;
							}
							cur.url = URL.addPara(cur.url, { soruce: 'azmenu' });
							return cur;
						});
						// ng通过fitler过滤掉name是 Football in Next 3 Hours的那一项
						this.sports = (data.Sports || []).filter(cur => {
							const sportName = sportsConfigById[cur.id].name;
							const preUrl = `${baseUrl}sport/${sportName}/`;
							if (cur.name === 'Today Football') {
								cur.url = URL.addPara(preUrl + 'today/', {
									soruce: 'azmenu',
								});
							} else if (cur.name === 'Football in Next 3 Hours') {
								cur.url = URL.addPara(preUrl, { time: '3h', soruce: 'azmenu' });
							} else {
								cur.url = URL.addPara(pagePath.sports, {
									soruce: 'azmenu',
									sport: sportsConfigById[cur.id].name
								});
							}
							return this.country === 'ke' ? !!cur : cur.name !== 'Football in Next 3 Hours';
						});
						this.loading = false;
						return;
					}
					this.loading = -1;
				} catch (e) {
					this.loading = -1;
				}
			}
		},
		computed: {
			...mapState('layout', ['showLeft']),
			searchLink() {
				return window.URL.addPara(pagePath.search, {
					soruce: 'azmenu'
				});
			},
			homeLink() {
				return window.URL.addPara(pagePath.home, {
					soruce: 'azmenu'
				});
			},
			menuList() {
				// gh 暂未开放 sportybingo 入口
				const list = [{
					name: 'Live',
					children: this.live,
					icon: 'm-icon-live'
				}, {
					name: 'Sports',
					children: this.sports,
					icon: 'm-icon-sports'
				}, {
					name: 'SportyBingo',
					url: pagePath.sportybingo,
					icon: 'm-icon-bingo',
					isHide: country === 'gh'
				}, {
					name: 'Games',
					children: [{
						name: 'Lucky Poker',
						url: pagePath.luckypoker
					}, {
						name: 'Dice Battle',
						url: pagePath.dicebattle
					}, {
						name: 'Roulette',
						url: pagePath.roulette
					}],
					icon: 'm-icon-games'
				}, {
					name: 'Account',
					children: userList,
					icon: 'm-icon-account'
				}, {
					name: 'SportyCoins',
					url: userCenterUrl.sportycoin,
					icon: 'm-icon-coin'
				}, {
					name: 'Gifts',
					url: userCenterUrl.gift,
					icon: 'm-icon-gifts'
				}, {
					name: 'Promotions',
					url: userCenterUrl.promotion,
					icon: 'm-icon-promotions'
				}];

				// 如果 isHide 值为 true, 则不显示
				return list.filter(x => !x.isHide);
			}
		}
	};
</script>

<style lang="less" scoped>
	@import '~base/styles/variable.less';
	@import '~base/styles/mixin.less';
	@import 'base/styles/icon.less';
	.m-azmenu {
		width: 82.2%;
		height: 100%;
		min-height: 100%;
		position: absolute;
		left: 0;
		top: 0;
		background:@white;
		.no-data{
			text-align: center;
			.m-icon-exclamation();
			margin-top: 30%;
			color: @darkGray;
			p{
				font-size: 14/@rem;
			}
			&:before{
				color: @midGray;
				font-size: 30/@rem;
			}
		}
		.top {
			position: absolute;
			top: 0px;
			left: 0px;
			width: 100%;
			z-index: 4;
			padding: 0;
			a:hover,a:visited,a:active,a {
				color:@white;
				text-decoration: none;
			}
			background: @red;
			.opt{
                width: 100%;
				padding: 10/@rem 0 0;
                box-sizing: border-box;

                display: table;
                display: flex;
                display: grid;
                grid-template-columns: 1fr 3fr;

                align-items: center;
                justify-content: space-between;

				.m-back-icon{
					.m-icon-close();
					display: inline-block;
					width: 24/@rem;
					height: 24/@rem;
					text-align: center;
				}
				.m-icon-home{
					.m-icon-home();
					&::before{
						padding-right: 4/@rem;
					}
				}

                .m-l-left {
                    display: table-cell;
                    padding: 0 5/@rem 0 10/@rem;
                    box-sizing: border-box;
                    text-align: left;
                }

                .m-l-right {
                    padding: 0 10/@rem 0 5/@rem;
                    box-sizing: border-box;
                    text-align: right;
                    min-width: 1%;

                    .m-icon {
                    	margin-left: 12/@rem;
                    }
                }

                .m-icon {
                    font-size: 12/@rem;
                    line-height: 24/@rem;
					display: inline-block;
                    color: @white;

					&:before{
						color: white;
						font-size: 16/@rem;
						line-height: 24/@rem;
						vertical-align: top;
					}
                }
			}
			.azmenu-search-wrap{
				display: block;
				margin: 10/@rem 15/@rem 0;
				padding: 6/@rem 8/@rem;
				background-color: rgba(0, 0, 0, 0.2);
				// border: 1px solid #FFF;
				border-radius: 2/@rem;
				font-size: 12/@rem;
				line-height: 16/@rem;
				color: rgba(255,255, 255, 0.8);
				.m-icon-search {
					display: inline-block;
					vertical-align: middle;
					.m-icon-search();
                    &::before{
						padding-right: 4/@rem;
                        font-size: 16/@rem;
					}
				}
			}
			.m-azmenu-nav {
				color:@dark;
				margin-top: 3/@rem;

				.m-azmenu-nav-item{
					text-align: center;
					padding: 0;

					&:first-child{
						padding-left: 10/@rem;
					}

					&:last-child{
						padding-right: 10/@rem;
					}

					& > a {
						display: block;
						min-width: 46/@rem;
						padding: 12/@rem 3/@rem 13/@rem;
					}

					.sprot-icon{
						text-align: center;
						display: block;
						&.m-virtual-icon {
							.m-icon-virtual();
						}
						&.m-jackpot-icon {
							.m-icon-jackpot();
						}
						&.m-livescore-icon {
							.m-icon-livescore();
						}
						&.m-result-icon {
							.m-icon-result();
						}
						&.m-mobile-icon {
							.m-icon-mobile();
						}
						&.m-load-code-icon {
							.m-icon-load-code();
						}
						&:before{
							font-size: 20/@rem!important;
							width: 20/@rem;
							height: 20/@rem;
							display: inline-block;
						}
					}
					.sport-text{
						display: block;
						font-size: 10/@rem;
						line-height: 11/@rem;
					}
				}
			}
		}
	}
</style>
<style lang="less">
	@import '~base/styles/variable.less';
	@import '~base/styles/mixin.less';
	@import 'base/styles/icon.less';

	.m-azmenu {
		.sport-menu{
			// 上面top的大小
			padding-top: 140/@rem;
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			overflow: auto;
			box-sizing: border-box;
			z-index: 3;

			.m-loading-wrap{
				margin-top: 5/@rem;
			}

			.m-menu {
				display: block;
				border-bottom: 1px solid @fogGrayBorder;

				&:visited,&:active,&:link,&:hover{
					text-decoration: none;
					color: @dark;
				}

				&.m-icon-live {
					.m-menu-title {
						.m-icon-tv();
					}
				}

				&.m-icon-sports {
					.m-menu-title {
						.m-icon-ball-football();
					}
				}

				&.m-icon-account {
					.m-menu-title {
						.m-icon-user-dft;
					}

					.m-menu-conent{
						a{
							span{
								text-align: left;
							}
						}
					}
				}
				
				&.m-icon-games {
					.m-menu-conent{
						a{
							span{
								text-align: left;
							}
						}
					}
				}

				&.m-icon-coin {
					.m-menu-title {
						.m-icon-empty();
					}
				}

				&.m-icon-gifts {
					.m-menu-title {
						.m-icon-gift();
					}
				}

				&.m-icon-bingo,
				&.m-icon-roulette,
				&.m-icon-games,
				&.m-icon-promotions {
					.m-menu-title {
						padding-left: 45/@rem;
						background-position: 16/@rem center;
						background-repeat: no-repeat;
						background-size: 18/@rem auto;
					}
				}

				&.m-icon-bingo {
					.m-menu-title {
						background-image: url(base/images/icon-bingo.png);
					}
				}

				&.m-icon-roulette {
					.m-menu-title {
						background-image: url(base/images/icon-roulette.png);
					}
				}
				
				&.m-icon-games {
					.m-menu-title {
						background-image: url(../../../main/mobile/games/images/icon-games.svg);
					}
				}
				
				&.m-icon-promotions {
					.m-menu-title {
						background-image: url(base/images/icon-promotions.png);
					}
				}

				&:last-child {
					border-bottom: 0;
				}
			}
		}
	}

	.m-menu-conent{
		padding-left: 48/@rem;
		padding-right: 16/@rem;
		&>a,&>div{
			display: flex;
			box-sizing: border-box;
			height: 36/@rem;
			line-height: 36/@rem;
			&:visited,&:active,&:link,&:hover{
				text-decoration: none;
				color: @dark;
			}
			&>span{
				color: @dark;
				display: block;
				white-space: nowrap;
				flex: 1;
				justify-content: space-between;
				&:last-child{
					text-align: right;
				}
			}
		}
	}
</style>
