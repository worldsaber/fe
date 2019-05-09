/**
 * Converts num to a decimal string (if it isn't one already) and then rounds it
 * to at most dp decimal places.
 *
 * For explanation of why you'd want to perform rounding operations on a String
 * rather than a Number, see http://stackoverflow.com/a/38676273/1709587
 *
 * @param {(number|string)} num
 * @param {number} dp
 * @return {string}
 */
function roundStringNumberWithoutTrailingZeroes (num, dp) {
	if (arguments.length !== 2) {
		throw new Error('2 arguments required');
	}

	num = String(num);
	if (num.indexOf('e+') !== -1) {
		// Can't round numbers this large because their string representation
		// contains an exponent, like 9.99e+37
		throw new Error('num too large');
	}

	let parts = num.split('.'),
		beforePoint = parts[0],
		afterPoint = parts.length === 2 ? parts[1] : false,
		shouldRoundUp = afterPoint[dp] >= 5,
		finalNumber;

	if (!afterPoint) {
		finalNumber = num;
	} else {
		afterPoint = afterPoint.slice(0, dp);

		if (!shouldRoundUp) {
			finalNumber = beforePoint + '.' + afterPoint;
		} else if (/^9+$/.test(afterPoint)) {
			// If we need to round up a number like 1.9999, increment the integer
			finalNumber = +beforePoint + 1 + '.';
		} else {
			// Starting from the last digit, increment digits until we find one
			// that is not 9, then stop
			let i = dp - 1;
			while (true) {
				if (+afterPoint[i] === 9) {
					afterPoint = afterPoint.substr(0, i) + '0' + afterPoint.substr(i + 1);
					i--;
				} else {
					afterPoint = afterPoint.substr(0, i) + (Number(afterPoint[i]) + 1) + afterPoint.substr(i + 1);
					break;
				}
			}

			finalNumber = beforePoint + '.' + afterPoint;
		}

		// Remove trailing zeroes from fractional part before returning
		finalNumber = finalNumber.replace(/0+$/, '');
	}

	parts = finalNumber.split('.');
	beforePoint = parts[0];
	afterPoint = parts.length === 2 ? parts[1].split('') : [];

	for (let j = afterPoint.length; j < dp; j++) {
		afterPoint.push(0);
	}

	return beforePoint + '.' + afterPoint.join('');
}

Number.prototype.toFixed = function(d) {
	let s = this + '';
	if (!d) d = 0;
	if (s.indexOf('.') === -1) {
		s += '.';
	}
	s += new Array(d + 1).join('0');
	if (new RegExp('^(-|\\+)?(\\d+(\\.\\d{0,' + (d + 1) + '})?)\\d*$').test(s)) {
		let s = '0' + RegExp.$2,
			pm = RegExp.$1,
			a = RegExp.$3.length,
			b = true;
		if (a === d + 2) {
			a = s.match(/\d/g);
			if (parseInt(a[a.length - 1], 10) > 4) {
				for (let i = a.length - 2; i >= 0; i--) {
					a[i] = parseInt(a[i], 10) + 1;
					if (a[i] === 10) {
						a[i] = 0;
						b = i !== 1;
					} else break;
				}
			}
			s = a.join('').replace(new RegExp('(\\d+)(\\d{' + d + '})\\d$'), '$1.$2');
		}
		if (b) {
			s = s.substr(1);
		}
		return (pm + s).replace(/\.$/, '');
	}
	return this + '';
	// return roundStringNumberWithoutTrailingZeroes(this, n);
};
