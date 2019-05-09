<template>
<!-- 为了调试方便外面必须有一个元素 -->
<div>
	<Layout :isHaveRightPagelet="true">
		<div slot="beforeNav">
			<!-- 系统通知 -->
			<ImNotification :infos="sysInfo" />

			<!-- 当配置存在才可以显示下载app的横条广告 -->
			<DownLoadAPP :data="homeCfg.downloadApp" v-if="homeCfg && homeCfg.downloadApp"/>
		</div>
		<div slot="afterNav">
			<Bdcast :bdList="bscastInfo" />
		</div>
		<div class='home' slot="mid">
			<!-- 头部轮播 -->
			<af-carousel v-if="mainBanner && mainBanner.length"
				:itemsList="mainBanner"
				:carouselOps="ops"
				class="main-banner">
			</af-carousel>
			<!-- Second Banner -->
			<a class="m-second-banner" :href="secondBanner.linkUrl" v-if="secondBanner && isSecondValid" :target="secondTarget">
				<img :src="secondBanner.imgUrl" />
			</a>
			<!-- 顶级玩法分类 -->
			<AFSnapNav class="m-sports-choose" v-model="currentChooseSport">
				<template v-for="(cfg, index) in topSportList">
					<AFSnapNavItem class="m-sports-choose-item" :key="index" :name="cfg.text">
						<a :href="cfg.linkUrl" @click="onClickBadge(cfg.text)">
							<div :class="['sport-icon', cfg.cls]">
								<img v-if="cfg.imgUrl" :src="cfg.imgUrl" alt="">
							</div>
							<span class="sport-text">{{cfg.text}}</span>
							<NewBadge v-if="cfg.text === 'Cricket'" ref="newBadge"/>
						</a>
					</AFSnapNavItem>
				</template>
			</AFSnapNav>
			<!-- 流行玩法分类 -->
			<div class="m-popular" v-if="homeCfg.popularList && homeCfg.popularList.length > 0">
				<!-- <h3 class="m-popular-title">Popular</h3> -->
				<AFSnapNav class="m-popular-list" v-model="currentPopular">
					<AFSnapNavItem class="m-popular-item" v-for="(cfg, index) in homeCfg.popularList" :key="index">
						<div :class="['m-color-bar', {
							'm-color-bar--red': index % 3 === 0,
							'm-color-bar--green': index % 3 === 2,
						}]"></div>
						<a :href="cfg.linkUrl">
							<img :src="cfg.imgUrl">
						</a>
					</AFSnapNavItem>
				</AFSnapNav>
			</div>
			<!-- 推荐比赛 -->
			<RecommendEvents v-if="recommendEvents && recommendEvents.events"></RecommendEvents>
			<!-- 直播投注模块 -->
			<Live></Live>
			<!-- sports投注模块 -->
			<Sport></Sport>
			<!-- 页面底部的礼盒小浮泡 -->
			<GiftTip :data="homeCfg ? homeCfg.mainGiftBox : null"></GiftTip>
		</div>
		<div slot="beforeFooter">
			<GrandPrize :grandList="grandInfo" />
		</div>
	</Layout>
</div>
</template>

<script>
import { LS } from 'storage';
import md5 from 'blueimp-md5';
import Layout from 'components/layout/main.vue';
import 'components/loading';
import { mapActions, mapState, mapMutations, mapGetters } from 'vuex';
import { TOGGLE_RIGHT } from 'store/layout/mutationTypes';
import { formatNumber, URL } from 'utils';
import 'components/sanpNav';
import 'components/tabs';
import 'packages/carousel';
import changeRegion from 'components/popDialog/region';
import commonEvent from 'config/eventConfig/commonEvent';
import { EventBus } from 'kernel/js/eventBus.js';
import PopActivity from 'components/popDialog/popActivity';
import NewBadge from 'components/new-badge/index';
import Live from './pagelet/live.vue';
import Sport from './pagelet/sport.vue';
import GiftTip from './pagelet/giftTip.vue';
import DownLoadAPP from './pagelet/downLoadAPP.vue';
import ImNotification from './pagelet/notification.vue';
import Bdcast from './pagelet/broadcast.vue';
import GrandPrize from './pagelet/grand.vue';
import RecommendEvents from './pagelet/recommendEvents';

export default {
	name: 'index',
	components: {
		Layout,
		Live,
		Sport,
		GiftTip,
		DownLoadAPP,
		ImNotification,
		Bdcast,
		GrandPrize,
		RecommendEvents,
		NewBadge,
	},
	data () {
		return {
			currentChooseSport: 0,
			currentPopular: 0,
			ops: {
				indicators: true,
				interval: 5000,
				controls: true
			},
			sysInfo: {},
			bscastInfo: [],
			grandInfo: []
		};
	},
	created () {
		this.clearBdInfo();

		this.initHome();
		this.subProductStatus();
		// 登录状态发生重新请求页面配置
		EventBus.$on(commonEvent.UPDATE_LOGIN_STATUS, status => {
			this.fetchHomeCfg();
		});
		this.getOddsBoost();
	},
	mounted () {
		// 切换国家dialog
		changeRegion();

		// 根据路由判断是否打开betslip
		const { showBetslip } = this.$router.currentRoute.params;
		if (showBetslip) {
			this.toggleRight();
		}
	},
	beforeDestroy () {
		this.unSubProductStatus();
	},
	computed: {
		...mapGetters('home', ['recommendEvent']),
		...mapState('home', ['homeCfg', 'topSportList', 'recommendEvents']),
		mainBanner () {
			if (this.homeCfg.mainBanner && this.homeCfg.mainBanner.length) {
				return this.homeCfg.mainBanner.map(cur => ({
					link: cur.linkUrl,
					img: cur.imgUrl
				}));
			}
			return [];
		},
		isSecondValid() {
			// 配置secondbanner 时， 保留最后一个，内容字段为空， 不显示
			const banner = this.secondBanner || {};
			return banner.imgUrl && banner.linkUrl;
		},
		secondTarget() {
			if (this.isSecondValid) {
				const link = this.secondBanner.linkUrl;
				if (link.indexOf('promotion/annual_summary') > -1) {
					return '_blank';
				}
			}
			return '_self';
		},
		secondBanner () {
			return this.homeCfg.secondBanner;
		},
		hasActivity() {
			const config = this.homeCfg || {},
				alertBanner = config.alertBanner || {};

			if (alertBanner.imgUrl) {
				alertBanner.actId = URL.getPara(alertBanner.linkUrl, 'activityId');
				return true;
			}

			return false;
		}
	},
	watch: {
		hasActivity(val) {
			if (val) {
				const alertBanner = this.homeCfg.alertBanner || {},
					actId = alertBanner.actId,
					linkUrl = alertBanner.linkUrl,
					key = `${linkUrl}|${alertBanner.imgUrl || ''}`,
					oldKey = `h5_activity_${actId}`,
					oldLocKey = LS.get(oldKey);

				let isPop = LS.get(`h5_activity_${md5(key)}`) || oldLocKey;

				isPop = isPop && +isPop || 0;

				if (!isPop) {
					const image = new Image(0, 0);
					image.onload = () => {
						this.$dialog();
						this.$dialog({
							title: null,
							'class': 'm-act-pop',
							contentData: alertBanner,
							content: PopActivity,
							button: []
						});
						image.remove();
					};
					image.src = alertBanner.imgUrl;
				}

				if (+oldLocKey) {
					LS.remove(oldKey);
				}
			}
		}
	},
	methods: {
		...mapMutations('layout', {
			toggleRight: TOGGLE_RIGHT
		}),
		...mapActions(['initHome', 'changeSports']),
		...mapActions('home', ['unSubProductStatus', 'subProductStatus', 'fetchHomeCfg']),
		...mapActions('oddsBoost', [
			'getOddsBoost'
		]),
		clearBdInfo() {
			const bdConfig = window.bdcastConf || [],
				bizType2key = {
					1: 'Sports Betting',
					2: 'Virtual',
					3: 'Jackpot'
				};

			this.sysInfo = {};
			this.bscastInfo = [];
			this.grandInfo = [];

			for (const item of bdConfig) {
				const { groupType, infos = [] } = item;

				switch (groupType) {
				case 1:
					for (const notItem of infos) {
						if (notItem.text && notItem.text.length) {
							this.sysInfo = {
								text: notItem.text,
								url: notItem.url || '',
								id: notItem.id
							};
							break;
						}
					}
					break;
				case 2: {
					const bdTemp = [];
					for (const bdItem of infos) {
						if (bdItem.text && bdItem.text.length) {
							bdTemp.push({
								text: bdItem.text,
								key: bdItem.id,
								link: bdItem.url || ''
							});
						}
					}
					this.bscastInfo = [...bdTemp];
					break;
				}
				case 20:
					for (const grandItem of infos) {
						const { detail = {}} = grandItem,
							temp = {};

							// msgType为1是中奖通知
						if (detail.msgType === 1) {
							temp.id = grandItem.id;
							temp.showTime = getTimeRange(detail.bizTime);
							temp.showWinning = detail.winning && formatNumber(detail.winning / 10000, 2) || 0;
							temp.showType = `in ${bizType2key[detail.bizType]}`;
							temp.phone = detail.phone;
							this.grandInfo.push(temp);
						}
					}
					break;
				default:
				}
			}
		},
		// 设置点击标记
		onClickBadge(text) {
			if (text !== 'Cricket') {
				return;
			}

			let newBadge = this.$refs.newBadge || [];
			newBadge = newBadge[0];
			if (newBadge) {
				newBadge.setMark && newBadge.setMark();
			}
		}
	}
};

function getTimeRange(date) {
	// IDEA: 小于1小时精确到分显示 X min ago, 不足1分钟显示 1 min ago。大于1小时精确到小时显示 X hr ago。超过72小时显示为 72 hr ago。

	if (!+date) {
		return '';
	}

	const now = +new Date();
	const dis = now - date;
	const MINUTE = 60 * 1000,
		HOUR = 60 * MINUTE,
		HOUR_72 = 72 * HOUR;

	if (dis > HOUR_72) {
		return '72hr ago';
	}

	if (dis > HOUR) {
		return `${parseInt(dis / HOUR, 10)}hr ago`;
	}

	if (dis > MINUTE) {
		return `${parseInt(dis / MINUTE, 10)}min ago`;
	}

	if (dis <= 0) {
		return '';
	}

	return '1min ago';
}
</script>

<style lang="less">
@import '~base/styles/variable.less';
@import 'base/styles/icon.less';

.m-main-mid {
	.m-bscast {
		& > div {
			height: auto;
		}
	}
}

.home{
	.main-banner{
		height: 64/@rem;
		position: relative;
		.carousel{
			height: 64/@rem;
			.carousel-control{
				display: none;
			}
			.carousel-indicators{
				display: none;

				li{
					background: @white;
					opacity: .7;
					border: 1px solid transparent;
					&.active{
						opacity: 1;
					}
				}
			}
		}
	}
	.m-sports-choose-item, .m-popular-item{
		a, a:hover,a:active,a:visited {
			text-decoration: none;
			color: @dark;
			display: block;
			background: none;
			-webkit-tap-highlight-color: rgba(0, 0, 0, 0);
			outline: none;
		}
	}
	.m-sports-choose{
		.m-sports-choose-item{
			position: relative;
			flex: 0 0 auto!important;
			display: block;
			width: 55/@rem;
			padding: 0;
			box-sizing: border-box;
			color:@dark;
			text-align: center;
			& > a {
				width: 100%;
				min-height: 60/@rem;
				padding: 10/@rem 0 4/@rem;
				box-sizing: border-box;
				display: block;
			}
			.m-live-icon {
				.m-icon-tv();
			}
			.m-virtual-icon {
				.m-icon-virtual();
			}
			.m-bingo-icon {
				height: 19/@rem;
				margin: 5/@rem auto 3/@rem;
				background: url(base/images/icon-bingo.png) no-repeat center;
				background-size: 20/@rem 20/@rem;
				& + span {
					white-space: normal;
					word-wrap: break-word;
					word-break: break-all;
					width: 35/@rem;
					margin-left: 9/@rem;
				}
			}
			.m-roulette-icon {
				height: 20/@rem;
				margin: 4/@rem auto 3/@rem;
				background: url(base/images/icon-roulette.png) no-repeat center;
				background-size: 20/@rem auto;
				& + span {
					white-space: normal;
					// word-wrap: break-word;
					// word-break: break-all;
					width: 35/@rem;
					margin-left: 9/@rem;
				}
			}

			.m-games-icon {
				height: 19/@rem;
				margin: 6/@rem auto 3/@rem;
				background: url(../games/images/icon-games.svg) no-repeat center;
				background-size: 19/@rem auto;
				& + span {
					white-space: normal;
					// word-wrap: break-word;
					// word-break: break-all;
					width: 35/@rem;
					margin-left: 9/@rem;
				}
			}

			.m-shop-icon {
				.m-icon-shop();
			}
			.m-jackpot-icon {
				.m-icon-jackpot();
			}
			.m-livescore-icon {
				.m-icon-livescore();
			}
			.m-result-icon {
				.m-icon-result();
			}
			.m-load-code-icon {
				.m-icon-load-code();
			}
			.sport-icon {
				width: 20/@rem;
				height: 20/@rem;
				line-height: 20/@rem;
				text-align: center;
				margin: 2/@rem auto;

				img {
					width: 100%;
					vertical-align: top;
				}

				&:before{
					color: @dark;
					font-size: 20/@rem;
					width: 20/@rem;
					height: 20/@rem;
					display: inline-block;
					font-weight: 500;
				}
				&.m-world-cup {
					height: 19/@rem;
					margin: 5/@rem auto 3/@rem;
					background: url(./img/worldCup.png) no-repeat center;
					background-size: 19/@rem 19/@rem;
				}
			}
			.sport-text{
				display: block;
				font-size: 10/@rem;
				line-height: 1;
				white-space: normal;
			}
		}
	}
	.m-popular{
		background-image: linear-gradient(to bottom, @white, @fogGray);

		.m-snap-nav {
			padding-bottom: 8/@rem;
		}

		.m-popular-item{
			font-size: 12/@rem;
			width: 104/@rem;
			margin-right: 4/@rem;
			flex: 0 0 auto!important;
			padding: 0px;
			display: block;
			&:first-child{
				margin-left: 10/@rem;
			}
			&:last-child{
				margin-right: 10/@rem;
			}
			.m-color-bar {
				height: 3/@rem;
				background: @dark;

				&--red {
					background: @red;
				}
				&--green {
					background: @green;
				}
			}
			a{
				display: block;
				width: 100%;
				box-shadow: 0 1px 6px 0 @midGray;

				img {
					width: 100%;
					vertical-align: top;
				}
			}
		}
	}
	.m-second-banner{
		display: block;
		img{
			display: block;
			width: 100%;
		}
	}
	.m-sports,
	.m-live {
		.no-data{
			text-align: center;
			.m-icon-exclamation();
			padding: 28/@rem;
			color: @darkGray;
			font-size: 12/@rem;
			&:before{
				color: @midGray;
				font-size: 30/@rem;
			}
		}

		.m-title{
			margin: 0 10/@rem;
			font-size: 18/@rem;
			line-height: 21/@rem;
			font-weight: bold;
		}
	}

	.m-sport-bet-error{
		padding: 10/@rem;
	}

	.view-all {
		text-align: right;
		margin: 0 10/@rem;
		padding: 17/@rem 0;

		a{
			line-height: 14/@rem;
			font-size: 12/@rem;

			&:after{
				content: "\e608";
				font-family: 'iconfont';
				display: inline-block;
				margin-left: 6/@rem;
				font-size: 12/@rem;
			}
		}
	}
}
</style>
