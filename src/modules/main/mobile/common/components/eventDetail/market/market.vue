<template>
<div class="m-market m-detail-market-default" v-if="market.outcomeOrder">
	<MarketTitle
		:market="market"
		:isBoost="isBoost"
		v-model="isShow"
	/>
	<!-- 正常的market -->
	<NormalContent 
	v-if="marketType === 'normalMarket'"
	:market="market"
	v-model="isShow"
	:marketType="marketType"
	/>
	<!-- specifier是&组合的market，需要拆分显示 -->
	<ComboContent 
	v-if="marketType === 'comboMarket'"
	:market="market"
	v-model="isShow"
	/>
</div>
</template>

<script>
/**
 * 这里主要显示唯一market，比如 normalmakret|combomarket即指一个market，一个id显示成一个market
 */
import { mapState } from 'vuex';
import MarketTitle from './marketTitle';
import NormalContent from './content/normalContent.vue';
import ComboContent from './content/comboContent.vue';
// 获取market的类型
import { getMarketType } from '../js/commonFun';

export default {
	name: 'normalMarket',
	components: {
		MarketTitle,
		NormalContent,
		ComboContent
	},
	props: {
		market: {
			required: true,
			type: [Object]
		},
		sportId: {
			type: String
		}
	},
	data () {
		return {
			isShow: true,
		};
	},
	computed: {
		...mapState('eventDetail', [
			'event']),
		marketType () {
			// desc包括&表示是组合market
			const id = this.market.id;
			const sportyId = this.event.sportId;
			const type = getMarketType(sportyId, id);
			return type;
		},
		isBoost () {
			// 在live的时候回有这个 getter，prematch没有
			const m = this.$store.getters['oddsBoost/isMarketBoost'];
			const event = this.event;
			// 取不到 getter就不显示
			if (!m) {
				return false;
			}
			return m.call(this, {
				tournamentId: event.tournamentId,
				eventId: event.eventId,
				marketId: this.market.id,
				specifier: this.market.specifier || '',
			});
		}
	}
};
</script>

<style lang="less">
@import './market.less';

</style>
