import { sportsConfigById } from 'config/sports';

export default {
	recommendEvent (state) {
		if (state.recommendEvents) {
			const { eventOrder, events } = state.recommendEvents;

			for (const key in eventOrder) { // eslint-disable-line
				const keys = eventOrder[key];
				for (let i = 0; i < keys.length; i++) {
					const key = keys[i];
					const event = events[key];

					if (event) {
						return event;
					}
				}
			}
		}
	},
	currentSportName (state) {
		return sportsConfigById[state.currentSportId].name || 'football';
	},
	currentSportNameUpper (state) {
		return sportsConfigById[state.currentSportId].text || 'Football';
	},
};
