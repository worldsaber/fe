export function getErrorInfo (code) { // eslint-disable-line
	if (!code) {
		return;
	}

	if ([11000, 11001, 11600, 11601, 11602, 11605, 11703].includes(code)) {
		return 'phone';
	}

	if ([11010, 11603].includes(code)) {
		return 'psd';
	}
}
