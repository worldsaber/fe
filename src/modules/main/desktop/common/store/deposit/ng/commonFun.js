import { userCenterConfig } from 'config/order/userCenterConfig';

const payChannelMap = {
	phone: 1,
	card: 20,
	bank: 21,
};

export function getPayChannel(type, isNew) {
	return isNew ? payChannelMap[type || 'card'] : 1;
}

export const commonTips = {
	type: 'dialog',
	title: 'Something Wrong',
	showIcon: true,
	msg: 'Sorry, your payment request has a problem. Please try using a different card or a card from a different bank. Thank you.'
};

export const defaultError = 'We are unable to accept your payment at this time. Please check your payment information and try again later.';

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
			msg: 'Your deposit request has been submitted. It is now waiting for confirmation. You can check the deposit records in a short while.'
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
			title: 'Failed to Deposit',
			msg: message || defaultError
		};
	case 87: {
		const jumpUrl = data.jumpUrl;

		if (jumpUrl) {
			return {
				type: 'jmp',
				jumpUrl
			};
		}
		return commonTips;
	}
	case 89:
		return commonTips;
	default:
		return commonTips;
	}
}

export function getVerityType(code) {
	switch (code) {
	case 11:
		return 'holding';
	case 76:
		return 'dialOtp';
	case 81:
		return 'getCode';
	case 82:
		return 'sms';
	case 83:
		return 'pin';
	case 84:
		return 'opt';
	case 85:
		return 'phone';
	case 86:
		return 'birthday';
	case 88:
		return 'secondOtp';
	default:
		return '';
	}
}

const verityTypeMaps = {
	getCode: 1,
	sms: 2,
	pin: 3,
	opt: 4,
	phone: 5,
	birthday: 6,
	bank: 7,
	account: 4,
	secondOtp: 8,
	dialOtp: 9,
	holding: 11
};

export function getVerifyCode(type) {
	return verityTypeMaps[type] || '';
}
