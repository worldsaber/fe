<template>
	<div class="m-gift-list-wrap">
		<div class="m-gift-num" v-if="tab === 0">
			You received {{list.length}} {{list.length===1 ? 'Gift' : 'Gifts'}} valued at {{showCurrency}}{{list.totalGiftValue}}
		</div>
		<div class="m-gift-list">
			<Gift v-for="item in gifts" :key="item.id" class="gift-item" :item="item"></Gift>
		</div>
	</div>
</template>

<script>
import { pagePath } from 'config/pageConfig';
import Gift from './gift';

export default {
	props: {
		showCurrency: '',
		list: {
			type: Array,
			default () {
				return [];
			}
		},
		tab: {
			type: Number,
			default() {
				return 0;
			}
		}
	},
	components: {
		Gift
	},
	computed: {
		gifts() {
			const list = this.list;
			return list.map(item => {
				const gift = {};
				// condition, 满减
				if (item.kind === 2) {
					gift.condition = `On Stakes of ${item.showLeastOrderAmount} or More`;
				}
				// amount
				// 直减 部分使用
				gift.suffix = ' OFF';
				if (item.kind === 1 && item.partUsed) {
					gift.amount = item.showCurBal;
					gift.suffix = ' Left';
					gift.origin = `Original Value: ${this.showCurrency}${item.showInitBal}`;
				} else {
					gift.amount = item.showInitBal;
				}
				// expire
				if (item.status === 20) { // 未到使用期间
					gift.expire = `${item.showUsableDate} - ${item.showExpireDate}`;
				} else {
					gift.expire = `Expires ${item.showExpireDate}`;
				}
				// kind
				if (item.kind === 1) {
					gift.kind = 'Cash Gift';
				} else if (item.kind === 2) {
					gift.kind = 'Discount Gift';
				}
				// exclusive
				gift.exclusive = this.getExclusiveText(item);

				// title
				gift.title = item.displayTitle;
				// desc
				gift.desc = item.displayDesc;
				gift.showDesc = false;
				// label
				gift.label = item.showLabel;
				// use
				// gift.use = this.getUseUrl(item);
				gift.isUsable = false; // pc 显示use  [20, 30].includes(item.status); // used, expire

				gift.id = item.giftId;
				gift.cls = [item.showClass, item.status === 40 ? 'm-gift-item-used' : ''];

				gift.showCurrency = this.showCurrency;
				return gift;
			});
		}
	},
	methods: {
		isBingo(item) {
			const scope = item.bizTypeScope;
			const isAll = scope.includes(0);
			const isBingo = scope.includes(4);
			return !isAll && isBingo;  // 没有all, 有bingo
		},
		// only one 类型的时候展示，其余不显示
		getExclusiveText(item) {
			const scopeMap = ['', 'Real Sport', 'Virtuals', 'Jackpot', 'Bingo'];
			const scope = item.bizTypeScope || [];
			if (scope.length === 1) {
				const type = scope[0] || 0;
				const text = scopeMap[type]; // 未知位置
				// 排除 all，未知类型
				if (text) {
					return `(Exclusively for ${text})`;
				}
			}
			return '';
		},
		getUseUrl(item) {
			const pathMap = [pagePath.sports, pagePath.sports, pagePath.virtual, pagePath.jackpot, pagePath.bingo];
			const scope = item.bizTypeScope || [];
		 	// only one 类型
			if (scope.length === 1) {
				const type = scope[0];
				return pathMap[type];
			}
			// all， 多个类型
			return pagePath.sports;
		}
	}
};
</script>
<style lang="less">
.m-gift-list{
	padding-left: 35px;
	display: flex;
	flex-wrap: wrap;
	align-items: flex-start;
	// justify-content: center;
	.gift-item{
		flex-basis: 328px;
		width: 328px;
		overflow: hidden;
		margin: 10px;
	}
}
</style>
