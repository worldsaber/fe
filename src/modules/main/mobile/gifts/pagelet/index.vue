<template>
	<div class="m-uc-wrapper m-gift-wrapper">
		<topNavBar :link="backLink">
			<router-link slot="right" class="m-top-link" :to="{ name: 'giftsDesc' }">How to use</router-link>
		</topNavBar>
		<!-- <ShopBanner keyword="buyGiftFavorPage" /> -->
		<div class="m-uc-nav-wrap">
			<tabNavBar :tabList='tabList' :active="currentTab" @click="tabClick"></tabNavBar>
		</div>
		<!-- <CodeForm></CodeForm> -->
		<div v-loading:fetchData="loading">
			<template v-if="!loading">
				<a class="to-manual" :href="redeem">Redeem your gift code</a>
				<Nolist v-if="giftList.length === 0"  :tabType="currentTab"></Nolist>
				<template v-else>
					<div class="m-gift-list-title" v-show="valiateTitle">{{giftTitle}}</div>
					<GiftList :list="giftList" :showCurrency="showCurrency"></GiftList>
					<div class="m-list-nomore" v-if="showNoMoreRecord">No More Gifts</div>
				</template>
			</template>
		</div>
	</div>
</template>

<script>
import dateFormat from 'kernel/js/dateFormat';
import topNavBar from 'components/navbar';
// import { getAdConfig } from 'utils/getAdConfig';
import { pagePath } from 'config/pageConfig';
import { showCurrency } from 'config/currencyConfig';
import { formatMoneyShow } from 'config/showMoneyConfig';
import tabNavBar from '../../deposit/ke/pagelet/nav';
// import ShopBanner from '../../shop/pagelet/adBanner.vue';
import GiftList from './list';
import Nolist from './nolist';
// import CodeForm from './codeForm';
import '../../mockData/gifts/index?debug';

export default {
	components: {
		topNavBar,
		tabNavBar,
		// CodeForm,
		GiftList,
		Nolist,
		// ShopBanner
	},
	computed: {
		showNoMoreRecord () {
			const len = this.giftList.length || 0;
			return len && len >= this.totalNum && this.hasScroll;
		},
		giftTitle () {
			let gift = `${this.totalNum} Gifts`;
			if (+this.totalNum === 1) {
				gift = `${this.totalNum} Gift`;
			}
			return `You received ${gift} valued at ${this.showCurrency}${this.totalAmounts}`;
		},
		// gifts 总金额
		totalAmounts() {
			const gifts = this.giftList;
			let amount = 0;
			for (const gift of gifts) {
				amount += gift.curBal;
			}
			amount /= 10000;
			return formatMoneyShow(amount);
		},
		// 仅在 Valid tab 下显示title
		valiateTitle() {
			return this.classify === 1;
		},
		backLink () {
			return pagePath.home;
		}
	},
	data () {
		return {
			showCurrency,
			tabList: ['Valid', 'Used / Expired'],
			classify: 1,
			totalNum: 0,
			pageSize: 100,							// 后台分页后改回去 20
			giftList: [],
			currentTab: 0,
			lastGiftId: '',
			loading: false,
			isAjax: false,
			// 20-DELIVERED，30-USABLE，40-FULLY_USED，90-EXPIRED
			labelMap: {
				20: 'Upcoming',
				90: 'Expired',
				40: 'Used',
				30: ''
			},
			// adData: {},  // 列表为空时的广告对象
			helpUrl: pagePath.help,
			link: pagePath.home,
			redeem: pagePath.redeem,
		};
	},
	created () {
		this.tabClick(0);
	},
	mounted () {
		const wrapper = document.querySelector('.m-main-mid');
		this.fixedTabNav(wrapper);
		wrapper.addEventListener('scroll', e => {
			if (wrapper.scrollTop + wrapper.clientHeight >= wrapper.scrollHeight) {
				this.hasScroll = true;
				this.getMoreList();
			}
		}, false);
	},
	methods: {
		getMoreList () {
			if (this.giftList.length < this.totalNum && !this.isAjax) {
				this.isAjax = true;
				this.fetchList().then(() => {
					this.isAjax = false;
				}).catch(() => {
					this.isAjax = false;
				});
			}
		},
		resetData () {
			this.giftList = [];
			this.lastGiftId = '';
			this.hasScroll = false;
		},
		tabClick (index) {
			const wrapper = document.querySelector('.m-main-mid');
			this.currentTab = index;
			if (index === 1) {
				this.classify = 3;
			} else {
				this.classify = 1;
			}
			this.resetData();
			this.fetchData();
			if (wrapper) {
				wrapper.scrollTop = 0;
			}
		},
		fetchData () {
			this.loading = true;
			this.fetchList().then(() => {
				this.loading = false;
				this.hasScroll = false;
			}).catch(() => {
				this.loading = -1;
				this.hasScroll = false;
			});
		},
		// 获取红包列表
		fetchList (pageNo) {
			return new Promise((resolve, reject) => {
				// console.log(this.classify + "|" + "lastGiftId:" + this.lastGiftId);
				const self = this;
				const param = {
					classify: this.classify,
					pageSize: this.pageSize,
				};
				if (this.lastGiftId) {
					param.lastId = this.lastGiftId;
				}
				fetch('/promotion/v1/gifts', {
					method: 'GET',
					body: param
				})
				.then(res => res.json())
				.then(data => {
					const bizCode = data.bizCode || 19999;
					const originData = data.data || {};
					if (bizCode === 10000) {
						const giftList = originData.entityList || [];
						self.totalNum = originData.totalNum;
						if (giftList.length > 0) {
							for (const element of giftList) {
								const expireTime = element.expireTime;
								const usableTime = element.usableTime;
								element.showLabel = self.labelMap[element.status] || '';
								element.partUsed = element.initBal !== element.curBal && element.status === 30; // 未过期时是否部分使用
								if (element.status === 40 || element.status === 90) {
									element.showClass = 'm-gift-item-gray';
								} else if (element.kind === 1) { // 直减
									element.showClass = 'm-gift-item-lapse';
								} else {
									element.showClass = 'm-gift-item-discount';
								}
								// 红包使用过，并且已经过期显示成used而不是 expried
								if ((element.status === 40 || element.status === 90) && element.initBal !== element.curBal) {
									element.showLabel = 'Used';
								}
								if (expireTime) {
									element.showExpireDate = dateFormat.format(expireTime, 'DD/MM/YYYY');
								}
								if (usableTime) {
									element.showUsableDate = dateFormat.format(usableTime, 'DD/MM/YYYY');
								}
								const initBal = element.initBal / 10000;
								element.showInitBal = formatMoneyShow(initBal, false);
								const curBal = element.curBal / 10000;
								element.showCurBal = formatMoneyShow(curBal, false);
								const leastOrderAmount = element.leastOrderAmount / 10000;
								element.showLeastOrderAmount = formatMoneyShow(leastOrderAmount, false);
							}
							if (param.lastId) {
								self.giftList = [...self.giftList, ...giftList];
							} else {
								self.giftList = giftList;
							}
							self.lastGiftId = giftList[giftList.length - 1].giftId;
						}
						resolve(true);
					} else {
						reject(false);
					}
				}).catch(() => {
					reject(false);
				});
			});
		},
		fixedTabNav (wrapper) {
			const navWrap = document.querySelector('.m-uc-nav-wrap');
			const nav = navWrap.querySelector('.m-uc-nav');
			// 页面滚动时，导航吸顶
			wrapper.addEventListener('scroll', e => {
				if (navWrap.getBoundingClientRect().top < 0) {
					nav.addClass('m-uc-nav-fixed');
				} else {
					nav.removeClass('m-uc-nav-fixed');
				}
			});
		}
	}
};
</script>

<style lang="less">
@import 'base/styles/variable.less';
.to-manual {
	margin: 18/@rem 0 23/@rem 16/@rem;
	display: block;
	text-decoration: none;
	color: #0d9737;
	&:hover {
		text-decoration: none;
	}
	&:before {
		content: '+';
		display: inline-block;
		margin-right: 4/@rem;
		text-align: center;
		background:@green;
		color: #fff;
		border-radius: 8/@rem;
		width: 16/@rem;
		height: 16/@rem;
		line-height: 16/@rem;
		font-size: 16/@rem;
	}
}
.m-gift-wrapper{
    .m-top-link{
      	color:@linkBlue;
      	font-size: 12/@rem;
	}
	.m-uc-nav-wrap{
		height: 49/@rem;
	}
    .m-uc-nav{
      	border-bottom:1px solid @lightGray;
		box-shadow: none;
		&.m-uc-nav-fixed{
			position: fixed;
			top:0;
			left: 0;
			width:100%;
		}
	}
	.m-list-nomore{
		height: 35/@rem;
		line-height: 35/@rem;
		font-size: 12/@rem;
		text-align: center;
		background: @fogGray;
	}
	.m-gift-list-title{
		font-size: 14/@rem;
		color: #353a45;
		margin: 0 5% 15/@rem;
	}
	.gift-tip{
		font-size: 12/@rem;
		color: #9ca0ab;
		margin: 15/@rem 5% -10/@rem;
	}
}
</style>
