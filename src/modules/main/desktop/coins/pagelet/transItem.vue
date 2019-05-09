<template lang="html">

<li class="m-coins-trans--item">
    <div class="m-l-left">
		<div class="m-time">{{item.showCreateTime}}</div>
		<div class="m-desc" v-if="item.prompt">{{item.prompt}}</div>
		<div v-if="item.orderId" class="m-bet">
			<a :href="`${cfg.pagePath.sportOrder}/detail/${item.orderId}`">Bet History<i class="m-icon-more"></i></a>
		</div>
    </div>
    <div class="m-l-right">
		<div :class="getValStyle">{{item.amountSign || ''}} {{item.showAmount}}</div>
    </div>
</li>

</template>

<script>
import { pagePath } from 'config/pageConfig';

export default {
	props: {
		item: {
			type: Object,
			required: true
		}
	},
	data() {
		return {
			cfg: Object.freeze({
				pagePath
			})
		};
	},
	computed: {
		getValStyle() {
			const { amountSign = '', status = -1 } = this.item || {};
			const ret = ['m-value'];

			switch (amountSign) {
			case '-':
				ret.push('m-t-bblack');
				break;
			case '+':
				ret.push('m-t-dyellow');
				break;
			default:
				ret.push('m-t-green');
			}

			if (+status === 4) {
				ret.push('m-icon-right');
				this.item.amountSign = '';
			}

			return ret;
		}
	}
};

</script>
