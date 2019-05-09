import { userCenterConfig } from 'config/order/userCenterConfig';
import { formatNumber } from 'utils';
import { getShowCurrency } from 'config/currencyConfig';
import { withdrawContactPhone, wdMax } from './config';

const payChannelMap = {
	phone: 1,
	card: 20,
	bank: 21,
};

const showCurrency = getShowCurrency();

export function getPayChannel(type, isNew) {
	return isNew ? payChannelMap[type || 'bank'] : 1;
}

export const commonTips = {
	type: 'dialog',
	title: 'Something Wrong',
	showIcon: true,
	msg: 'Sorry, your payment request has a problem. Please try using a different card or a card from a different bank. Thank you.'
};

const defaultError = 'We are unable to accept your payment at this time. Please check your payment information and try again later.';

export const commonError = 'No internet connection, try again.';

export function getDpReqTips(reqRet) {
	const { data, message } = reqRet;
	const code = data.status;

	switch (code) {
	case 10:
		return {
			type: 'dialog',
			title: 'Pending Request',
			showIcon: true,
			jmp: userCenterConfig.Transactions,
			msg: 'Your withdrawal request has been submitted. It is now waiting for confirmation. You can check the withdraw records in a short while.'
		};
	case 72:
		return {
			type: 'dialog',
			title: 'Pending Request',
			showIcon: true,
			jmp: userCenterConfig.Transactions,
			msg: message || defaultError
		};
	case 30:
		return {
			type: 'dialog',
			showIcon: true,
			title: 'Failed to withdraw',
			msg: message || defaultError
		};
	// case 87: {
	// 	const jumpUrl = data.jumpUrl;
	//
	// 	if (jumpUrl) {
	// 		return {
	// 			type: 'jmp',
	// 			jumpUrl
	// 		};
	// 	}
	// 	return commonTips;
	// }
	case 89:
		return commonTips;
	default:
		return commonTips;
	}
}

export function getVerityType(code) {
	switch (code) {
	case 81:
		return 'getCode';
	case 82:
		return 'sms';
	case 83:
		return 'pin';
	case 84:
		return 'opt';
	case 88:
		return 'account';
	case 85:
		return 'phone';
	case 86:
		return 'birthday';
	default:
		return '';
	}
}

const verityTypeMaps = {
	code: 1,
	sms: 2,
	pin: 3,
	opt: 4,
	phone: 5,
	birthday: 6,
	bank: 7,
	account: 4
};

export function getVerifyCode(type) {
	return verityTypeMaps[type] || '';
}

export function getErrorTips(retData) {
	const { bizCode, message } = retData || {};
	switch (bizCode) {
	case 61100:
		return message || 'The amount has exceeded your available balance, please check and confirm again.';
	case 61300:
		return message || 'This account has been temporarily locked for security concern. If you need any help, please contact us at: ' + withdrawContactPhone;
	case 62100:
		return message || `Maximum Daily Transaction Value is ${showCurrency}${formatNumber(wdMax, 2)}. The maximum you can send in a day is ${showCurrency}${formatNumber(wdMax, 2)}.`;
	case 64001:
	case 64002:
		return 'Your withdrawal request has been submitted, awaiting for confirmation. You can check the withdrawal records in a short while.';
	default:
		return message;
	}
}
