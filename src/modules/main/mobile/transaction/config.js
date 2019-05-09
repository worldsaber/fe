export const monthObj = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export const typeList = [
	{ name: 'All Categories', value: '0' },
	{ name: 'Deposits', value: '1' },
	{ name: 'Withdrawals', value: '2' },
	{ name: 'Bets', value: '3' },
	{ name: 'Winnings', value: '4' },
	{ name: 'Shop', value: '7' },
	{ name: 'Refunds', value: '5' }
];

export const bizTypeMap = {
	1: 'Sports',
	2: 'Virtual',
	3: 'Jackpot',
	4: 'Bingo',
	5: 'Roulette'
};

export const statusMap = {
	10: 'Pending',
	20: 'Succeed',
	30: 'Failed',
	90: 'Closed'
};

export const pendingMap = {
	10: 'Pending',
	11: 'Withdrawals Blocked',
	12: 'Pending Verification',
	13: 'Verification Failed'
};
