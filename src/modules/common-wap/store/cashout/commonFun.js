import { formatNumber } from 'utils';

/*
错误消息显示形式
type：
	inline： 在页面其他位置显示错误消息
	dialog： 弹窗提示错误消息
 */
/**
 * 目前只用了dialog模式
 * cashout调用返回值解析
 * @param {*} code
 */
export function handleErrorInfo(code) {
	/*
	提示，确定后移除的情况
	33001： 结算中结算中
	33003： 全部cashout
	 */
	if (code === 33001) {
		return {
			type: 'dialog',
			hideLiveNow: true,
			msg: 'This match is no longer available for Cashout'
		};
	}

	if (code === 33003) {
		return {
			type: 'dialog',
			hideLiveNow: true,
			msg: 'This bet is no longer available for Cashout'
		};
	}

	/*
	暂时不能cashout，
	33004：暂时不能cashout
	 */
	if (code === 33004) {
		return {
			type: 'dialog',
			msg: 'Cashout unavailable, please refresh.'
		};
	}
}

export function clearBetData(betData, selections = []) {
	// 是否有过partial cashout
	betData.hasCashouted = !!(betData.originStake - betData.stake);

	// betData.originStake && (betData.originStake = formatNumber(betData.originStake, 2));
	betData.stake && (betData.showStake = formatNumber(betData.stake, 2));
	betData.winnings && (betData.winnings = formatNumber(betData.winnings, 2));

	// cashout记录中，如果是0则不显示，如果非0格式化显示
	betData.bonus = +betData.bonus;
	if (betData.bonus > 0) {
		betData.bonus = formatNumber(betData.bonus, 2);
	}
	betData.showPotWinnings = calPotWin(betData.potentialWinnings, betData.stake, betData.originStake);
	betData.showBetType = `${betData.orderType}${betData.betType ? '-' + betData.betType : ''}${betData.combinationNum ? '(x' + betData.combinationNum + ')' : ''}`;

	const selectionLen = selections.length;
	if (selectionLen === 4) {
		betData.showMores = 'and 1 other match';
	}

	if (selectionLen > 4) {
		betData.showMores = `and ${selectionLen - 3} other matches`;
	}

	let hasLive = false;
	for (const selection of selections) {
		if (!hasLive && [1, 2].includes(+selection.eventStatus)) {
			hasLive = true;
		}
	}

	betData.hasLive = hasLive;

	return betData;
}

export function calPotWin(potWin, stake, originStake) {
	if (potWin && originStake) {
		return formatNumber(potWin * stake / originStake, 2);
	}
	return '';
}
