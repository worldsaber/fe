<template lang="html">
	<div class="m-sportsBet--bets">
		<div class="f-flex m-tips" v-if="showCashoutTips">
			<div class="m-l-left f-flex-item">
				<div class="m-t-14 m-t-black m-t-b5">Partial Cashout available now!</div>
				<div class="m-t-gray m-t-12 m-t-mt4">Take full control of your bets!</div>
			</div>
			<div class="m-l-right">
				<div class="m-t-dgreen m-t-12 m-t-b5" @click.stop="seeCashout">How to play?<i class="m-i-close" @click.stop="hideTips"></i></div>
			</div>
		</div>

		<ul class="m-bet-list">
			<li
			  v-for="item in details"
		  	  :key="item.id"
		  	  class="m-bet-item"
			  ref="betItem"
		    >
		  	  <div class="m-title f-alg-side">
		  		  <span class="f-alg-side-item">{{item.showBetType}}</span>
		  		  <span class="f-alg-side-item" v-show="item.liveCount"><span class="m-i-live">Live Now</span></span>
		  	  </div>

		  	  <ListItem
			  	:betInfo="item"
				@chgDetailBetId="saveDetailId"
				v-if="curDetailId !== item.id"
			 />

			 <Detail
			 	:betInfo="item"
				@chgDetailBetId="saveDetailId"
				v-if="curDetailId === item.id"
			 />

		  	  <div class="m-money f-alg-side">
		  		  <div class="f-alg-side-item">
		  			  <div class="m-t-14 m-t-l20 m-t-black">
		  				  <span v-if="item.hasCashouted">Remaining Stake</span>
		  				  <span v-else>Stake</span>
		  			  </div>
		  			  <div class="m-t-19 m-l-23 m-t-bold m-t- black">{{item.stake}}</div>
		  		  </div>
		  		  <div class="f-alg-side-item">
		  			  <div class="m-t-14 m-t-l20 m-t-black">Pot. Win</div>
		  			  <div class="m-t-19 m-l-23 m-t-bold m-t- black">{{item.showPotWinnings}}</div>
		  		  </div>
		  	  </div>

		  	  <div class="m-btn-wrapper" v-if="item.isCashable">
		  		  <button type="button" class="m-btn--cashout" @click.stop="toggleCashoutBar($event, true, item.id)">{{getCashoutVal(item.id)}}</button>
		  	  </div>
		  	  <p v-else class="m-t-12 m-t-l14 m-t-gray m-t-mt18">{{item.notCashableReason}}</p>
		    </li>
		</ul>

		<PopCashout
			:showPop="showCashoutBar"
			:curDetailId="cashoutBetId"
			@close="toggleCashoutBar($event, false)"
		/>
	</div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { LS } from 'storage';
import { isEmptyObject } from 'utils';

import { pagePath } from 'config/pageConfig';

import CashoutMixin from '../js/cashoutMixin';
import PopCashout from './popupCashout.vue';
import ListItem from './listItem.vue';
import Detail from './detail.vue';

export default {
	name: 'CashoutList',

	mixins: [
		CashoutMixin
	],

	components: {
		PopCashout,
		ListItem,
		Detail
	},

	data() {
		return {
			cashoutInfo: {},
			showCashoutTips: false,
			curDetailId: ''
		};
	},
	computed: {
		...mapState('openBet', [
			'details',
			'lockCal'
		]),
		...mapState('openBet', {
			popCashoutInfo: 'cashoutInfo'
		}),
		...mapGetters('openBet', [
			'getCashoutInfo'
		])
	},
	watch: {
		getCashoutInfo(val) {
			this.syncCashoutInfo();
		}
	},
	methods: {
		getCashoutVal(betId = '') {
			const popCashoutInfo = this.popCashoutInfo || {};

			let cashoutInfo = this.cashoutInfo || {},
				cashout;

			if (popCashoutInfo.betId === betId && this.lockCal) {
				// cashout = popCashoutInfo;
				popCashoutInfo.isUsed = true;
			}
			// else {
			cashout = cashoutInfo[betId] || {};
			// }

			if (isEmptyObject(cashout)) {
				return 'Cashout';
			}

			if (!cashout.coefficient || cashout.errorMsg) {
				return 'Cashout Unavailable';
			}
			// 屏蔽cashout金额显示
			// let maxCashOutAmount = cashout.maxCashOutAmount;
			// maxCashOutAmount = maxCashOutAmount ? (+cashout.maxCashOutAmount).toFixed(2) : '';
			// ${maxCashOutAmount}
			return 'Cashout';
		},
		getCashout(betId = '') {
			const cashoutInfo = this.cashoutInfo || {};
			return cashoutInfo[betId] || {};
		},
		syncCashoutInfo() {
			this.cashoutInfo = this.getCashoutInfo;
		},
		saveDetailId(id) {
			this.curDetailId = id;
		},
		hideTips() {
			this.showCashoutTips = 0;
			LS.set('h5_openbet', 0);
		},
		seeCashout() {
			location.href = `${pagePath.help}#/how-to-play/others/how-to-cashout`;
		}
	},
	created() {
		this.syncCashoutInfo();

		let cashoutTipsStatus = LS.get('h5_openbet');
		cashoutTipsStatus = cashoutTipsStatus ? +cashoutTipsStatus : 1;
		this.showCashoutTips = cashoutTipsStatus;
	}
};
</script>
<style media="screen" lang="less">
@import '../style/list.less';
</style>
