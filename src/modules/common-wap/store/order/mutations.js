import { formatNumber } from 'utils';
import * as mutationTypes from './mutationTypes';
import { formatDate, formatWithoutYear } from './commonFun';

// 4表示multiple下的flexibet, 但是显示的时候还是显示成multiple
const betType = {
		1: 'Singles',
		2: 'Multiple',
		3: 'System',
		4: 'Multiple'
	},
	// 列表详情页面使用，20，30，40表示已settle
	winningStatus = {
		0: 'Running',
		5: 'Partial Win',
		20: 'Won',
		30: 'Lost',
		40: 'Void',
		90: 'Pending'
	},
	// bet中使用 比赛没开始或者比赛正在直播时显示Not Start | Ongoing 通过eventStatus字段判断
	status = {
		0: 'Running',
		1: 'Won',
		2: 'Lost',
		3: 'Void',
		4: 'Won', // 4为cashout,也算作won
		90: 'Pending'
	},
	comboType = {
		1: 'Single',
		2: 'Doubles',
		3: 'Triples',
	},
	favorType = {
		1: 'Cash Gift',
		2: 'Discount Gift'
	};
export default {
	[mutationTypes.UPDATETICKETLIST](state, data) {
		const list = data.entityList || [],
			monthData = {
				'01': 'JAN',
				'02': 'FEB',
				'03': 'MAR',
				'04': 'APR',
				'05': 'MAY',
				'06': 'JUNE',
				'07': 'JULY',
				'08': 'AUG',
				'09': 'SEP',
				10: 'OCT',
				11: 'NOV',
				12: 'DEC'
			};
		state.noMore = list.length === 0;
		state.bizCode = data.bizCode;
		for (const item of list) {
			// 原始订单类型
			item.originOrderType = item.orderType;
			item.orderType = betType[item.orderType];
			item.winningStatus = winningStatus[item.winningStatus];
			item.betsCount = item.selections.length;
			item.date = formatDate(item.createTime);
			item.year = item.date.split('/')[2];
			item.month = monthData[item.date.split('/')[1]];
			item.day = item.date.split('/')[0];
			if (!state.flagForDate[item.date]) {
				state.flagForDate[item.date] = 1;
				item.showDate = true;
			} else {
				item.showDate = false;
			}
			if (!state.flagForYear[item.year]) {
				state.flagForYear[item.year] = 1;
				item.showYear = true;
			} else {
				item.showYear = false;
			}
			item.totalStake && (item.showTotalStake = formatNumber(item.totalStake, 2));
			item.totalWinnings && (item.showTotalWinnings = formatNumber(item.totalWinnings, 2));
		}
		if (!state.lastOrderNo) {
			state.ticketList = list;
		} else {
			state.ticketList = [...state.ticketList, ...list];
		}
		state.totalOrder = data.totalNum;

		if (state.ticketList.length) {
			state.lastOrderNo = state.ticketList[state.ticketList.length - 1].orderId;
		}
	},

	[mutationTypes.UPDATETICKETDETAIL](state, data = {}) {
		const list = data.data || {};
		list.showTotalStake = formatNumber(list.totalStake, 2);
		list.totalWinnings = formatNumber(list.totalWinnings, 2);
		list.showTotalBonus = formatNumber(list.totalBonus, 2);
		list.showPotentialWinnings = formatNumber(list.potentialWinnings, 2);
		list.showFavorAmount = formatNumber(list.favorAmount, 2);
		list.showBonusPrize = formatNumber(list.bonusPrize, 2);
		list.showCashOutAmount = formatNumber(list.cashOutAmount, 2);
		list.showRemainStake = formatNumber(list.remainStake, 2);
		list.showUsedStake = formatNumber(list.usedStake, 2);
		list.showRemainPotentialWinnings = formatNumber(list.remainPotentialWinnings, 2);
		// 原始订单类型
		list.originOrderType = list.orderType;
		list.orderType = betType[list.orderType];
		list.winningStatusCode = list.winningStatus;
		list.winningStatus = winningStatus[list.winningStatus];
		list.date = formatWithoutYear(list.createTime);
		list.favorType = favorType[list.favorType];
		list.betsCount = list.selections.length;
		list.isShowRebet = false;
		// 是否全部settled
		list.isAllSettled = list.winningStatus === 'Won' || list.winningStatus === 'Lost' || list.winningStatus === 'Void';
		for (const item of list.selections) {
			if (item.playedSeconds) {
				item.playedSeconds = item.playedSeconds.split(':')[0] + '\'';
			}
			if (item.remainingTimeInPeriod) {
				item.remainingTimeInPeriod = item.remainingTimeInPeriod.split(':')[0] + '\'';
			}
			if (item.status === 0) {
				list.isShowRebet = true;
				list.isAllSettled = false;
			}
			item.date = formatWithoutYear(item.startTime);

			// 比赛还没有开始
			if ((item.eventStatus === 0 || item.eventStatus === 7) && item.status === 0) {
				item.status = 'Not Start';
			} else if (item.eventStatus === 1 || item.eventStatus === 2) { // 正在直播或者suspended
				item.status = 'Ongoing';
			} else {
				item.status = status[item.status];
			}
		}
		// let totalCashout = 0,
		// 	totalUsedStake = 0;
		if (list.cashOutHistory) {
			for (const item of list.cashOutHistory) {
				// totalCashout += +item.amount; 后台给了，不用算了
				// totalUsedStake += +item.usedStake;
				item.date = formatWithoutYear(item.createTime);
			}
			// list.cashOutHistory.totalCashout = formatNumber(totalCashout, 2);
			// list.cashOutHistory.totalUsedStake = formatNumber(totalUsedStake, 2);
		}
		state.ticketDetail = list;
	},

	[mutationTypes.UPDATESHOWTRACKER](state) {
		if (!state.showTracker) {
			state.showTracker = true;
		} else {
			state.showTracker = false;
		}
	},
	[mutationTypes.SHOWJPSTATISTICS](state) {
		if (!state.jp_showStatistics) {
			state.jp_showStatistics = true;
		}
	},
	[mutationTypes.UPDATEOPENBETDETAIL](state) {
		if (!state.openBetDetail) {
			state.openBetDetail = true;
		} else {
			state.openBetDetail = false;
		}
	},
	// update settleType
	[mutationTypes.UPDATESETTLETYPE](state, type) {
		state.settleType = type;
	},
	// update betDetail
	[mutationTypes.UPDATEBETDETAIL](state, data = []) {
		for (const item of data) {
			item.betType = betType[item.type];
			item.status = status[item.status];
			item.showStake = formatNumber((item.stake / 10000), 2);
			item.showBonus = formatNumber((item.bonus / 10000), 2);
			item.showOriginalStake = formatNumber((item.originalStake / 10000), 2);
			item.showPotentialWinnings = formatNumber((item.potentialWinnings / 10000), 2);
			item.showWinnings = formatNumber((item.winnings / 10000), 2);
			if (item.comboType > 3) {
				item.comboType = `${item.comboType} Folds`;
			} else {
				item.comboType = comboType[item.comboType];
			}
			item.showCashoutDetail = false;
			item.showSelection = true;
			item.totalUsedStake = 0;
			item.totalCashout = 0;
			for (const selection of item.selections) {
				selection.date = formatWithoutYear(selection.startTime);
				// selection的状态改成是按照比赛状态区分，在按照status区分
				// 比赛还没有开始
				if ((selection.eventStatus === 0 || selection.eventStatus === 7) && item.status === 0) {
					selection.status = 'Not Start';
				} else if (selection.eventStatus === 1 || selection.eventStatus === 2) { // 正在直播或者suspended
					selection.status = 'Ongoing';
				} else {
					selection.status = status[selection.status];
				}
				if (selection.playedSeconds) {
					selection.playedSeconds = selection.playedSeconds.split(':')[0] + '\'';
				}
				if (selection.remainingTimeInPeriod) {
					selection.remainingTimeInPeriod = selection.remainingTimeInPeriod.split(':')[0] + '\'';
				}
			}
			// combinations状态还用status
			for (const com of item.combinations) {
				com.status = status[com.status];
			}
			if (item.cashOutHistorys) {
				for (const cashout of item.cashOutHistorys) {
					cashout.date = formatWithoutYear(cashout.createTime);
					item.totalUsedStake += (+cashout.usedStake || 0);
					item.totalCashout += (+cashout.amount || 0);
					cashout.showUsedStake = formatNumber(cashout.usedStake / 10000, 2);
					cashout.showAmount = formatNumber(cashout.amount / 10000, 2);
				}
				item.showTotalUsedStake = formatNumber(item.totalUsedStake / 10000, 2);
				item.showTotalCashout = formatNumber(item.totalCashout / 10000, 2);
			}
		}
		state.betDetail = [...data];
	},
	// update lastOrderNo
	[mutationTypes.UPDATELASTORDERNO](state, id) {
		const lastOrderNo = state.lastOrderNo;
		if (!id) {
			state.lastOrderNo = '';
		} else if (id !== lastOrderNo) {
			state.lastOrderNo = id;
		}
	},
	[mutationTypes.CLEARLASTORDERNO](state, id) {
		state.lastOrderNo = '';
	},
	// rest store.state data
	[mutationTypes.RESETSTATEDATA](state) {
		state.ticketList = [];
	},
	[mutationTypes.RESETTICKETDETAIL](state) {
		state.ticketDetail = {};
		state.shareGiftId = '';
		state.giftLoaded = false;
	},
	[mutationTypes.UPDATEFROM](state, date) {
		state.from = date;
	},
	[mutationTypes.UPDATETO](state, date) {
		state.to = date;
	},
	[mutationTypes.CLEARFROM](state) {
		state.from = null;
	},
	[mutationTypes.CLEARTO](state) {
		state.to = null;
	},
	[mutationTypes.CLEARFLAGFORDATE](state) {
		state.flagForDate = {};
	},
	[mutationTypes.CLEARFLAGFORYEAR](state) {
		state.flagForYear = {};
	},
	[mutationTypes.UPDATESHAREGIFTID](state, giftId) {
		state.shareGiftId = giftId;
	},
	[mutationTypes.UPDTAEGIFTSLOADSTATUS](state, status) {
		state.giftLoaded = status;
	},
	[mutationTypes.UPDATEONLYWINNINGS](state) {
		if (!state.onlyWinnings) {
			state.onlyWinnings = 1;
		} else {
			state.onlyWinnings = 0;
		}
	},
	[mutationTypes.CLOSEONLYWINNINGS](state) {
		state.onlyWinnings = 0;
	},
	[mutationTypes.SHOWHISTORY](state) {
		state.isHistory = 1;
	},
	[mutationTypes.HIDEHISTORY](state) {
		state.isHistory = 0;
	},
	[mutationTypes.UPDATE_LOADING](state, status) {
		state.isLoading = status;
	},
	[mutationTypes.UPDATEERRORINFO](state, error) {
		state.errorInfo = error || {};
	},
	[mutationTypes.UPDATENOMOREVAL](state, val) {
		state.noMore = val || false;
	}
};
