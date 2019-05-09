import { showCurrency } from 'config/currencyConfig';

const despositMin = +depositCfg.min; // eslint-disable-line
const despositMax = +depositCfg.max; // eslint-disable-line
const withdrawMin = +withdrawCfg.min; // eslint-disable-line
const withdrawMax = +withdrawCfg.max; // eslint-disable-line

export const monthData = {
	0: 'Jan',
	1: 'Feb',
	2: 'Mar',
	3: 'Apr',
	4: 'May',
	5: 'June',
	6: 'July',
	7: 'Aug',
	8: 'Sept',
	9: 'Oct',
	10: 'Nov',
	11: 'Dec'
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
