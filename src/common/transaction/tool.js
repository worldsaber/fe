/**
 * DP0001 - Depeposit
 * WD0001 - Withdraw
 * WD0002 - Partner Withdraw
 * WD0003 - Offline Withdraw
 * TF0005 - Partner to Customer Transfer
 * TF0007 - Sporty Coins Deposit Transfer
 * PB0001 - Place Bet
 * CB0001 - Settle Bet
 * CB0002 - Cashout
 * CB0003 - Offline Clear
 * CB0004 - Large Clear
 * CB0005 - Rollback Clear
 * CB0006 - Rollback Compensation
 * RF0001 - Refund Bank
 * RF0002 - Refund Bet
 * RF0003 - Refund Gift
 * AD0001 - Adjust in
 * AD0002 - Adjust out
 * SR0001 - Share revenue
 * RB0001 - REWARD_BOUNTY
 * PC0001 - Shop
*/
const bizTypeMap = {
	1: 'Sports',
	2: 'Virtual',
	3: 'Jackpot',
	4: 'Bingo',
	5: 'Roulette',
	11: 'Dice Battle',
	12: 'Lucky Poker'
};

export function isDeposit(code) {
	return ['DP0001', 'AD0001', 'TF0005', 'TF0007', 'RB0001'].includes(code);
}
export function isWithdraw(code) {
	return /^WD/.test(code) || ['AD0002', 'FE0001'].includes(code);
}
export function isWithdrawTo(code) {
	return ['FE0001', 'WD0001', 'WD0003'].includes(code);
}
export function isWithdrawFrom(code) {
	return ['AD0002', 'WD0004'].includes(code);
}
export function isRefund(code) {
	return /^RF/.test(code) || [].includes(code);
}
export function isWinning(code) {
	return /^CB/.test(code) || [].includes(code);
}
export function isBet(code) {
	return ['PB0001'].includes(code);
}
export function isTransfer(code) {
	return /^TF/.test(code) || ['AD0001', 'AD0002', 'RB0001', 'WD0004'].includes(code);
}
export function isShop(code) {
	return ['PC0001'].includes(code);
}
export function getTypeLabel(code) {
	let label = '';
	if (isDeposit(code)) {
		label = 'Deposit From';
	}
	if (isWithdrawTo(code)) {
		label = 'Withdraw To';
	}
	if (isWithdrawFrom(code)) {
		label = 'Withdraw From';
	}
	if (isWinning(code)) {
		label = 'From';
	}
	if (isRefund(code)) {
		label = 'Refund To';
	}
	return label;
}
export function getTypeValue({
	tradeCode: code,
	counterpart = '',
	counterAuthority,
	payChId,
	mobile,
	counterFull
}) {
	let value = '';
	if (isDeposit(code)) {
		// M-PESA、银行名称、卡种
		if (code === 'DP0001') {
			value = counterFull;
		// }
		// if ([10, 20, 21, 30, 31, 32, 40, 41, 50].includes(payChId)) {
		// 	value = `${counterAuthority || 'M-PESA'}(${counterpart})`;
		} else {
			if (isTransfer(code)) {
				value = 'Operator';
			}
			if (code === 'TF0005') {
				value = `Partner(${counterpart})`;
			}
			if (code === 'RB0001') { // 充值奖励
				value = 'SportyBet Exclusive Offer';
			}
			if (code === 'TF0007') {
				value = 'SportyCoins';
			}
		}
	} else if (isWinning(code)) {
		if (['CB0003'].includes(code)) {
			value = 'Offline';
		} else if (code === 'CB0005') {
			value = 'Bookmaker';
		} else if (code === 'CB0006') {
			value = 'Bookmaker (Compensation)';
		} else if (code === 'CB0007') {
			value = 'SportyBet Exclusive Offer';
		}
	} else if (isWithdraw(code)) {
		if ([10, 20, 21, 40].includes(payChId)) {
			value = `${counterAuthority || 'M-PESA'}(${counterpart})`;
		} else if (isTransfer(code)) {
			value = 'Operator';
		} else if (code === 'WD0003') {
			value = 'Offline';
		} else if (code === 'WD0004') {
			value = 'Partner';
		}
	} else if (isRefund(code)) {
		if (payChId === 0) {
			value = 'Balance';
		} else if (payChId === 10) {
			// 银行卡
			const part = counterpart || `****${mobile.slice(-4)}`;
			value = `M-PESA(${part})`;
		}
	} else if (isShop(code)) {
		value = 'Shop';
	}

	return value;
}

export function getTypeWithSub({ tradeCode: code, bizType }) {
	let type = '';
	let subType;
	if (isDeposit(code)) {
		type = 'Deposits';
		if (isTransfer(code)) {
			subType = 'Transfer';
		}
	} else if (isWithdraw(code)) {
		type = 'Withdrawals';

		if (isTransfer(code)) {
			subType = 'Transfer';
		}
		// AD0002: Adjust out 从用户账户扣除  ----AD0001: Adjust in是给用户转账加款
		if (code === 'AD0002') {
			subType = 'Transfer';
		}
		if (code === 'FE0001') {
			subType = 'Fee';
		}
	} else if (isBet(code)) {
		type = 'Bets';
		subType = bizTypeMap[bizType];
	} else if (isWinning(code)) {
		type = 'Winnings';
		subType = bizTypeMap[bizType];
		if (code === 'CB0002') {
			subType = 'Cash Out';
		} else if (['CB0005', 'CB0006'].includes(code)) {
			subType = 'Rollback';
		}
	} else if (isRefund(code)) {
		type = 'Refunds';
		if (code === 'RF0003') {
			subType = 'Gifts';
		} else {
			subType = bizTypeMap[bizType] || 'Virtual';
		}
	} else if (isShop(code)) {
		type = 'Shop';
		subType = 'Cash Gift';
	}
	// TODO: 打折红包添加子类型（Shop - Cash Gift）
	return `${type}${subType ? ` - ${subType}` : ''}`;
}

export default {
	isDeposit,
	isWithdraw,
	isRefund,
	isWinning,
	isBet,
	isTransfer,
	getTypeLabel,
	getTypeValue,
	getTypeWithSub
};
