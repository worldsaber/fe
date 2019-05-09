import userPush from 'push/userPush';
import { cookie } from 'storage';
import { formatNumber } from 'utils';

import { EventBus } from 'kernel/js/eventBus.js';
import commonEvent from 'config/eventConfig/commonEvent';

import { bizType2key } from 'config/couponsConfig';
import { formatMoneyShow } from 'config/showMoneyConfig';

import WinningsTips from 'components/popDialog/winnings';
import GiftsTips from 'components/popDialog/gifts';

import dialog from 'components/dialog';
import Congratulation from 'components/cash-gift-pop';
import BingoWin from 'components/popDialog/pagelet/bingo-win.vue';

let popDialog = null;

let showWinningId = '',
	pushTypes = [],
	winningInfo,
	isBingo;

const gifts = [];

function sub() {
	if (window.loginStatus) {
		// 注意这个userId的准确性
		userPush.config.accountId = cookie('userId') || '';
		userPush.sub({
			topic: 'personal_topic',
			pushType: 'MULTI',
			listener: data => {
				window.__debug__ && console.log('personal_topic:   ', data);
				clearPushData(data);
			}
		});
	}
}

function subBingoWin() {
	if (window.loginStatus) {
		// console.log('bingo');
		// 注意这个userId的准确性
		userPush.config.accountId = cookie('userId') || '';
		userPush.sub({
			topic: 'bingowin_award_topic',
			pushType: 'MULTI',
			listener: data => {
				window.__debug__ && console.log('personal_topic:   ', data);
				// console.log('bingo:   ', data);
				isBingo = true;
				clearPushData(data);
			}
		});
	}
}

function clearPushData(info = {}) {
	if (!info) {
		return;
	}
	const data = JSON.parse(info);
	const orderInfo = data.data || null;
	if (orderInfo) {
		if (pushTypes.includes('winning') && !isBingo && !showWinningId && data.type === 'recent_winning_order') {
			orderInfo.sportType = bizType2key[orderInfo.bizType];
			orderInfo.showWinnings = orderInfo.totalWinnings && formatNumber(+orderInfo.totalWinnings, 2);
			winningInfo = orderInfo;
			showWinningId = winningInfo.shortId || winningInfo.orderId;
			showDialog();
			return;
		}

		if (pushTypes.includes('winning') && !showWinningId && isBingo) {
			orderInfo.sportType = bizType2key[orderInfo.bizType];
			orderInfo.showWinnings = orderInfo.longTotalWinnings && formatNumber(+orderInfo.longTotalWinnings / 10000, 2); // bingo
			winningInfo = orderInfo;
			showWinningId = winningInfo.shortId || winningInfo.orderId;
			isBingo = false;
			showBingoDialog(orderInfo);
			return;
		}
		if (pushTypes.includes('gifts') && data.type === 'GiftUsablePush') {
			const amount = +orderInfo.amount || 0;
			orderInfo.amount = formatMoneyShow(amount / 10000, false);
			if (orderInfo.leastOrderAmount) {
				orderInfo.leastOrderAmount /= 10000;
				orderInfo.showCondition = formatMoneyShow(orderInfo.leastOrderAmount, false);
			}
			gifts.push(orderInfo);
			showDialog();
		}
	}
}

function showDialog() {
	// 优惠券消息优先级低于中奖提示
	if (showWinningId) {
		showWinningsPop();
		return;
	}

	if (gifts.length) {
		gifts.sort((a, b) => b.amount - a.amount);

		const showGift = gifts[0];
		// showGift.amount = formatNumber(showGift.amount, 2);
		showGift.isLapse = showGift.kind === 1;
		showGiftPop(showGift);
	}
}
function showBingoDialog(data) {
	dialog();
	popDialog = dialog({
		title: null,
		'class': 'bingo-winnings-pop',
		contentData: data,
		content: BingoWin,
		button: []
	}).onBtnClick(btnType => {
		popDialog && popDialog.close();
		popDialog = null;
		winningInfo = null;
		showWinningId = '';
		return false;
	});
}

function showGiftPop(showGift) {
	if (showGift) {
		if (showGift.from === 1) {
			showExtraGiftDialog(showGift);
		} else {
			// 显示弹窗
			dialog();
			popDialog = dialog({
				title: null,
				'class': 'm-gift-pop',
				contentData: showGift,
				content: GiftsTips,
				button: []
			}).onBtnClick(btnType => {
				popDialog && popDialog.close();
				popDialog = null;
				gifts.splice(0);
				return false;
			});
		}
	}
}

function showWinningsPop() {
	// 显示弹窗
	dialog();
	popDialog = dialog({
		title: null,
		'class': 'm-winnings-pop',
		contentData: winningInfo,
		content: WinningsTips,
		button: []
	}).onBtnClick(btnType => {
		popDialog && popDialog.close();
		popDialog = null;
		winningInfo = null;
		showWinningId = '';

		showDialog();
		return false;
	});
}

function showExtraGiftDialog(giftData) {
	dialog();

	const dlg = dialog({
		css: 'm-deposit-con-dialog',
		content: Congratulation,
		contentData: giftData,
		button: []
	});
	dlg.onBtnClick(ret => {
		// if (ret === 1) {
		// 	window.location.href = giftData.linkUrl;
		// }
	});
}

export function userPushInit(type = 'all') { //eslint-disable-line
	pushTypes = type === 'all' ? ['winning', 'gifts'] : [type];

	if (window.loginStatus) {
		sub(type);
		subBingoWin(type);
	}

	EventBus.$on(commonEvent.UPDATE_LOGIN_STATUS, () => {
		if (window.loginStatus) {
			sub(type);
			subBingoWin(type);
		}
	});
}

// bingo
/* const testData = JSON.stringify({
	data: {
		bizType: 1,
		goodsId: '180730090551god85041152',
		longTotalWinnings: 100000,
		orderId: '180802014927ord86509747',
		roundId: '180802013000rnd86502721',
		roundNo: '180802013000169'
	},
	type: 'recent_winning_order'
});
setTimeout(() => {
	isBingo = true;
	pushTypes = ['winning', 'gifts'];
	clearPushData(testData);
}, 500);*/

/* onst testData = JSON.stringify({
	data: {
		bizType: 1,
		orderId: '180829074516ord18642440',
	},
	type: 'recent_winning_order'
});
setTimeout(() => {
	isBingo = false;
	pushTypes = ['winning', 'gifts'];
	clearPushData(testData);
}, 500);*/

// gifts
/* const testData = JSON.stringify({
	type: 'GiftUsablePush',
	data: {
		amount: 100000,
		leastOrderAmount: 1000000,
		kind: 2,
		activityName: '测试gift pop dialog',
		isMultiple: false,
		from: 0,  // 充值 奖励的红包
		currency: 'KES',
		title: 'Surprise Gift',
		srcCtt: 'Gift Resource text here.Gift Resource text here.Gift Resource text here.Gift Resource text here.'
	},
});
setTimeout(() => {
	pushTypes = ['gifts'];
	clearPushData(testData);
}, 500); */
