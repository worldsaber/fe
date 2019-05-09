export function getErrorInfo(code) { // eslint-disable-line
	if (!code) {
		return;
	}

	if ([11000, 11001, 11600, 11601, 11602, 11605].includes(code)) {
		return 'phone';
	}

	if ([11010, 11603].includes(code)) {
		return 'psd';
	}

	if ([11700, 11701, 11702].includes(code)) {
		return 'code';
	}
}
