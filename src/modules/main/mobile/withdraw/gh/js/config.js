import { formatNumber } from 'utils';
import { showCurrency } from 'config/currencyConfig';

import { wdMin, wdThreshold, wdMax, fee, feeThreshold } from 'store/withdraw/gh/config';

export {
	wdMin,
	wdThreshold,
	wdMax,
	feeThreshold,
	fee
};

export const wdTips = [
	`Maximum per transaction is ${showCurrency}${formatNumber(wdMax, 2)}.`,
	`Minimum per transaction is ${showCurrency}${formatNumber(wdMin, 2)}.`,
	'Withdrawal is free, no transaction fees.'
];
