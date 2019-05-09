<template>
	<Layout :isHaveBottomNav="false" :isHasFooter="false" :isHaveLoading="false" :isNeedScroll="true" :isHaveShare="true">
		<div slot="mid" class="m-bingo-home">
			<BackBar :backClick="onBackClick">
				<template slot="right">
					<a class="bingo-home-help" :href="helpUrl">?</a>
				</template>
			</BackBar>
			<div :class="['bingo-space-fixed', {
				'is-mine': isMine,
				'is-fixed': isFixed
			}]">
				<div :class="['bingo-nav-tab-wrap', tabCls]" ref="bingoTab">
					<ul class="bingo-nav-tab">
						<router-link tag="li"  v-for="tab in tabs" :key="tab.label" :to="tab.link" :class="['bingo-nav-tab-item']">
							{{tab.label}}
						</router-link>
					</ul>
					<div class="mine-navs" v-if="isMine">
						<router-link
							v-for="(nav, index) in navs"
							:key="index"
							:class="['mine-nav-item', { 'mine-nav-item--active': mineTab === nav.link.query.tab }]"
							:to="nav.link">
							{{nav.label}}
						</router-link>
					</div>
				</div>
			</div>
			<!-- keep-alive 导致 morelist存在多个时，layout 滚动会触发多个morelist去loadNextPage -->
			<router-view></router-view>
		</div>
	</Layout>
</template>
<script>
import Layout from 'components/layout/main.vue';
import BackBar from 'components/navbar';
import { pagePath } from 'config/pageConfig';
import { mapState, mapMutations, mapActions } from 'vuex';
import { RESET_SCROLL } from 'store/layout/mutationTypes';

export default {
	data() {
		return {
			activeNav: 0,
			offsetTop: 0, // tab的偏移顶部的距离
			isMine: false, // 是否是 Mine 页面
			broadcastTimer: null
		};
	},
	components: {
		BackBar,
		Layout
	},
	computed: {
		...mapState('layout', [
			'scrollPayload'
		]),
		tabs() {
			const tabs = [{
				label: 'Most Popular',
				link: {
					name: 'popular'
				}
			}, {
				label: 'Published',
				link: {
					name: 'published'
				}
			}, {
				label: 'Mine',
				link: {
					name: 'mine'
				}
			}];
			return tabs;
		},
		tabCls() {
			return this.isFixed ? 'bingo-nav-tab-fixed' : '';
		},
		isFixed() {
			const payload = this.scrollPayload || { top: 0 };
			const top = payload.scrollTop;
			return this.offsetTop > 0 && top >= this.offsetTop;  // 需要等待mounted后的计算才算有效
		},
		navs() {
			return [{
				label: 'All',
				link: {
					name: 'mine',
					query: {
						tab: 'all',
					}
				}
			}, {
				label: 'Ongoing',
				link: {
					name: 'mine',
					query: {
						tab: 'ongoing',
					}
				}
			}, {
				label: 'Published',
				link: {
					name: 'mine',
					query: {
						tab: 'published',
					}
				}
			}];
		},
		mineTab() {
			if (this.isMine) {
				const query = this.$route.query;
				return query.tab || 'all';
			}
		},
		helpUrl() {
			return `${pagePath.help}#/about/terms-and-conditions/sportybingo`;
		}
	},
	watch: {
		$route: {
			immediate: true,
			handler(to, from) {
				if (this.isFixed) {
					this.resetScroll({
						top: this.offsetTop
					});
				}

				this.isMine = !!to.matched.find(x => x.name === 'mine');
			}
		}
	},
	created() {
		this.getCarouselAds();
		this.broadcastListInterval();
	},
	mounted() {
		const $tab = this.$refs.bingoTab;
		if ($tab) {
			const rect = $tab.getBoundingClientRect();
			const offset = rect.top + this.scrollPayload.scrollTop;
			this.offsetTop = offset;
		}
	},
	destroyed() {
		if (this.broadcastTimer) {
			clearTimeout(this.broadcastTimer);
			this.broadcastTimer = null;
		}
	},
	methods: {
		onBackClick() {
			location.href = pagePath.home;
		},
		...mapMutations('layout', {
			resetScroll: RESET_SCROLL
		}),
		...mapActions('bingo', [
			'getCarouselAds',
			'getBroadcastList'
		]),
		broadcastListInterval() {
			this.getBroadcastList()
			.then(() => {
				// 5分钟后台更新数据
				if (this.broadcastTimer) {
					return;
				}
				this.broadcastTimer = setTimeout(() => {
					this.broadcastTimer = null;
					this.broadcastListInterval();
				}, 5 * 60 * 1000);
			});
		},
	}
};
</script>
<style lang="less">
@import 'base/styles/variable.less';

.bingo-nav-tab{
	width: 100%;
	display: flex;
	height: 50/@rem;
	line-height: 50/@rem;
	text-align: center;
	justify-content: center;
	align-items: center;
	box-sizing: border-box;
	border-bottom: 1px solid #eaecef;
	background-color: #FFF;
}
.bingo-nav-tab-fixed{
	position: fixed;
	top: 0;
	width: 100%;
	background-color: #FFF;
	z-index: 1000;
}
.bingo-nav-tab-item{
	flex: 1;
	height: 50/@rem;
	font-size: 14/@rem;
	color: #1b1e25;
	box-sizing: border-box;
	&.router-link-active{
		color: #0d9737;
		border-bottom: 4px solid #0d9737;
	}
}
.bingo-space-fixed{
	height: 50/@rem;
	&.is-mine{
		height: 108/@rem;
	}
}

.mine-navs{
	display: flex;
	align-items: center;
	padding: 15/@rem 14/@rem 16/@rem;
	background-color: #FFF;
	.mine-nav-item {
		display: block;
		min-width: 70/@rem;
		padding: 0 12/@rem;
		box-sizing: border-box;
		height: 27/@rem;
		line-height: 27/@rem;
		text-align: center;
		border-radius: 27/2/@rem;
		background: @lightGray;
		margin-right: 7/@rem;

		font-size: 12/@rem;
		font-weight: bold;
		color: @blueBlack;
		text-decoration: none;

		&:active, &:visited, &:hover {
			text-decoration: none;
		}

		&:last-child {
			margin-right: 0;
		}

		&--active {
			background: @midGreen;
			color: @white;
		}
	}
}
.bingo-home-help{
	width: 16/@rem;
	height: 16/@rem;
	line-height: 18/@rem;
	border: 1.5/@rem solid #353a45;
	color: #353a45;
	text-align: center;
	font-weight: bold;
	border-radius: 50%;
	font-size: 16/@rem;
	cursor: pointer;
}
</style>

