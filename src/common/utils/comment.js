/**
 * 评论日期格式化
 * @param {String, Number} time  日期或时间戳
 */
export function formatCommentDate(time) { // eslint-disable-line
	const dateLimit = {
		oneMinute: 60 * 1000, // 1min
		justNow: 5 * 60 * 1000, // 5min
		oneHour: 1 * 60 * 60 * 1000, // 1h
		oneDay: 24 * 1 * 60 * 60 * 1000 // 1d
	};

	// 差值
	const diff = Date.now() - (new Date(time)).getTime();
	if (diff <= dateLimit.justNow) {
		// 5分钟内
		return 'just now';
	} else if (diff <= dateLimit.oneHour) {
		// 1小时内
		const t = (diff) / dateLimit.oneMinute;
		return `${parseInt(t, 10)} min. ago`;
	} else if (diff <= dateLimit.oneDay) {
		// 1天内
		const t = (diff) / dateLimit.oneHour;
		return `${parseInt(t, 10)} h ago`;
	}
	// 超过1天
	const t = (diff) / dateLimit.oneDay;
	return `${parseInt(t, 10)} d ago`;
}
