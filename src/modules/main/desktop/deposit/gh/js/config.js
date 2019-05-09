import { formatNumber } from 'utils';
import { getShowCurrency } from 'config/currencyConfig';

import { despositMin, despositThreshold, despositMax } from 'store/deposit/gh/config';

export const depositType = [{
	name: 'Online Deposit',
	key: 'online'
}, {
	name: 'Paybill',
	key: 'paybill'
}];

export {
	despositMin,
	despositThreshold,
	despositMax
};

export const dpTips = [
	`Maximum per transaction is ${getShowCurrency()}${formatNumber(despositMax, 2)}.`,
	`Minimum per transaction is ${getShowCurrency()}${formatNumber(despositMin, 2)}.`,
	'Deposit is free, no transaction fees.',
	'Your balance can only be withdrawn to the mobile number that you registered with.'
];

export const billRulers = [
	{
		title: 'MTN Mobile Money',
		desc: [
			'Dial *711*222# From your MTN mobile phone.',
			'Provide the amount you wish to deposit.',
			'Wait for a confirmation message from MTN Mobile Money, then validate the transaction by typing your PIN.',
			'Your account will be top up immediately.'
		]
	},
	{
		title: 'Tigo Cash',
		desc: [
			'Dial *711*222# From your Tigo mobile phone.',
			'Provide the amount you wish to deposit.',
			'Wait for a confirmation message from Tigo Cash, then validate the transaction by typing your PIN.',
			'Your account will be top up immediately.'
		]
	},
	{
		title: 'Vodafone Cash',
		desc: [
			'Dial *100# from your Vodafone mobile number.',
			'Choose option 6 (Generate Voucher)',
			'Wait for a Text message from Vodafone with a voucher code valid for 5 minutes only',
			'Note down the code',
			'Dail *711*222# from your Vodafone mobile number (P.S: The same number should be registered under your SportyBet account)',
			'Provide an amount you with to top up with (e.g 10.00)',
			'Type the 6 digits voucher code(Token)which you have received from Vodafone',
			'Wait for a confirmation message from Vodafone Cash, then validate the transaction by typing your PIN',
			'Your account will be top up immediately'
		]
	},
	{
		title: 'Airtel Money',
		desc: [
			'Dial *711*222# From your Airtel mobile phone.',
			'Provide the amount you wish to deposit.',
			'Wait for a confirmation message from Airtel Money, then validate the transaction by typing your PIN.',
			'Your account will be top up immediately.'
		]
	}
];

export const vCodeTips = 'Please enter your Vodafone Cash Voucher Code. Dial *110# and select option 6 to generate the code.';

export const vCodeDesc = 'Dial *110# and select option 6 to generate your  voucher code. You will receive an SMS with a 6 digit voucher code. Note that the code expires within five(5) minutes.';

export const chgPhoneTips = 'You are depositing with another mobile number. When withdrawing money, your balance can only be withdrawn to the mobile number that you registered Sportybet account with.';

// export const sysNote = 'Due to tech issues, Online Deposit may not go through. Please deposit through Paybill.';
