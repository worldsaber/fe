import { formatNumber, objType } from 'utils';
import dateFormat from 'kernel/js/dateFormat';

import { getScheduleDesc, getShowScore } from 'base/js/utils';

import { getSelectionStatusDesc } from '../order/commonFun';

import * as mutationTypes from './mutationTypes';
import { clearBetData, calPotWin } from './commonFun';

export default {
	// update cashout list
	[mutationTypes.UPDARECASHOUTLIST](state, data = {}) {
		const list = data.cashAbleBets || [];
		const totalNum = data.totalNum || 0,
			listCount = list.length;

		if (totalNum && list.length) {
			state.noCashout = false;
		} else {
			state.noCashout = true;
			return;
		}

		for (let i = 0; i < listCount; i++) {
			const item = list[i];

			// 更新betIdKeys
			state.betIdKeys.push(item.id);
			// status 不为0，不能cashout
			if (+item.status !== 0) {
				item.showTips = 'This match is no longer available for Cashout';
			}

			if (+item.stake === 0) {
				item.showTips = 'This bet is no longer available for Cashout';
			}

			clearBetData(item, item.selectionDescs || []);
		}

		state.cashoutList = [...state.cashoutList, ...list];
		state.lastId = state.cashoutList[state.cashoutList.length - 1].id;
		state.totalCashout = totalNum;
	},

	// update cashout detail
	[mutationTypes.UPDATECASHOUTDETAIL](state, data = {}) {
		const selections = data.selections || [];

		delete data.selections;

		// status 不为0，不能cashout
		if (data.status && +data.status !== 0) {
			data.showTips = 'This match is no longer available for Cashout';
		}

		if (data.stake && +data.stake === 0) {
			data.showTips = 'This bet is no longer available for Cashout';
		}
		clearBetData(data, selections);

		let hasLive = false;
		const tempOddsMap = {};

		const betDetailOddsMap = state.betDetailOddsMap || {};

		for (const item of selections) {
			item.showResult = +item.status === 0 ?
				'' :
				getSelectionStatusDesc(item.status);

			item.odds && (item.odds = formatNumber(item.odds, 2));

			const sportId = item.sportId.replace(/\D/g, '');
			item.showPeriod = [1, 2].includes(+item.eventStatus) ?
				getScheduleDesc(item, sportId, false) :
				dateFormat.format(item.startTime, 'DD/MM HH:mm');

			item.showScore = +item.eventStatus > 2 ?
				item.setScore :
				getShowScore(item, sportId, true);

			if ([1, 2].includes(+item.eventStatus)) {
				item.isLiveEvent = true;
			}

			const currentOdds = +item.currentOdds || -1;

			if (item.isOutComeBettable) {
				tempOddsMap[item.id] = currentOdds;
				item.statusDesc = currentOdds > betDetailOddsMap[item.id] ?
					'up' :
						currentOdds < betDetailOddsMap[item.id] ?
						'down' :
					'';
			}

			if (!hasLive && item.isLiveEvent) {
				hasLive = true;
			}
		}

		data.hasLive = hasLive;

		// 更新对应的bet基本信息，防止收起详情时，数据不一致
		const index = state.betIdKeys.indexOf(data.id);
		const tempBet = (index !== -1) && state.cashoutList[index];
		(index !== -1) && state.cashoutList.splice(index, 1, Object.assign(tempBet, data));

		state.cashoutDetail = [...selections];
		state.betDetailOddsMap = { ...tempOddsMap };
	},

	// update cashout
	[mutationTypes.UPDATECASHOUTINFO](state, data = {}) {
		const remainCount = data.remainCount,
			isInit = data.isInit || false,
			isSupportPartial = data.isSupportPartial || false;

		let cashoutAvailable = data.cashoutAvailable || true;

		if (objType(remainCount) !== 'undefined' &&
			!isInit &&
			isSupportPartial &&
			!data.cashoutFaild) {
			const cashoutList = state.cashoutList,
				betIdKeys = state.betIdKeys,
				index = betIdKeys.indexOf(state.currentBetId);

			if (+remainCount) {
				state.errorInfo = {
					type: 'dialog',
					msg: `Succeed. ${remainCount > 1 ? remainCount + ' times' : remainCount + ' time'} remain to Partial Cashout.`
				};

				cashoutList.splice(index, 1, Object.assign(
					cashoutList[index],
					{
						showStake: formatNumber(data.availableStake || 0, 2)
					}
				));
			}
			if (!+remainCount && index !== -1) {
				cashoutList.splice(index, 1, Object.assign(
					cashoutList[index],
					{
						showTips: 'This bet is no longer available for Partial Cashout'
					}
				));
			}
		}

		const maxCashOutAmount = +data.maxCashOutAmount || 0,
			coefficient = +data.coefficient || 0;

		// 检查是否能够cashout
		if ((!coefficient || !maxCashOutAmount) && cashoutAvailable) {
			data.cashoutAvailable = false;
			cashoutAvailable = false;
		}

		// 部分cashout最大值是100，转换为cashout
		if (+maxCashOutAmount === state.minCashoutAmount && isSupportPartial) {
			data.isSupportPartial = false;
		}

		// 转换显示cashout值
		if (!cashoutAvailable) {
			data.showCashoutVal = 'Unavailable';
		} else {
			data.showCashoutVal = formatNumber(maxCashOutAmount, 2);
		}

		state.cashoutInfo = { ...data };
	},

	// update betId
	[mutationTypes.UPDATEBETID](state, id) {
		// 有成功cashout的bet，点击别的bet时，删除成功的bet
		const successedBetId = state.successedBetId || '';
		if (id && successedBetId && successedBetId !== id) {
			const index = state.betIdKeys.indexOf(successedBetId);

			if (index !== -1) {
				state.betIdKeys.splice(index, 1);
				state.cashoutList.splice(index, 1);
			}

			state.successedBetId = '';
		}

		state.betDetailOddsMap = {};

		if (state.currentBetId === id) {
			state.currentBetId = '';
		} else {
			state.currentBetId = id;
		}
	},

	// 存储错误消息
	[mutationTypes.UPDATEERRORINFO](state, errorInfo) {
		state.errorInfo = { ...errorInfo };
	},

	// remove bet from cashoutList
	[mutationTypes.REMOVEBETITEM](state, betId) {
		if (betId) {
			const index = state.betIdKeys.indexOf(betId);

			if (index !== -1) {
				state.cashoutList.splice(index, 1);
				state.betIdKeys.splice(index, 1);
			}
		}
	},

	// reset cashout list
	[mutationTypes.RESETCASHOUTLIST](state, resetState = false) {
		// cashout list
		state.cashoutList.splice(0);
		state.betIdKeys.splice(0);
		state.noCashout = true;

		if (resetState) {
			state.totalCashout = 0;
			state.lastId = null;
		}

		// cashout detail
		state.cashoutDetail.splice(0);
		state.cashoutInfo = {};
		state.currentBetId = '';
		state.errorInfo = {};

		// load error
		state.loadListError = false;
		state.loadDetailError = false;

		// loading
		state.listLoading = false;
		state.detailLoading = false;
		state.refreshLoading = false;

		state.successedBetId = '';
		state.betDetailOddsMap = {};
		state.commentsInfo = {};
	},

	// update cashout list load error
	[mutationTypes.UPDATELISTLOADERROR](state, val) {
		state.loadListError = val;
	},

	// update cashout detail load error
	[mutationTypes.UPDATEDETAILLOADERROR](state, val) {
		state.loadDetailError = val;
	},

	// update list loading
	[mutationTypes.UPDATELISTLOADING](state, loading) {
		state.listLoading = loading;
	},

	// update detail loading
	[mutationTypes.UPDATEDETAILLOADING](state, loading) {
		state.detailLoading = loading;
	},

	// update detail refresh loading
	[mutationTypes.UPDATEREFRESHLOADING](state, loading) {
		state.refreshLoading = loading;
	},

	// update bet tips
	[mutationTypes.UPDATEBETTIPS](state, betTips = '') {
		const cashoutList = state.cashoutList,
			betIdKeys = state.betIdKeys,
			index = betIdKeys.indexOf(state.currentBetId);

		cashoutList.splice(index, 1, Object.assign(
			cashoutList[index],
			{
				showTips: betTips
			}
		));
	},

	// update bet Stake
	[mutationTypes.UPDATEBETSTAKE](state, cashoutInfo = {}) {
		const availableStake = +cashoutInfo.availableStake || 0;

		const cashoutList = state.cashoutList,
			betIdKeys = state.betIdKeys,
			index = betIdKeys.indexOf(state.currentBetId);

		// 检查是否能够cashout
		if (index !== -1) {
			const cashoutItem = cashoutList[index];

			cashoutList.splice(index, 1, Object.assign(
				cashoutList[index],
				{
					stake: availableStake,
					showStake: formatNumber(availableStake, 2),
					hasCashouted: !!(cashoutItem.originStake - availableStake),
					showPotWinnings: calPotWin(cashoutItem.potentialWinnings, availableStake, cashoutItem.originStake)
				}
			));
		}
	},

	[mutationTypes.SAVECASHOUTEDBETID](state, betId = '') {
		state.successedBetId = betId;
	},

	[mutationTypes.UPDATECASHOUTLOADING](state, loading = false) {
		state.cashoutLoading = loading;
	},
	[mutationTypes.UPDATECOMMETNSINFO](state, info) {
		state.commentsInfo = info;
	}
};
