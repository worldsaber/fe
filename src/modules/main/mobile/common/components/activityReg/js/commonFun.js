import { isEmptyObject } from 'utils';

export function validatePsd(password) {
	if (!password) {
		return 'Password is required.';
	}

	if (password.length < 6) {
		return 'Password cannot be shorter than 6 characters.';
	}

	if (password.length > 14) {
		return 'Password cannot be longer than 14 characters.';
	}

	if (!/[a-z]/gi.test(password) || !/[0-9]/.test(password)) {
		return 'Password must contain at least one letter and one number.';
	}
}

export function validatePhone(phone) {
	if (!phone) {
		return 'Mobile Number is required.';
	}
}

export function validateCode(code) {
	if (!code) {
		return 'Verification Code is required.';
	}
}

export function unionValidate(opt, ignoreVcode) {
	if (isEmptyObject(opt)) {
		console.error('validate params of register: phone, password, code are required!');
		return {
			success: false
		};
	}

	const { phone, password, phoneVerifyCode } = opt;

	let error = validatePhone(phone);
	if (error) {
		return {
			phoneError: error
		};
	}

	error = validatePsd(password);
	if (error) {
		return {
			psdError: error
		};
	}

	if (!ignoreVcode) {
		error = validateCode(phoneVerifyCode);
		if (error) {
			return {
				codeError: error
			};
		}
	}

	return {
		success: true
	};
}
