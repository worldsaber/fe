export function validatorPhone(phone) {
	if (!phone) {
		return 'Mobile Number is required.';
	}
}

export function validatorPsd(psd) {
	if (!psd) {
		return 'Password is required.';
	}

	// if (psd.length < 6) {
	// 	return 'Password cannot be shorter than 6 characters.';
	// }
    //
	// if (psd.length > 14) {
	// 	return 'Password cannot be longer than 14 characters.';
	// }

	// if (!/[a-z]/gi.test(psd) || !/[0-9]/.test(psd)) {
	// 	return 'Password must contain at least one letter and one number.';
	// }
}
