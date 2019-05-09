import { formatNumber } from 'utils';
import { getShowCurrency } from 'config/currencyConfig';
import { wdMin, wdThreshold, wdMax, fee, feeThreshold } from 'store/withdraw/ng/config';

export {
	wdMin,
	wdThreshold,
	wdMax,
	feeThreshold,
	fee
};

export const withdrawTips = [
	'Banks accepted: Access Bank, Citibank Nigeria, Diamond Bank, Ecobank Nigeria, Enterprise Bank, Fidelity Bank, First Bank of Nigeria, First City Monument Bank, Guaranty Trust Bank, Heritage Bank, Keystone Bank, MainStreet Bank, Skye Bank, Stanbic IBTC Bank, Standard Chartered Bank, Sterling Bank, Union Bank of Nigeria, United Bank For Africa, Unity Bank, Wema Bank, Zenith Bank, and etc.',
	// `Minimum withdraw amount is ${getShowCurrency()}${formatNumber(wdMin, 2)} - you can withdraw at least ${getShowCurrency()}${formatNumber(wdMin, 2)} in one transaction.`,
	`An additional Carrier Fee of ${getShowCurrency()}${formatNumber(fee, 2)} will be applied when withdraw less than ${getShowCurrency()}${formatNumber(feeThreshold, 2)}.`,
	`Maximum per transaction is ${getShowCurrency()}${formatNumber(wdMax, 2)} - you can withdraw up to ${getShowCurrency()}${formatNumber(wdMax, 2)} in one transaction.`,
	'We do not share your payment information. It is used for transaction verification only.'
];

export const delBankTips = 'Are you sure you want to delete this bank account?';
