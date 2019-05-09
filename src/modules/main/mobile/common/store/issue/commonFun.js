export const TEN_MINUTES = 12 * 60 * 1000;

export function getIssueStatus(status, startTime, endTime) {
	switch (status) {
	case 10:
		return getPeriod(startTime, endTime);
	case 20:
	case 30:
	case 40:
		return 1;
	// case 30:
	// 	return 5;
	default:
		return 2;
	}
}

function getPeriod(startTime, endTime) {
	if (startTime === -1 || endTime === -1) {
		return 2;
	}

	const now = Date.now();

	const dis = startTime - now,
		disEnd = endTime - now;

	// 已结束
	if (disEnd < 0) {
		return 2;
	}

	// 大于等于10分钟
	if (dis >= TEN_MINUTES) {
		return 3;
	}

	// 10分支之内
	if (dis < TEN_MINUTES && dis > 0) {
		return 4;
	}

	// 已开始
	return 1;
}
