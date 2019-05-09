export const cfgKey = {
	cashout_return_on_stake: {
		key: 'C1'
	},
	cashout_return_on_single: {
		key: 'C2'
	},
	cashout_return_on_multiple: {
		key: 'C3'
	}
};

export const fetchConfigThreshold = 3;

export const clearConfig = {
	event: {
		originKey: [
			'betStatus',
			'gameScore',
			'period',
			'matchStatus',
			'playedSeconds',
			'pointScore',
			'setScore',
			'remainingTimeInPeriod',
			'eventStatus',
			'away',
			'home',
			'startTime',
			'productStatus'
		],
		chgKeys: {
			eventStatus: 'status',
			startTime: 'estimateStartTime',
			home: 'homeTeamName',
			away: 'awayTeamName'
		}
	},
	market: {
		originKey: [
			'product',
			'marketStatus',
			'marketDesc',
			'specifier'
		],
		chgKeys: {
			marketDesc: 'desc',
			marketStatus: 'status'
		}
	},
	odds: {
		originKey: [
			'outcomeDesc',
			'odds',
			'isOutcomeActive',
			'probability',
			'currentOdds'
		],
		chgKeys: {
			outcomeDesc: 'desc',
			odds: 'bOdds',
			currentOdds: 'odds'
		}
	}
};
