import { isEmptyObject, objType } from 'utils';
import clearPushData from 'components/eventUtil/clearPushData';
import { getBetStatus } from 'store/betslip/utils';

import * as mutationTypes from './mutationTypes';
import { cfgKey } from './config';

import { calPotWin, clearSelPeriodInfo } from './commonFun';

export default {
	[mutationTypes.UPDATEBECOUNT](state, opt) {
		const { listCount = 0 } = opt || {};
		let count = opt.count || 0;

		const pageSize = state.pageSize,
			pageIndex = state.pageIndex;

		if (listCount < pageSize && count) {
			count = Math.min(pageSize * (pageIndex - 1) + listCount, count);
		}

		const lastPageIndex = Math.ceil(count / pageSize);
		if (lastPageIndex < pageIndex) {
			state.pageIndex = Math.max(lastPageIndex, 1);
			state.lockPageUpdate = true;
		}

		state.totalCount = count;
	},

	[mutationTypes.UPDATEDETAILINFO](state, opt) {
		const { betList = [], index = -1, updateInfo = {}} = opt || {};

		if (index === -1) {
			for (let i = 0, len = betList.length; i < len; i++) {
				const item = betList[i];
				state.betKeys.push(item.id);
			}

			state.details = betList;
		} else {
			state.details.splice(index, 1, updateInfo);
		}
	},
	[mutationTypes.UPDATESELECTIONSINFO](state, opt) {
		const { betIds = [], type = '' } = opt || {};
		let { pushData = '' } = opt || {};

		if (!pushData) {
			return;
		}

		try {
			pushData = JSON.parse(pushData);
		} catch (e) {
			return;
		}

		if (type === 'event' && isEmptyObject(pushData)) {
			return;
		}

		if (type !== 'event' && (!Array.isArray(pushData) || !pushData.length)) {
			return;
		}

		const details = state.details || [],
			betKeys = state.betKeys || [];

		let currentBet,
			currentSel,
			updateMarket,
			updateEvent,
			updateOutcome,
			status4outcome;

		for (let i = 0, len = betIds.length; i < len; i++) {
			let tempKey = betIds[i];

			tempKey = tempKey.split('__');
			const curBetId = tempKey[0],
				selKey = tempKey[1];

			const index = betKeys.indexOf(curBetId);

			if (index !== -1) {
				currentBet = details[index];
				currentSel = currentBet.selections;
				currentSel = currentSel[selKey];

				updateEvent = currentSel.eventInfo;
				updateOutcome = currentSel.outcomeInfo;
				updateMarket = currentSel.marketInfo;

				if (type !== 'event' && updateOutcome.lockUpdate) {
					continue;
				}

				switch (type) {
				case 'event':
					{
						const eventUpInfo = clearPushData(pushData, 'event');
						let productStatus = eventUpInfo.productStatus.split('#');

						productStatus = productStatus.length === 2 ? +productStatus[1] : 0;

						let tempMarketStatus;

						if (productStatus || [3, 4, 5, 6].indexOf(eventUpInfo.status) !== -1) {
							tempMarketStatus = 3;
						}

						if ([1, 2].indexOf(eventUpInfo.betStatus) !== -1) {
							tempMarketStatus = eventUpInfo.betStatus;
						}

						updateEvent = Object.assign(updateEvent, eventUpInfo);

						const isLiveEvent = currentSel.isLiveEvent;
						const curIsLiveEvent = clearSelPeriodInfo(currentSel);

						if (isLiveEvent && !curIsLiveEvent) {
							currentBet.liveCount -= 1;
						}

						if (!isLiveEvent && curIsLiveEvent) {
							currentBet.liveCount += 1;
						}

						if (tempMarketStatus !== updateMarket.status) {
							updateMarket = Object.assign(updateMarket, {
								fixStatus: tempMarketStatus
							});

							status4outcome = getBetStatus(updateMarket, updateOutcome, null, false);
						}

						if (objType(tempMarketStatus) === 'undefined') {
							updateMarket = Object.assign(updateMarket, {
								fixStatus: 0
							});
						}

						if ([3, 4, 5, 6].indexOf(updateEvent.status) !== -1) {
							currentSel.isFinish = true;
						}

						break;
					}
				case 'market':
					{
						const pushTime = pushData[pushData.length - 1];

						if (!updateMarket.pushTime || updateMarket.pushTime < pushTime) {
							const marketUpInfo = clearPushData(pushData, 'market');

							(marketUpInfo.status !== updateMarket.status) && (status4outcome = getBetStatus(marketUpInfo, updateOutcome, null, false));

							updateMarket = Object.assign(updateMarket, marketUpInfo, { pushTime });
						}
						break;
					}
				case 'odds':
					{
						const pushTime = pushData[pushData.length - 2];

						if (!updateOutcome.pushTime || updateOutcome.pushTime < pushTime) {
							const marketUpInfo = clearPushData(pushData, 'market');
							let outcomeUpInfo = clearPushData(pushData, 'odds');

							outcomeUpInfo = outcomeUpInfo[currentSel.outcomeId];

							status4outcome = getBetStatus(marketUpInfo, outcomeUpInfo, updateOutcome, true);

							updateMarket = Object.assign(updateMarket, marketUpInfo, { pushTime });
							updateOutcome = Object.assign(updateOutcome, outcomeUpInfo, { pushTime });
						}
						break;
					}
				default:
				}

				if (status4outcome) {
					if (status4outcome.showOdds && !updateOutcome.showOdds) {
						currentBet.unavailableCount -= 1;
					}

					if (!status4outcome.showOdds && updateOutcome.showOdds) {
						currentBet.unavailableCount += 1;
					}

					updateOutcome = Object.assign(updateOutcome, status4outcome);
				}

				currentSel = Object.assign(currentSel, {
					outcomeInfo: updateOutcome,
					marketInfo: updateMarket,
					eventInfo: updateEvent
				});

				state.details.splice(index, 1, currentBet);
			}
		}
	},

	[mutationTypes.UPDATECURRENTPAGE](state, page = 1) {
		state.pageIndex = page;
		state.lockPageUpdate = false;
	},

	[mutationTypes.UPDATEERRORINFO](state, info) {
		state.errorInfo = info;
	},

	[mutationTypes.RESETDETAILINFO](state) {
		state.details.splice(0);
		state.betKeys.splice(0);
		state.totalCount = 0;
		state.cashoutInfo = {};
		state.lockPageUpdate = false;
		state.lockCal = false;
	},

	[mutationTypes.UPDATEREQLOADING](state, loading = false) {
		state.reqLoading = loading;
	},

	[mutationTypes.UPDATEBETSTAKE](state, opt) {
		const { cashout = {}, betId = '' } = opt || {};
		const index = state.betKeys.indexOf(betId);

		if (index !== -1) {
			const availableStake = +cashout.availableStake || 0;

			const details = state.details,
				currentBet = details[index];

			details.splice(index, 1, Object.assign(
				currentBet,
				{
					stake: availableStake,
					hasCashouted: !!(currentBet.originStake - availableStake),
					showPotWinnings: calPotWin(currentBet.potentialWinnings, availableStake, currentBet.originStake)
				}
			));
		}
	},

	[mutationTypes.UPDATECOMMETNSINFO](state, info) {
		state.commentsInfo = info;
	},

	[mutationTypes.STORECONFIG](state, opt) {
		const ret = {};
		let temp;

		for (const item of opt) {
			temp = cfgKey[item.configKey];
			ret[temp.key] = item.configValue && +item.configValue || 0;
		}

		state.cfgInfo = ret;
	},
	[mutationTypes.UPDATELOGINSTATUS](state, status) {
		state.isLogin = status;
	},
	[mutationTypes.UPDATECASHOUTINFO](state, info) {
		if (info) {
			const { coefficient = 0, maxCashOutAmount = 0 } = info || {};
			if (!+coefficient || !+maxCashOutAmount) {
				info.errorMsg = info.errorMsg || 'Cashout unavailable, please refresh.';
			}

			if (info.errorMsg) {
				info.cashoutAvailable = false;
			} else {
				info.cashoutAvailable = true;
			}
		}

		state.cashoutInfo = info || {};
	},
	[mutationTypes.UPDATELOCKSTATUS](state, status) {
		state.lockCal = status;
	},
	[mutationTypes.UPDATEADCONFIG](state, cfg) {
		state.adCfg = cfg || {};
	}
};
