export default {
	11000: {
		type: 'error',
		text: 'The phone number shoud have 10 digits.', // text使用后台返回值
		field: 'phone',
		link: '',
		linkText: ''
	},
	11001: {
		type: 'error',
		text: 'It is not Kenya\'s mobile number.',
		field: 'phone',
		link: '',
		linkText: ''
	},
	11002: {
		type: 'error',
		text: 'incorrect country code.',
		field: 'phone',
		link: '',
		linkText: ''
	},
	11010: {
		type: 'error',
		text: 'The password should not be empty.',
		field: 'password',
		link: '',
		linkText: ''
	},
	11600: {
		type: 'error',
		text: 'The phone number has already been registerd.',
		field: 'phone',
		link: '',
		linkText: ''
	},
	11601: {
		type: 'error',
		text: 'The mobile number has not been registered.',
		field: 'phone',
		link: '',
		linkText: ''
	},
	11602: {
		type: 'warn',
		text: 'The mobile number has been locked.',
		field: 'phone',
		link: '#',
		linkText: 'Find out more.'
	},
	11603: {
		type: 'error',
		text: 'The password is incorrect. Please try again.',
		field: 'password',
		link: '',
		linkText: ''
	},
	11605: {
		type: 'warn',
		text: 'Phone No.was freezed, please contact our customer service.',
		field: 'phone',
		link: '#',
		linkText: 'Find out more.'
	},
	11703: {
		type: 'warn',
		text: 'The mobile number has exceeded the maximum number.',
		field: 'phone',
		link: '#',
		linkText: 'Find out more.'
	}
};
