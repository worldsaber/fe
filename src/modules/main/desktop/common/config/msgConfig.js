const supportSMS = [
	'ke'
];

const msgThreshold = {
	ke: 3,
	ng: 5,
	gh: 5
};

export function getMsgThreshold() {
	const country = window.country || 'ke';

	return msgThreshold[country] || 3;
}

export function isSupportSms() {
	const country = window.country || 'ke';

	return supportSMS.includes(country);
}
