const codeVerifyErr = {
	11700: {
		text: 'Incorrect code, pls try again.'
	},
	11701: {
		text: 'Code out of date. Pls click button to send a new Code.'
	},
	11702: {
		text: 'The code is already used.'
	},
	11810: {
		text: 'Invalid token.'
	}
};
const sendSmsErr = {
	11600: {
		text: 'The phone number has already been registerd.'
	},
	11601: {
		text: 'User not exist.'
	},
	11602: {
		text: 'Phone No.was locked/freezed, pls contact our customer service.'
	},
	11703: {
		text: 'The mobile number has exceeded the maximum number.'
	},
	11810: {
		text: 'Invalid token.'
	}
};
export {
	codeVerifyErr,
	sendSmsErr
};
