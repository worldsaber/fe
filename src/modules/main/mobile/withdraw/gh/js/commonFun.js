import { formatNumber, objType } from 'utils';
import { showCurrency } from 'config/currencyConfig';
import { cookie } from 'storage';

import { wdMax, wdThreshold, wdMin } from './config';

export function modifyMoney(money) {
	let ret;

	ret = ('' + money).replace(/[^0-9.]/g, '');

	ret = ret.split('.');

	(ret[0] === '') && (ret[0] = 0);

	ret[1] && (ret[1] = ret[1].slice(0, 2));

	return ret.length > 1 ? `${+ret[0]}.${ret[1]}` : ret[0];
}

export function validateAmount(data, balance, validateMin = true) {
	data = data && data.replace(/\s/g, '');

	if (validateMin && (!data || +data < wdMin)) {
		return `Please enter a value no less than ${showCurrency}${wdMin}.`;
	}

	if (objType(balance) !== 'undefined' && data && +data > balance) {
		return 'The amount has exceeded your available balance, please check and confirm again.';
	}

	if (+data >= wdThreshold) {
		return `Maximum per transaction is ${showCurrency}${formatNumber(wdMax, 0)}.`;
	}
}

export function validateName(name = '') {
	if (!name) {
		return 'Please enter a Full Name';
	}
}

export function modifyName(name = '') {
	name = name.replace(/^\s+/, '');

	return name.length > 27 ? name.slice(0, 27) : name;
}

export function modifyPhone() {
	const phone = cookie('phone') || '';
	if (phone) {
		return `${phone.slice(0, 2)}****${phone.substr(phone.length - 3, 3)}`;
	}
	return '';
}

export function formatName(name = '') {
	if (name) {
		name = `${name.slice(0, Math.min(Math.floor(name.length / 2), 10))}****`;
	}

	return name;
}

export function validateBankUnion(opt = {}, balance) {
	const { payAmount } = opt;
	let ret = '';

	// if (!isHistoryPhone) {
	// 	ret = validateName(name);
	//
	// 	if (ret) {
	// 		return {
	// 			nameRet: ret
	// 		};
	// 	}
	// }

	ret = validateAmount(payAmount, balance, true) || '';
	if (ret) {
		return {
			amountRet: ret
		};
	}
}
