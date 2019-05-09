import { formatNumber } from 'utils';

import * as mutationTypes from './mutationTypes';
import { formatDate, foramtTime } from '../order/commonFun';

export default {
	// update orderList
	[mutationTypes.UPDATEORDERLIST](state, data = {}) {
		const list = data.orders || [];
		const totalOrder = data.totalNum || 0;

		// clear data： money3位逗号分隔、时间
		for (const item of list) {
			item.showDate = formatDate(item.createTime);
			item.totalStake && (item.totalStake = formatNumber(item.totalStake, 2));
			item.totalWinnings && (item.totalWinnings = formatNumber(item.totalWinnings, 2));
			item.potentialWinnings && (item.potentialWinnings = formatNumber(item.potentialWinnings, 2));
			// 是否用过红包
			item.hasUseGift = item.favorAmount && Number(item.favorAmount) > 0;
			if (item.hasUseGift && item.favor) {
				item.giftType = (item.favor.favorInfo || [])[0].giftKind;
			}
		}

		state.orderList = list;
		state.totalOrder = totalOrder;
		state.pageCount = totalOrder <= 20 ? 1 : Math.ceil(totalOrder / 10);
		state.pageIndex = data.pageNo;
	},

	// update settleType
	[mutationTypes.UPDATESETTLETYPE](state, type) {
		type && (state.settleType = type);
	},

	// update orderDetail
	[mutationTypes.UPDATEORDERDETAIL](state, data = {}) {
		const elements = data.elements || [];
		const periodWinnings = data.periodWinnings || [];
		// clear data: date与time（startTime）, score(该字段，可能没有), correctOutcome
		for (const item of elements) {
			item.showDate = formatDate(item.date, 'DD/MM/YYYY');
			item.showTime = foramtTime(item.date);
			const selections = item.selections;
			item.showResult = 'Lost';
			for (const select of selections) {
				if (select.status === 1) {
					item.showResult = 'Won';
					break;
				}
			}
		}
		for (const item of periodWinnings) {
			item.perWinnins && (item.perWinnins = formatNumber(item.perWinnins, 2));
		}
		state.orderDetail = data;
	},

	// update current orderId
	[mutationTypes.UPDATEORDERID](state, id) {
		const currentId = state.currentOrderId;
		if (id) {
			if (id !== currentId) {
				state.currentOrderId = id;
			} else {
				state.currentOrderId = '';
			}
		}
	},

	// rest store.state data
	[mutationTypes.RESETSTATEDATA](state) {
		state.pageIndex = 1;
		state.orderList = [];
		state.totalOrder = 0;
		state.pageCount = 0;
		state.currentOrderId = '';
	},
};
