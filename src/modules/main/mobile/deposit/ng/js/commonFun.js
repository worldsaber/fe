import {
	formatNumber
} from 'utils';
import dateFormat from 'kernel/js/dateFormat';
import { showCurrency } from 'config/currencyConfig';

const despositMin = +depositCfg.min;
const despositMax = +depositCfg.max;

const withdrawMin = +withdrawCfg.min;
const withdrawMax = +withdrawCfg.max;
const feeThreshold = +withdrawCfg.feeThreshold;
const fee = +withdrawCfg.fee;

export function formatDate(date) { // MM/YY to YYMM
	const dateArr = date.split('/');
	return dateArr.length === 1 ? dateArr[0] : `${dateArr[1]}${dateArr[0]}`;
}
export function formatDateFromApi(date) { // YYMM to MM/YY
	return date.substr(2, 2) + '/' + date.substr(0, 2);
}
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
export function modifyAmount(value, isInt) {
	const num = +value;
	return isInt ? num : num.toFixed(2);
}
export function modifyCvv(value) {
	const str = value.replace(/[^0-9]/g, '');
	if (str.length > 3) {
		return str.slice(0, 3);
	}
	return str;
}
export function clearData(type, val) {
	let temp = val;

	switch (type) {
	case 'card':
		temp && (temp = modifyCardNum(temp, 0));
		return temp;
	case 'date':
		return modifyDate(temp);
	default:
		return temp;
	}
}

export function validateAmount(data, type, isInt, validateMin, balance) {
	let min,
		max;
	if (type === 'deposit') {
		min = despositMin;
		max = despositMax;
		// threshold = despositThreshold;
	} else {
		min = withdrawMin;
		max = withdrawMax;
		// threshold = withdrawThreshold;
	}
	data = data && data.replace(/\s/g, '');
	if (!data || data.indexOf('.', data.indexOf('.') + 1) !== -1 || data === '.') {
		return 'Please enter a valid number';
	}
	if (+data < min && validateMin) {
		return `Please enter a value no less than ${showCurrency}${min}.`;
	}

	if (/[^0-9]/.test(data) && isInt) {
		return 'Please enter a valid interger.';
	}

	if (typeof balance === 'number' && +data < feeThreshold && (+data + fee) > +balance) {
		return `An additional Carrier Fee of ${showCurrency}${formatNumber(fee, 2)} will be applied when withdraw less than ${showCurrency}${formatNumber(feeThreshold, 2)}, your currently available balance is ${showCurrency}${formatNumber(balance, 2)}`;
	}

	if (typeof balance === 'number' && +data >= feeThreshold && +data > +balance) {
		return 'The amount has exceeded your sufficient balance, please try a smaller amount.';
	}

	if (+data > max) {
		return `Maximum per transaction is ${showCurrency}${formatNumber(max, 0)}`;
	}
}

export function validateDate(date) { // date需要YYMM
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

export function validateBank(code) {
	code = code && code.replace(/\s/g, '');

	if (!code) {
		return 'Please select a bank';
	}
}

export function validateAccount(account) {
	account = account && account.replace(/\s/g, '');

	if (!account) {
		return 'Please enter an account number.';
	}

	if (account.indexOf('*') < 0 && account.length !== 10) {
		return 'Invalid account number.';
	}
}

export function validatePhone(phone = '') {
	phone = phone && phone.replace(/\s/g, '');

	if (!phone) {
		return 'Please enter a phone number.';
	}

// 	if (phone.indexOf('*') < 0 && phone.length !== 10) {
// 		return 'Invalid phone number.';
// 	}
}
