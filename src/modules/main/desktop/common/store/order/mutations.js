import { formatNumber } from 'utils';

import * as mutationTypes from './mutationTypes';
import { formatDate, foramtTime, getBetStatusDesc, getSelectionStatusDesc, getCombinationStatusDesc } from './commonFun';

export default {
	// update orderList
	[mutationTypes.UPDATEORDERLIST](state, data = {}) {
		const list = data.orders || [];
		const totalOrder = data.totalNum || 0,
			listCount = list.length;

		// clear data： money3位逗号分隔、时间、showBetType
		for (const item of list) {
			item.showDate = formatDate(item.createTime);

			item.totalStake && (item.totalStake = formatNumber(item.totalStake, 2));
			item.totalWinnings && (item.totalWinnings = formatNumber(item.totalWinnings, 2));
			item.totalBonus && (item.totalBonus = formatNumber(item.totalBonus, 2));
			item.potentialWinnings && (item.potentialWinnings = formatNumber(item.potentialWinnings, 2));
			// 是否用过红包
			item.hasUseGift = item.favorAmount && Number(item.favorAmount) > 0;
			if (item.hasUseGift && item.favor) {
				item.giftType = (item.favor.favorInfo || [])[0].giftKind;
			}

			const bets = item.bets || [];
			item.allInSport = true;  // 是否所有的bet都正在比赛中
			for (const betItem of bets) {
				if (betItem.status !== 0) {
					item.allInSport = false;
				}
				betItem.originStake && (betItem.originStake = formatNumber(betItem.originStake, 2));
				betItem.stake && (betItem.stake = formatNumber(betItem.stake, 2));
				betItem.winning && (betItem.winning = formatNumber(betItem.winning, 2));
				betItem.bonus && (betItem.bonus = formatNumber(betItem.bonus, 2));
				betItem.potentialWinnings && (betItem.potentialWinnings = formatNumber(betItem.potentialWinnings, 2));
				betItem.showResult = getBetStatusDesc(betItem.status);
				betItem.showBetType = `${betItem.orderType}${betItem.betType ? '-' + betItem.betType : ''}${(betItem.combinationNum || 0) > 1 ? '(x' + betItem.combinationNum + ')' : ''}`;
			}
		}
		state.orderList = list;
		state.totalOrder = totalOrder;
		state.pageCount = totalOrder <= 10 ? 1 : Math.ceil(totalOrder / 5);
		state.pageIndex = data.pageNo;

		// 更新lastOrderNo
		state.lastOrderNo = listCount ? list[listCount - 1].orderId : '';
	},

	// update settleType
	[mutationTypes.UPDATESETTLETYPE](state, type) {
		type && (state.settleType = type);
	},

	// update betDetail
	[mutationTypes.UPDATEBETDETAIL](state, data = []) {
		// clear data: date与time（startTime）,  correctOutcome
		for (const item of data) {
			item.showDate = item.startTime && formatDate(item.startTime, 'DD/MM/YYYY') || '';
			item.showTime = item.startTime && foramtTime(item.startTime);
			/*
			* unsettled详情显示Score, 网球会有三列，Set Score, Game Score（显式数组最后一个), Point Score
			* Settled详情显示Score, 网球同其他球类一样，都是一列，网球显示Set Score
			*/
			const score = item.setScore && item.setScore.split(':') || ['', ''];
			item.homeScore = score[0];
			item.awayScore = score[1];
			if (item.gameScore) {
				const gameScore = item.gameScore[item.gameScore.length - 1].split(':');
				item.gameHomeScore = gameScore[0];
				item.gameAwayScore = gameScore[1];
			}
			if (item.pointScore) {
				const pointScore = item.pointScore.split(':');
				item.pointHomeScore = pointScore[0];
				item.pointAwayScore = pointScore[1];
			}

			item.showResult = getSelectionStatusDesc(item.status);
		}

		state.betDetail = [...data];
	},

	// update combinationInfo
	[mutationTypes.UPDATECOMBINATIONINFO](state, list = []) {
		for (const item of list) {
			item.stake && (item.stake = formatNumber(item.stake, 2));
			item.originStake && (item.originStake = formatNumber(item.originStake, 2));
			item.odds && (item.odds = formatNumber(item.odds, 2));
			item.bonus && (item.bonus = formatNumber(item.bonus, 2));
			item.winnings && (item.winnings = formatNumber(item.winnings, 2));
			item.showResult = getCombinationStatusDesc(item.status);
		}

		state.combinationInfo = [...list];
	},

	// update current betId
	[mutationTypes.UPDATEBETID](state, id) {
		const currentId = state.currentBetId;
		if (id) {
			if (id !== currentId) {
				state.currentBetId = id;
			} else {
				state.currentBetId = '';
			}
		}
	},

	// update cashout history
	[mutationTypes.UPDATECASHOUTHISTORY](state, list = []) {
		for (const item of list) {
			item.showDate = formatDate(item.createTime, 'DD/MM/YYYY HH:mm:ss');
			item.usedStake && (item.usedStakeStr = formatNumber(item.usedStake, 2));
			item.amount && (item.amountStr = formatNumber(item.amount, 2));
		}

		state.cashoutHistory = [...list];
	},

	// rest store.state data
	[mutationTypes.RESETSTATEDATA](state) {
		state.pageIndex = 1;
		state.orderList = [];
		state.totalOrder = 0;
		state.pageCount = 0;
		state.currentBetId = '';
	},
};
