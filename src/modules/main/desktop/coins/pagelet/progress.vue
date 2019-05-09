<template lang="html">
  <div class="m-coins-progress">
	  <div class="m-header--wrapper">
		  <template v-if="type === 'coins'">
			  <img src="../img/coins.png" alt="" class="m-img--coins">
			  <div class="m-header">
				  <div class="m-t-14">
				  	<span class="m-t-bold m-t-fyellow">{{infos.showReq}}</span>
					<span class="m-t-white m-t-ml5">SportyCoins Required<i class="m-icon-help" @click.stop="showTips('coins')" v-if="tips.length"></i></span>
				  </div>
				  <div class="m-t-12 m-t-l14 m-t-gray">*Rollover SportyCoins by betting with it</div>
			  </div>
		  </template>
		  <template v-else>
			  <img src="../img/balance.png" alt="" class="m-img--stake">
			  <div class="m-header">
				  <div class="m-t-14">
				  	<span class="m-t-bold m-t-fyellow">{{infos.showReq}}</span>
					<span class="m-t-white m-t-ml5">Settled Stakes Required<i class="m-icon-help" @click.stop="showTips('stake')" v-if="tips.length"></i></span>
				  </div>
				  <div class="m-t-12 m-t-l14 m-t-gray m-t-mt4" v-if="infos.odds">*Minimum bet odds {{infos.odds}}</div>
			  </div>
		  </template>
	  </div>
	  <div class="m-label--wrapper f-alg-side m-t-12 m-t-l-14">
	  	<div class="m-t-white f-alg-side-item">{{prosDesc.title}}</div>
		<div class="m-t-lgreen m-t-bold f-alg-side-item" v-if="prosDesc.isSuc"><i class="m-icon-suc"></i>Succeeded</div>
		<div class="m-t-white f-alg-side-item" v-else><span class="m-t-bold m-t-16 m-t-bold9">{{infos.showLeft}}</span><span class="m-left-desc">left</span></div>
	  </div>
	  <div class="m-progress">
		<div :class="['m-val', {'m-val-fix': !infos.perct}]" :style="{'width': infos.perct > 0 ? `${infos.perct}%` : '5px'}">
			<div :class="['m-t-12', 'm-t-l16', 'm-t-bblack', {'is--in': prosDesc.isInner}]">{{infos.showCur}}</div>
		</div>
	  </div>

	  <div class="m-t-12 m-t-l14 m-t-gray m-t-reat m-t-right" @click.stop="seeDetail(activityId, type === 'coins' ? 0 : 1)">Transactions<i class="m-icon-more"></i></div>
  </div>
</template>

<script>
import { stakeReqDesc, coinsReqDesc } from '../js/config';
import PopTransMixin from '../js/popTransMixin';
import TipsPop from './tipsPop.vue';

export default {
	props: {
		infos: {
			type: Object,
			required: true
		},
		type: {
			type: String,
			required: true
		},
		activityId: {
			type: String,
			required: true
		},
		tips: {
			type: Array,
			required: true
		}
	},
	mixins: [
		PopTransMixin
	],
	computed: {
		prosDesc() {
			const infos = this.infos || {};

			return infos.showProsDesc;
		}
	},
	methods: {
		showTips(type) {
			this.$dialog();
			this.$dialog({
				title: null,
				'class': 'm-coins-popTips',
				content: TipsPop,
				contentData: type === 'coins' ?
					Object.assign({}, coinsReqDesc, { rules: this.tips }) :
					Object.assign({}, stakeReqDesc, { rules: this.tips }),
				button: []
			});
		}
	}
};
</script>

<style lang="less" scoped>
@import '../style/progress.less';
</style>
