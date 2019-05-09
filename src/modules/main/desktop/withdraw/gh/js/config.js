import { formatNumber } from 'utils';
import { getShowCurrency } from 'config/currencyConfig';

import { wdMin, wdThreshold, wdMax, fee, feeThreshold } from 'store/withdraw/gh/config';

export {
	wdMin,
	wdThreshold,
	wdMax,
	feeThreshold,
	fee
};

export const wdTips = [
	`Maximum per transaction is ${getShowCurrency()}${formatNumber(wdMax, 2)}.`,
	`Minimum per transaction is ${getShowCurrency()}${formatNumber(wdMin, 2)}.`,
	'Withdrawal is free, no transaction fees.'
];
