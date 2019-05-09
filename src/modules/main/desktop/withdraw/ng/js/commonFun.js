import { formatNumber } from 'utils';
import { getShowCurrency } from 'config/currencyConfig';
import { wdThreshold, wdMin, wdMax, fee, feeThreshold } from './config';

// amount可以是小数，最多两位小数
export function modifyMoney(money) {
	let ret;

	ret = ('' + money).replace(/[^0-9.]/g, '');

	ret = ret.split('.');

	(ret[0] === '') && (ret[0] = 0);

	return ret.length > 1 ? `${+ret[0]}.${ret[1].substr(0, 2)}` : ret[0];
}

export function validateAmount(data, balance, validateMin = true) {
	data = data && data.replace(/\s/g, '');

	if (/[^0-9]/.test(data)) {
		return 'Please enter a valid interger.';
	}

	if (validateMin && (!data || +data < wdMin)) {
		return `Minimum withdrawal amount is ${getShowCurrency()}${wdMin}.`;
	}

	if (typeof balance === 'number' && +data < feeThreshold && (+data + fee) > +balance) {
		return `An additional Carrier Fee of ${getShowCurrency()}${formatNumber(fee, 2)} will be applied when withdraw less than ${getShowCurrency()}${formatNumber(feeThreshold, 2)}, your currently available balance is ${getShowCurrency()}${formatNumber(balance, 2)}`;
	}

	if (typeof balance === 'number' && +data >= feeThreshold && +data > +balance) {
		return 'The amount has exceeded your sufficient balance, please try a smaller amount.';
	}

	if (+data >= wdThreshold) {
		return `Maximum per transaction is ${getShowCurrency()}${formatNumber(wdMax, 2)}.`;
	}
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

export function validateBankUnion(opt = {}, balance = 0) {
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

	ret = validateAmount(amount, balance) || '';
	if (ret) {
		return {
			amountRet: ret
		};
	}
}
