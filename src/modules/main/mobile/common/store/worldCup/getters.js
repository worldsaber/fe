export default {
	getEventInfo: (state, getters) => {
		const events = state.baseInfo.events || [];

		return events.length && events[0] || {};
	},
	getRoundInfo: (state, getters) => {
		if (!state.hasInit) {
			return '';
		}

		const baseInfo = state.baseInfo || {};

		if (baseInfo.showDeadline) {
			return `Deadline for Current Prediction: ${baseInfo.showDeadline}`;
		}

		return 'Stay tuned for the next match! Coming soon!';
	},
};
