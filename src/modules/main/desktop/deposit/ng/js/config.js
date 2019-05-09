import { formatNumber } from 'utils';
import { getShowCurrency } from 'config/currencyConfig';

import { despositMin, despositThreshold, despositMax } from 'store/deposit/ng/config';

const verveUrl = require('../image/card-visa.png'),
	masterUrl = require('../image/card-master.png'),
	visaUrl = require('../image/card-verve.png');

export const depositType = ['Card', 'Bank', 'Quickteller', 'GT Bank'];

export const cardTypes = {
	visa: visaUrl,
	master: masterUrl,
	verve: verveUrl,
};

export const bankTypes = {
	access: '',
	diamond: '',
	fidelity: '',
	'guarantee trust': '',
	zenith: '',
};

export {
	despositMin,
	despositThreshold,
	despositMax
};

export const cvvTips = 'The CVV is the three digit security code at the back of your card.';

export const cardTips = [
	`Minimum deposit amount is ${getShowCurrency()}${formatNumber(despositMin, 2)} - you can deposit at least ${getShowCurrency()}${formatNumber(despositMin, 2)} in one transaction.`,
	`Maximum per transaction is ${getShowCurrency()}${formatNumber(despositMax, 2)} - you can deposit up to ${getShowCurrency()}${formatNumber(despositMax, 2)} in one transaction.`,
	'We do not share your payment information. It is used for transaction verification only.',
	'If you have any recharge issues, please contact customer service. Trying to use multiple cards/bank accounts for multiple deposits may cause error.'
];

export const delCardTips = 'Are you sure you want to delete this card?';

export const delBankTips = 'Are you sure you want to delete this bank account?';

export const pinTips = 'To confirm that you are the owner of this card please enter your card PIN.';
