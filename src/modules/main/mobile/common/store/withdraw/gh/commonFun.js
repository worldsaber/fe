import { userCenterUrl } from 'config/mycenter/dataConfig.js';
import { formatNumber } from 'utils';
import { showCurrency } from 'config/currencyConfig';
import { withdrawContactPhone, wdMax } from './config';

const defaultError = 'Sorry, your payment request has a problem. Please try using other options. Thank you.';

export const commonTips = {
	type: 'dialog',
	refresh: true,
	title: 'Error during transaction',
	msg: defaultError
};

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
			jmp: userCenterUrl.transaction,
			msg: 'Your withdrawal request has been submitted, awaiting for confirmation. You can check the withdrawal records in a short while.'
		};
	case 72:
		return {
			type: 'dialog',
			title: 'Pending Request',
			jmp: userCenterUrl.transaction,
			msg: message || defaultError
		};
	case 30:
		return {
			type: 'dialog',
			refresh: true,
			title: 'Error during transaction',
			msg: message || defaultError
		};
	default:
		return commonTips;
	}
}

export function getErrorTips(retData) {
	const { bizCode, message } = retData || {};
	switch (bizCode) {
	case 61100:
		return {
			title: '',
			type: 'dialog',
			clearAmount: true,
			msg: message || 'The amount has exceeded your available balance, please check and confirm again.'
		};
	case 61200:
	case 61300:
		return {
			title: '',
			type: 'dialog',
			msg: message || 'This account has been temporarily locked for security concern. If you need any help, please contact us at: ' + withdrawContactPhone
		};
	case 62100:
		return {
			title: '',
			type: 'dialog',
			msg: message || `Maximum Daily Transaction Value is ${showCurrency}${formatNumber(wdMax, 2)}. The maximum you can send in a day is ${showCurrency}${formatNumber(wdMax, 2)}.`
		};
	case 64001:
	case 64002:
		return {
			type: 'dialog',
			refresh: true,
			title: 'Error during transaction',
			msg: 'Your withdrawal request has been submitted, awaiting for confirmation. You can check the withdrawal records in a short while.'
		};
	default: {
		const temp = message ?
			Object.assign(commonTips, {
				msg: message
			}) :
			commonTips;

		return temp;
	}
	}
}
