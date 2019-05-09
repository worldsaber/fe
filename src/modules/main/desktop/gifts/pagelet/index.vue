<template>
	<ULayout>
		<div class="m-gifts-header">
			<UNav :tabList='tabList' :active="0" @click="tabClick"></UNav>
			<a @click="handleShowRedeem" class="m-redeem-btn">Redeem your code</a>
		</div>

		<HowToUseGifts v-if="currentTab === 2" />
		<template v-else>
			<NoList v-if="!(giftList||[]).length" :classify="classify"></NoList>
			<template v-else>
				<GiftList :list="giftList" :showCurrency="showCurrency" :tab="currentTab"></GiftList>
				<div class="m-pg-container" v-if="pageCount > 1">
					<Pagination :pageCount="pageCount" :pageRange="10" :forcePage="forcePage" :clickHandler="pageClickHandler" :initialPage="pageIndex"  class="pagination"></Pagination>
				</div>
			</template>
			<UDesc class="giftDesc">
				<span class="m-desc-tit">What is gift?</span>
				<ul>
					<li><em>1.</em>SportyBet offers two categories of Gifts :<br>
					a) Cash Gift, can be used without any spending condition.<br>
					b) Discount Gift, can offer discounts when spending a given amount of a stake.
					</li>
					<li><em>2.</em>Gifts can be exchanged for Balance after a Winning Bet which was placed with a Gift.</li>
					<li><em>3.</em>Gifts may have a period during which they are valid and after which the Gifts will expire.</li>
					<li><em>4.</em>Players can get gifts from promotions provided by SportyBet. If you are interested in the latest promotions, please go to "Promotions" page to view more campaigns.</li>
				</ul>
			</UDesc>
		</template>
	</ULayout>
</template>

<script>
import { mapMutations } from 'vuex';
import * as mutationTypes from 'store/usercenter/mutationTypes';
import { userCenter } from 'config/order/userCenterConfig';
import ULayout from 'components/userCenter/layout';
import UNav from 'components/userCenter/nav';
import UDesc from 'components/userCenter/description';
import Pagination from 'components/pagination/pagination';
import dateFormat from 'kernel/js/dateFormat';
import { getShowCurrency } from 'config/currencyConfig';
import { formatMoneyShow } from 'config/showMoneyConfig';
import CodeForm from './codeForm';
import GiftList from './list';
import NoList from './nolist';
import HowToUseGifts from './howToUse';

import '../../mockData/gifts/index?debug';

export default {
	components: {
		ULayout,
		UNav,
		UDesc,
		GiftList,
		Pagination,
		NoList,
		HowToUseGifts
	},
	data () {
		return {
			showCurrency: getShowCurrency(),
			giftList: [],
			pageSize: 100,					// 后台分页后改回去 20
			pageCount: 0,
			pageIndex: 1,
			classify: 1,
			currentTab: 0,
			forcePage: undefined,
			tabList: ['Valid', 'Used / Expired', 'How To Use'],
			// 20-DELIVERED，30-USABLE，40-FULLY_USED，90-EXPIRED
			labelMap: {
				20: 'Upcoming',
				90: 'Expired',
				40: 'Used',
				30: ''
			}
		};
	},
	created () {
		this.updatePageTab(userCenter[1]);
		this.fetchList();
	},
	methods: {
		...mapMutations('userCenter', {
			updatePageTab: mutationTypes.UPDATE_CURRENT_TAB
		}),
		resetData () {
			this.giftList = [];
			this.pageIndex = 1;
		},
		tabClick (index) {
			this.forcePage = 1;
			this.currentTab = index;

			// how to use gifts, 不用拉数据
			if (index === 2) return;

			if (index === 1) {
				this.classify = 3;
			} else {
				this.classify = 1;
			}

			this.resetData();
			this.fetchList();
		},
		// 获取红包列表
		fetchList (pageNo) {
			// console.log(this.classify + "|" + "pageNO:" + pageNo || 1);
			const self = this;
			fetch('/promotion/v1/gifts', {
				method: 'GET',
				body: {
					classify: this.classify,
					pageSize: this.pageSize,
					pageNo: pageNo || 1
				}
			})
			.then(res => res.json())
			.then(data => {
				const bizCode = data.bizCode || 19999;
				const originData = data.data || {};
				this.forcePage = undefined;
				if (bizCode === 10000) {
					const giftList = originData.entityList || [];
					self.pageCount = Math.ceil(originData.totalNum / self.pageSize);
					self.pageIndex = pageNo || 1;
					let totalGiftValue = 0;
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
						element.showInitBal = formatMoneyShow(element.initBal / 10000, false);
						element.showCurBal = formatMoneyShow(element.curBal / 10000, false);
						totalGiftValue += element.curBal;
						element.showLeastOrderAmount = formatMoneyShow(element.leastOrderAmount / 10000, false);
					}
					giftList.totalGiftValue = formatMoneyShow(totalGiftValue / 10000);
					// console.log(self.giftList);
					self.giftList = giftList;
				}
			});
		},
		pageClickHandler (page) {
			this.fetchList(page);
		},
		handleShowRedeem () {
			this.$dialog({
				'class': 'm-redeem-dialog',
				content: CodeForm,
				button: []
			});
		}
	}
};
</script>

<style lang="less">
@import "../index.less";
</style>
