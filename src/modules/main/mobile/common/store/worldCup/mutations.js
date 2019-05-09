import { isEmptyObject } from 'utils';
import dateFormat from 'kernel/js/dateFormat';
import * as type from './mutationTypes';

export default {
	[type.UPDTAE_BASE_INFO](state, data) {
		if (isEmptyObject(data)) {
			state.homeStatus = 2;
			return;
		}

		const { deadLine = '', events = {}, outOfDate = false } = data || {};

		if (!events.length || !events[0].eventId || outOfDate) {
			state.homeStatus = 2;
			return;
		}

		state.homeStatus = 1;

		deadLine && (data.showDeadline = dateFormat.format(deadLine, 'DD/MM HH:mm:ss'));
		state.baseInfo = { ...data };
	},

	[type.UPDATE_PHONE](state, phone) {
		state.verifiedPhone = phone;
	},

	[type.UPDATE_PAGE_MODULE](state, name) {
		state.pageModule = name;
	},

	[type.UPDATE_REQUEST_STATUS](state, status) {
		state.reqLoading = status;
	},

	[type.UPDATE_INIT_STATUS](state, isInit) {
		state.hasInit = isInit;
	},

	[type.UPDATE_SHARED_INFO](state, info) {
		state.sharedInfo = info;
	},

	[type.RESETDATA](state) {
		state.baseInfo = {};
		state.verifiedPhone = '';
		state.sharedInfo = {};
		state.hasInit = false;
		state.homeStatus = -1;
	},

	[type.UPDATEACTCONFIG](state, config) {
		if (isEmptyObject(config)) {
			return;
		}

		state.actConfig = { ...config };
	}
};
