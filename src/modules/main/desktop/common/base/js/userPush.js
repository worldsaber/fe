import userPush from 'push/userPush';
import { cookie } from 'storage';
import { formatNumber } from 'utils';

import { EventBus } from 'kernel/js/eventBus.js';
import commonEvent from 'config/eventConfig/commonEvent';

import { bizType2key } from 'config/couponsConfig';

import WinningsTips from 'components/popDialog/winnings';
import GiftsTips from 'components/popDialog/gifts';

import dialog from 'components/dialog';
import Congratulation from 'components/cash-gift-pop';

import { formatMoneyShow } from 'config/showMoneyConfig';

let popDialog = null;

let showWinningId = '',
	pushTypes = [],
	winningInfo;

const gifts = [];

function sub() {
	if (window.loginStatus) {
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

/**
 * gift消息规范 地址 - info数据格式说明
 * https://note.youdao.com/group/#/47583200/(full:md/175317592)?gid=47583200
 */

function clearPushData(info = {}) {
	if (!info) {
		return;
	}

	const data = JSON.parse(info);

	const orderInfo = data.data || null;

	if (orderInfo) {
		if (pushTypes.includes('winning') && !showWinningId && data.type === 'recent_winning_order') {
			orderInfo.sportType = bizType2key[orderInfo.bizType];
			orderInfo.showWinnings = orderInfo.totalWinnings && formatNumber(+orderInfo.totalWinnings, 2);
			winningInfo = orderInfo;
			showWinningId = winningInfo.shortId;

			showDialog();
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
		showGift.isLapse = showGift.kind === 1;
		showGiftPop(showGift);
	}
}

function showGiftPop(showGift) {
	if (showGift) {
		if (showGift.from === 1) {
			showExtraGiftDialog(showGift);
		} else {
			// 显示弹窗
			dialog();

			popDialog = dialog({
				css: 'm-gift-con-dialog',
				title: null,
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
	dialog(); //  关闭其他弹框

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
export function userPushInit(type = 'all') {
	pushTypes = type === 'all' ? ['winning', 'gifts'] : [type];

	if (window.loginStatus) {
		sub(type);
	}

	EventBus.$on(commonEvent.UPDATE_LOGIN_STATUS, () => {
		if (window.loginStatus) {
			sub(type);
		}
	});
}

export default {};

/*
* 测试代码， 模拟数据，用来手动唤起弹框
*/

// gift

/* const testData = JSON.stringify({
	type: 'GiftUsablePush',
	data: {
		currency: 'KES',
		amount: 100000,
		leastOrderAmount: 1000000,
		kind: 1,
		activityName: '测试gift pop dialog',
		isMultiple: false,
		from: 0,
		title: 'Surprise Gift',
		srcCtt: 'Gift Resource text here.Gift Resource text here.Gift Resource text here.Gift Resource text here.'
	},
});
setTimeout(() => {
	pushTypes = ['gifts'];
	clearPushData(testData);
}, 500); */
