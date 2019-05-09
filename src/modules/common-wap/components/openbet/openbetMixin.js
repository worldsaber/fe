import { EventBus } from 'kernel/js/eventBus.js';

import cashoutEvent from 'config/cashout/eventCfg';
import commonEvent from 'config/eventConfig/commonEvent';

export default {
	data() {
		return {
			unsettleCount: 0
		};
	},
	methods: {
		async getUnsettleBetsCount() {
			const res = await fetch('/realSportsGame/openbets/count', {
				method: 'GET'
			}).then(res => res.json());

			const { bizCode = -1, data = {}} = res || {};

			if (bizCode === 10000) {
				this.unsettleCount = data.totalNum || 0;
			}
		}
	},
	mounted () {
		EventBus.$on(cashoutEvent.UPDATE_CASHOUT_COUNT, () => {
			this.getUnsettleBetsCount();
		});
		EventBus.$on(commonEvent.UPDATE_LOGIN_STATUS, () => {
			if (window.loginStatus) {
				this.getUnsettleBetsCount();
			}
		});
	},
	destoryed() {
		EventBus.$off(cashoutEvent.UPDATE_CASHOUT_COUNT);
		EventBus.$off(commonEvent.UPDATE_LOGIN_STATUS);
	}
};
