import { formatNumber } from 'utils';

export default {
	getShowPartCount: (state, getters) => formatNumber(state.participantsCount || 0, 0),
	getShowGifts: (state, getters) => formatNumber(state.gift || 0, 0),
	getTotalLives: state => state.baseLives + state.currentPeriodLives,
};
