import { userCenterUrl } from 'config/mycenter/dataConfig.js';

export const defaultError = 'Sorry, your payment request has a problem. Please try using other options. Thank you.';

export const commonTips = {
	type: 'dialog',
	title: 'Error during transaction',
	showIcon: true,
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
			msg: 'Your deposit request has been submitted, awaiting for confirmation. You can check the deposit records in a short while.'
		};
	case 30:
		return {
			type: 'dialog',
			showIcon: true,
			title: 'Error during transaction',
			msg: message || defaultError
		};
	default:
		return commonTips;
	}
}
