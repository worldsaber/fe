<template>
<div class="m-market m-detail-market-default" v-if="market.length">
	<!-- 取marketTitle 这里的boost在content中显示，所以title上不显示传false-->
	<MarketTitle
		:market="market[0]"
		:isBoost="false"
		v-model="isShow"
	/>
	<!-- 多个specifier组合成一个的market -->
	<SpeciefierComboContent
		:market="market"
		:speciefierIndex="speciefierIndex"
		v-model="isShow">
	</SpeciefierComboContent>
</div>
</template>

<script>
/**
 * 专门处理多个market组合的情况
 */
import { mapState } from 'vuex';
import MarketTitle from './marketTitle';
import SpeciefierComboContent from './content/speciefierComboContent';

export default {
	name: 'speciefierComoboMarket',
	components: {
		MarketTitle,
		SpeciefierComboContent
	},
	props: {
		market: {
			required: true,
			type: [Array]
		},
		sportId: {
			type: String
		},
		speciefierIndex: {
			type: Array
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
	}
};
</script>

<style lang="less">
@import './market.less';

</style>
