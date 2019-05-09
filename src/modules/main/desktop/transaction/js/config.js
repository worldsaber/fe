export const config = {
	ke: {
		desc: 'Please enter the Transaction Code which M-pesa sent to your Mobile Phone via SMS, e.g. MDI3WSXXXX.',
		ruleTitle: 'Manual Reconciliation is to be used in situations such as:',
		rules: [
			'(a) Deposit is displayed as "Failed";',
			'(b) Deposit is displayed as "Pending";',
			'(c) M-Pesa Paybill was used to Deposit, but no records exist;'
		],
		info: 'In all of these situations, you might still have received an SMS from M-Pesa Paybill informing that this transaction was successful.'
	},
	gh: {
		desc: 'Please enter the Transaction Code which Operators sent to your Mobile Phone via SMS',
		ruleTitle: 'Manual Reconciliation is to be used in situations such as:',
		rules: [
			'(a) Deposit is displayed as "Failed";',
			'(b) Deposit is displayed as "Pending";',
			'(c) Paybill was used to Deposit, but no records exist;'
		],
		info: 'In all of these situations, you might still have received an SMS from Operators informing that this transaction was successful.'
	}
};

export const supportManunalCountry = Object.keys(config);

const country = window.country || 'ke';

export function getManualConfig () {
	return config[country] || null;
}

export function supportManual () {
	return supportManunalCountry.indexOf(country) !== -1;
}

export const bizTypeMap = {
	1: 'Sports',
	2: 'Virtual',
	3: 'Jackpot',
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
export const typeList = [
	{ name: 'All Categories', value: '0' },
	{ name: 'Deposits', value: '1' },
	{ name: 'Withdrawals', value: '2' },
	{ name: 'Bets', value: '3' },
	{ name: 'Winnings', value: '4' },
	{ name: 'Shop', value: '7' },
	{ name: 'Refunds', value: '5' }
];
export const types = (() => {
	const ret = [];

	for (const item of typeList) {
		ret.push(item.name);
	}

	return ret;
})();
