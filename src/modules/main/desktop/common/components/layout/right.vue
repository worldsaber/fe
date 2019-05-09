<template lang="html">
  <aside class="s-right">
	  <slot>
		<div
			class="m-item"
			v-if="showRegister && !isLogin"
		>
			<InstantRegister
				:account="account"
				:theme="reigsterTheme"
			/>
		</div>
		<div
			class="m-item m-betslip-wrapper"
			v-if="showBetslips"
			id="j_betslip"
		>
			<!-- <div
				class="m-item-title"
				v-if="!isLogin"
			>
				<span>Betslip</span>
			</div> -->
			<AfTabs
				@change="handleToggle"
				:value="acctiveBetTab">
				<AfTabPane
					:label="getShowBetslipTitle"
					name="Betslip">
				</AfTabPane>
				<AfTabPane
					:label="getShowCashoutTitle"
					name="Cashout">
				</AfTabPane>
			</AfTabs>
			<Betslips v-show="acctiveBetTab === 'Betslip'" />
			<Cashout v-if="acctiveBetTab === 'Cashout'" />
		</div>
		<div class="m-item" v-if="showAd">
			<AdBar v-if="showAd" />
		</div>

		<div class="m-item" v-if="showGrandPrize">
			<GrandPrize />
		</div>
	  </slot>
  </aside>
</template>

<script>
// import { cookie } from 'storage';

import 'packages/tabs';

import { EventBus } from 'kernel/js/eventBus.js';

import commonEvent from 'config/eventConfig/commonEvent';
import cashoutEvent from 'config/cashout/eventCfg';

import 'components/betslips';
import 'components/cashout';
import 'components/login/instantRegister';
import 'components/adBar';
import 'components/grandPrize';

export default {
	name: 'RightPagelet',
	componentName: 'RightPagelet',
	props: {
		showRegister: {
			type: Boolean,
			'default': false
		},
		showBetslips: {
			type: Boolean,
			'default': true
		},
		showAd: {
			type: Boolean,
			'default': true
		},
		reigsterTheme: {
			type: String,
			'default': 'white'
		},
		showGrandPrize: {
			type: Boolean,
			'default': false
		}
	},
	data() {
		return {
			// account: cookie('phone') || '',
			account: '',
			acctiveBetTab: 'Betslip',
			isLogin: window.loginStatus,
			betCount: 0,
			cashoutCount: 0,
			getShowBetslipTitle: h => {
				const betCount = this.betCount || '';
				return h('div', [
					h('span', 'Betslip'),
					h('span', {
						'class': {
							'm-bet-count': true,
							'm-bet-count-fix': !betCount
						}
					}, betCount)
				]);
			},
			getShowCashoutTitle: h => {
				const cashoutCount = this.cashoutCount || '';

				return h('div', [
					h('span', 'Cashout'),
					h('span', {
						'class': {
							'm-bet-count': true,
							'm-bet-count-fix': !cashoutCount
						}
					}, cashoutCount)
				]);
			}
		};
	},
	methods: {
		handleToggle(type) {
			if (type !== this.acctiveBetTab) {
				this.acctiveBetTab = type;
			}

			if (type === 'Cashout') {
				this.getCashoutCount();
			}
		},
		async getCashoutCount() {
			const res = await fetch('/realSportsGame/cashAbleBets/count', {
				method: 'GET',
			}).then(res => res.json());

			const { bizCode = -1, data = {}} = res || {};

			if (bizCode === 10000) {
				this.cashoutCount = data.totalNum || 0;
			}
		}
	},
	watch: {
		betCount(val, oldVal) {
			this.acctiveBetTab = 'Betslip';
		},
		isLogin(val) {
			if (val) {
				this.getCashoutCount();
			}
		}
	},
	created() {
		this.getCashoutCount();

		EventBus.$on(commonEvent.NOTIFY_BET_COUNT, val => {
			this.betCount = val;
		});

		EventBus.$on(cashoutEvent.UPDATE_CASHOUT_COUNT, () => {
			this.getCashoutCount();
		});

		EventBus.$on(cashoutEvent.REFRESH_CASHOUT_COUNT, val => {
			this.cashoutCount -= val;
		});
	},
	mounted() {
		EventBus.$on(commonEvent.UPDATE_LOGIN_STATUS, () => {
			this.isLogin = window.loginStatus;
		});
	},
	destroyed() {
		EventBus.$off(commonEvent.NOTIFY_BET_COUNT);
		EventBus.$off(cashoutEvent.UPDATE_CASHOUT_COUNT);
		EventBus.$off(commonEvent.UPDATE_LOGIN_STATUS);
		EventBus.$off(cashoutEvent.REFRESH_CASHOUT_COUNT);
	}
};
</script>

<style lang="less">
@import 'base/style/variable.less';

.s-right {
	.m-item {
		margin-bottom: 15px;
	}

	.m-betslip-wrapper {
		// border-radius: 2px;
		background: @dark;
		// overflow: hidden;
		padding: 5px;
		box-sizing: border-box;

		.m-item-title {
			font-size: 16px;
			line-height: 22px;
			padding: 5px 5px 10px;
			box-sizing: border-box;
			color: @white;
		}

		.m-tabs-nav {
			padding: 5px 5px 0;
			box-sizing: border-box;
			margin-bottom: 5px;
		}

		.m-tabs-tab {
			font-size: 16px;
			color: @white;
			line-height: 22px;
			padding: 8px 10px 6px;
		}

		.m-tabs-tab-active {
			color: @white;
		}

		.m-tabs-ink-bar {
			background-color: @green;
			height: 3px;
		}

		.m-bet-count {
			display: inline-block;
			vertical-align: top;
			width: 20px;
			height: 20px;
			border-radius: 50%;
			color: @white;
			font-size: 12px;
			line-height: 20px;
			background: fadeout(@lightGray, 85%);
			margin-left: 5px;
		}

		.m-bet-count-fix {
			display: none;
		}
	}
}
</style>
