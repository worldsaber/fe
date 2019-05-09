<template lang="html">
	<div class="m-coins">
		<ul>
			<li class="m-c-item" v-for="item in cfg.payMethodConfig" :key="item.key" @click.stop="chgPayMethod(item.key)">
				<i :class="['i-check', {'is-checked': item.key === getCurrentPayMethods}]"></i>
				<span>{{item.value}}<template v-if="item.value === 'SportyCoins'">(Usable: <span class="t-c-green">{{showCurrency}}{{coins}}</span>)</template></span>
			</li>
		</ul>
	</div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex';
import { UPDATEPAYMETHOD } from 'store/betslip/mutationTypes';
import { payMethodConfig } from 'config/payConfig';

export default {
	props: {
		coins: {
			type: [String, Number],
			required: true
		}
	},
	data() {
		return {
			cfg: Object.freeze({
				payMethodConfig
			})
		};
	},
	computed: {
		...mapState('betslipStake', [
			'showCurrency'
		]),
		...mapGetters('betslip', [
			'getCurrentPayMethods'
		])
	},
	methods: {
		...mapMutations('betslip', {
			savePayMethods: UPDATEPAYMETHOD
		}),
		chgPayMethod(key) {
			this.savePayMethods(key);
		}
	}
};
</script>

<style lang="less" scoped>
@import '../style/coins.less';
</style>
