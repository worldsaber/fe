const marketNamesMap = {
	1: '3 Way',
	18: 'Over/Under',
	10: 'Double Chance',
	8: 'Next Goal'
};

export default {
	getCurrentSubTabs: (state, getter) => {
		const currentSportId = state.currentSportId || null;

		const ret = [];

		if (currentSportId && currentSportId === 'sr:sport:1') {
			for (const item of state.marketIds[currentSportId]) {
				ret.push({
					key: item + '',
					name: marketNamesMap[item]
				});
			}
		}

		return ret;
	},
	getShowTournments: (state, getters) => {
		if (!getters.getCurrentSubTabs.length && !state.filterLiveStream) {
			return state.sport.tournamentOrder;
		}

		const { map = {}, tournamentOrder = [] } = state.sport || {};

		const showTournment = new Set();

		for (const key of tournamentOrder) {
			const tempTourn = map[key] || {},
				events = tempTourn.events || {},
				eventsKeys = Object.keys(events);

			for (const eventKey of eventsKeys) {
				const tempEvent = events[eventKey] || {},
					markets = tempEvent.markets || {},
					marketsKeys = Object.keys(markets);

				if (state.filterLiveStream && !tempEvent.liveChannel) {
					continue;
				}

				for (const marketKey of marketsKeys) {
					if (marketKey === state.curMarketId) {
						showTournment.add(key);
						break;
					}
				}
			}
		}

		return [...showTournment];
	}
};
