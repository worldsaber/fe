import { isEmptyObject } from 'utils';
import { DoubleScoreSports } from 'config/sportsType';

export function getOddsChangeDesc(newOutcomeInfo, oldOutcomeInfo) {
	if (isEmptyObject(newOutcomeInfo) || isEmptyObject(oldOutcomeInfo) || !newOutcomeInfo.odds) {
		return '';
	}

	if (newOutcomeInfo.odds > oldOutcomeInfo.odds) {
		return 'up';
	}

	if (newOutcomeInfo.odds > oldOutcomeInfo.odds) {
		return 'down';
	}

	return '';
}

export function getSelectionInfo(state = {}, opt = '') {
	let ret;

	if (isEmptyObject(opt) || isEmptyObject(state)) {
		return ret;
	}

	const outcomeList = state.outcomeInfo,
		marketList = state.marketInfo,
		eventInfo = state.eventInfo || {},
		sportId = state.currentSport,
		eventId = state.currentEvent,
		marketId = opt.marketId,
		outcomeId = opt.outcomeId,
		baseKey = `${sportId}_${eventId}`,
		marketKey = `${baseKey}_${marketId}`,
		index = state.outcomeKeys.indexOf(marketKey),
		marketIndex = state.marketKeys.indexOf(marketKey),
		outcomeItem = index !== -1 ? outcomeList[index] : [];

	if (marketIndex === -1) {
		return ret;
	}

	for (const outcome of outcomeItem) {
		if (outcome.id === outcomeId) {
			const market = marketList[marketIndex];

			ret = {
				home: eventInfo.homeTeamName,
				away: eventInfo.awayTeamName,
				desc: market.desc,
				estimateStartTime: eventInfo.estimateStartTime,
				marketInfo: market,
				outcomeInfo: outcome,
				eventId,
				sportId,
				gameId: eventInfo.gameId,
				sportName: eventInfo.sportName.toLowerCase(),
				categoryId: eventInfo.categoryId,
				tournamentId: eventInfo.tournamentId,
				key: `${marketKey}_${outcomeId}`
			};
		}
	}

	return ret;
}

export function getScore(eventInfo = {}, name) {
	if (isEmptyObject(eventInfo)) {
		return '';
	}

	let sportId = eventInfo.sportId,
		ret;

	sportId = sportId.replace(/\D/g, '');

	if (+sportId === 5) {
		ret = [
			`${eventInfo.setScore || ''}`,
			`${(eventInfo.gameScore && eventInfo.gameScore.length && eventInfo.gameScore[eventInfo.gameScore.length - 1]) || ''}`,
			`${eventInfo.pointScore || ''}`
		];
	} else if (DoubleScoreSports.includes(+sportId)) {
		ret = [
			`${eventInfo.setScore || ''}`,
			`${(eventInfo.gameScore && eventInfo.gameScore.length && eventInfo.gameScore[eventInfo.gameScore.length - 1]) || ''}`,
		];
	} else {
		// footBall Basketball Rugby Cricket
		ret = [
			eventInfo.setScore || ''
		];
	}

	const homeScores = [];
	const awayScores = [];

	for (const scoreItem of ret) {
		if (scoreItem) {
			const tempList = scoreItem.split(':');

			homeScores.push(tempList[0] + '');
			awayScores.push(tempList[1] + '');
		}
	}

	if (name === 'home') {
		return homeScores;
	}

	return awayScores;
}
