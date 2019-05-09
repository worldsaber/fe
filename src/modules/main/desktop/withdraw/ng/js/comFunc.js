import { showCurrency } from 'config/currencyConfig';

const despositMin = +depositCfg.min; // eslint-disable-line
const despositMax = +depositCfg.max; // eslint-disable-line
const withdrawMin = +withdrawCfg.min; // eslint-disable-line
const withdrawMax = +withdrawCfg.max; // eslint-disable-line

export const monthData = {
	1: 'JAN',
	2: 'FEB',
	3: 'MAR',
	4: 'APR',
	5: 'MAY',
	6: 'JUNE',
	7: 'JULY',
	8: 'AUG',
	9: 'SEP',
	10: 'OCT',
	11: 'NOV',
	12: 'DEC'
};

export function validateAmount(data, type, isInt, validateMin, balance) {
	let min,
		max;
	if (type === 'deposit') {
		min = despositMin;
		max = despositMax;
	} else {
		min = withdrawMin;
		max = withdrawMax;
	}
	data = data.replace(/^0/g, ''); // eslint-disable-line
	if (data.match(/\s/g)) {
		return 'Please remove the spaces.';
	}
	if (!data) {
		return 'Please enter a value no less than 50.';
	}
	if (data.indexOf('.', data.indexOf('.') + 1) !== -1 || data === '.') {
		return 'Please enter a valid number';
	}
	if (+data < min && validateMin) {
		return `Please enter a value no less than ${showCurrency}${min}.`;
	}

	if (/[^0-9]/.test(data) && isInt) {
		return 'Please enter a valid interger.';
	}

	if (+data > max) {
		return `Maximum per transaction is ${showCurrency}${max}`;
	}
}
