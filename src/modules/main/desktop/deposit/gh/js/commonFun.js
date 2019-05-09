import { formatNumber } from 'utils';
import { getShowCurrency } from 'config/currencyConfig';

import { despositMax, despositThreshold, despositMin } from './config';

export function modifyMoney(money) {
	let ret;

	ret = ('' + money).replace(/[^0-9.]/g, '');

	ret = ret.split('.');

	(ret[0] === '') && (ret[0] = 0);

	ret[1] && (ret[1] = ret[1].slice(0, 2));

	return ret.length > 1 ? `${+ret[0]}.${ret[1]}` : ret[0];
}

export function validateAmount(data, validateMin = true) {
	data = data && data.replace(/\s/g, '');

	if (validateMin && (!data || +data < despositMin)) {
		return `Please enter a value no less than ${getShowCurrency()}${despositMin}.`;
	}

	if (+data >= despositThreshold) {
		return `Maximum per transaction is ${getShowCurrency()}${formatNumber(despositMax, 0)}.`;
	}
}

export function validateVCode(code) {
	if (!code || code.length !== 6) {
		return 'Please enter a valid Voucher Code.';
	}
}

export function validatePhone(phone) {
	if (!phone) {
		return 'Please enter a mobile number';
	}
}

export function modifyPhone(phone = '') {
	let temp = phone;

	if (temp) {
		temp = `${temp.slice(0, 2)}****${temp.substr(temp.length - 3, 3)}`;
	}
	return temp;
}

export function validateBankUnion(opt = {}) {
	const { phoneNo = '', token = '', needVCode = false, payAmount, isHistoryPhone = false } = opt;
	let ret = '';

	if (needVCode) {
		ret = validateVCode(token);

		if (ret) {
			return {
				vCodeRet: ret
			};
		}
	}

	if (!isHistoryPhone) {
		ret = validatePhone(phoneNo) || '';

		if (ret) {
			return {
				phoneRet: ret
			};
		}
	}

	ret = validateAmount(payAmount) || '';
	if (ret) {
		return {
			amountRet: ret
		};
	}
}
