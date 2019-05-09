import { formatNumber } from 'utils';
import dateFormat from 'kernel/js/dateFormat';
import { getShowCurrency } from 'config/currencyConfig';

import { despositMax, despositThreshold, despositMin } from './config';

export function modifyDate(date) {
	date = date.replace(/\D/g, '');

	if (!date) {
		return '';
	}

	// 首尾大于2自动补齐0和/ 或者前两位大于12
	if (date[0] > 1 || +date.slice(0, 2) > 12) {
		return `0${date[0]}/${date.substr(1, 2)}`;
	}

	if (date.length >= 3) {
		return `${date.substr(0, 2)}/${date.substr(2, 2)}`;
	}

	return date;
}

export function modifyMoney(money) {
	let ret;

	ret = ('' + money).replace(/[^0-9.]/g, '');

	ret = ret.split('.');

	(ret[0] === '') && (ret[0] = 0);

	return ret.length > 1 ? `${+ret[0]}.${ret[1]}` : ret[0];
}

export function modifyCardNum(value) {
	const v = ('' + value).replace(/\s+/g, '').replace(/[^0-9]/gi, '');
	const matches = v.match(/\d{4,}/g);
	const match = matches && matches[0] || '';
	const parts = [];

	for (let i = 0, len = match.length; i < len; i += 4) {
		parts.push(match.substring(i, i + 4));
	}
	if (parts.length) {
		return parts.join(' ');
	}

	return value;
}

export function validateAmount(data, validateMin = true) {
	data = data && data.replace(/\s/g, '');

	if (/[^0-9]/.test(data)) {
		return 'Please enter a valid interger.';
	}

	if (validateMin && (!data || +data < despositMin)) {
		return `Please enter a value no less than ${getShowCurrency()}${despositMin}.`;
	}

	if (+data >= despositThreshold) {
		return `Maximum per transaction is ${getShowCurrency()}${formatNumber(despositMax, 0)}.`;
	}
}

export function validateDate(date) {
	date = date && date.replace(/\s/g, '');

	if (!date) {
		return 'Please enter the Expiry.';
	}

	const currentDate = new Date(),
		current = dateFormat.format(currentDate, 'YYMM');

	if (+current > +date) {
		return 'Invalid Expiry.';
	}
}

export function validateCard(card) {
	card = card && card.replace(/\s/g, '');

	if (!card) {
		return 'Please enter a card number.';
	}
}

export function validateCvv(cvv) {
	cvv = cvv && cvv.replace(/\s/g, '');

	if (!cvv) {
		return 'Please enter the CVV code.';
	}

	if (cvv.length < 3) {
		return 'Please enter a valid CVV code.';
	}
}

// 转换expire的提交格式
export function formatDate(date) {
	const dateArr = date.split('/');
	return dateArr.length === 1 ? dateArr[0] : `${dateArr[1]}${dateArr[0]}`;
}

export function validateBankNum(bankNum) {
	bankNum = bankNum && bankNum.replace(/\s/g, '');

	if (!bankNum) {
		return 'Please enter an account number.';
	}

	if (bankNum.length < 10) {
		return 'Invalid account number.';
	}
}

export function validateBankCode(bankCode) {
	if (!bankCode) {
		return 'Please select a bank.';
	}
}

export function validateCardUnion(opt = {}) {
	const { card = '', date = '', cvv, amount, isNew = false } = opt;
	let ret = '';

	if (isNew) {
		ret = validateCard(card) || '';
		if (ret) {
			return {
				cardRet: ret
			};
		}

		ret = validateDate(date) || '';
		if (ret) {
			return {
				dateRet: ret
			};
		}
	}

	ret = validateCvv(cvv) || '';
	if (ret) {
		return {
			cvvRet: ret
		};
	}

	ret = validateAmount(amount) || '';
	if (ret) {
		return {
			amountRet: ret
		};
	}
}

export function validateBankUnion(opt = {}) {
	const { bankCode = '', bankNum = '', amount, isNew = false } = opt;
	let ret = '';

	if (isNew) {
		ret = validateBankCode(bankCode) || '';
		if (ret) {
			return {
				bankCodeRet: ret
			};
		}

		ret = validateBankNum(bankNum) || '';
		if (ret) {
			return {
				bankRet: ret
			};
		}
	}

	ret = validateAmount(amount) || '';
	if (ret) {
		return {
			amountRet: ret
		};
	}
}
