import { EventBus } from 'kernel/js/eventBus.js';

import cashoutEvent from 'config/cashout/eventCfg';
import commonEvent from 'config/eventConfig/commonEvent';

export default {
	data() {
		return {
			cashoutCount: 0
		};
	},
	methods: {
		async getCashoutCount() {
			const res = await fetch('/realSportsGame/cashAbleBets', {
				method: 'GET',
				body: {
					pageSize: 5
				}
			}).then(res => res.json());

			const { bizCode = -1, data = {}} = res || {};

			if (bizCode === 10000) {
				this.cashoutCount = data.cashAbleBets && data.cashAbleBets.length || 0;
			}
		}
	},
	mounted () {
		EventBus.$on(cashoutEvent.UPDATE_CASHOUT_COUNT, () => {
			this.getCashoutCount();
		});
		EventBus.$on(commonEvent.UPDATE_LOGIN_STATUS, () => {
			if (window.loginStatus) {
				this.getCashoutCount();
			}
		});
	},
	computed: {
		showCashoutCount() {
			const cashoutCount = this.cashoutCount || 0;

			if (cashoutCount > 4) {
				return '4+';
			}

			return this.cashoutCount;
		}
	},
	destoryed() {
		EventBus.$off(cashoutEvent.UPDATE_CASHOUT_COUNT);
		EventBus.$off(commonEvent.UPDATE_LOGIN_STATUS);
	}
};
