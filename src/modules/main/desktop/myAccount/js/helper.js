export { monthData, getMonthDayData, getYearData } from 'base/js/date4YearMonDay';

// 密码是否合法
export function isValidPsw (psw, isOldPsw = false) {
	let err = '';
	if (!psw) {
		err = (isOldPsw ? 'Old' : '') + 'Password is required.';
	} else if (psw.length < 6) {
		err = 'Password cannot be shorter than 6 characters.';
	} else if (psw.length > 14) {
		err = 'Password cannot be longer than 14 characters.';
	} else if (!/\d/.test(psw) || !/[a-zA-Z]/.test(psw)) {
		err = 'Password must contain at least one letter and one number.';
	} else if ('01234567890'.indexOf(psw) !== -1) {
		err = 'Password cannot contain multiple consecutive numbers .';
	}
	// 旧密码提示就两种，空和错误
	if (err && isOldPsw && psw) {
		err = 'The password is incorrect. Please try again.';
	}
	return err;
}
