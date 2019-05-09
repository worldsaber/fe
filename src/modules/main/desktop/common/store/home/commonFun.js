import { formatNumber } from 'utils';

export function getTimeRange(date) {
	// IDEA: 小于1小时精确到分显示 X min ago, 不足1分钟显示 1 min ago。大于1小时精确到小时显示 X hr ago。超过72小时显示为 72 hr ago。

	if (!+date) {
		return '';
	}

	const now = +new Date();
	const dis = now - date;
	const MINUTE = 60 * 1000,
		HOUR = 60 * MINUTE,
		HOUR_72 = 72 * HOUR;

	if (dis > HOUR_72) {
		return '72hr ago';
	}

	if (dis > HOUR) {
		return `${parseInt(dis / HOUR, 10)}hr ago`;
	}

	if (dis > MINUTE) {
		return `${parseInt(dis / MINUTE, 10)}min ago`;
	}

	if (dis <= 0) {
		return '';
	}

	return '1min ago';
}

export function clearBdInfo() {
	const bizType2key = {
			1: 'Sports Betting',
			2: 'Virtual',
			3: 'Jackpot'
		},
		bdConfig = window.bdcastConf || [];

	let sysInfo = {},
		bscastInfo = [],
		grandInfo = [];

	for (const item of bdConfig) {
		const { groupType, infos = [] } = item;

		switch (groupType) {
		case 1: {
			for (const notItem of infos) {
				if (notItem.text && notItem.text.length) {
					sysInfo = {
						text: notItem.text,
						url: notItem.url || '',
						id: notItem.id
					};
					break;
				}
			}
			break;
		}
		case 2: {
			const bdTemp = [];
			for (const bdItem of infos) {
				if (bdItem.text && bdItem.text.length) {
					bdTemp.push({
						text: bdItem.text,
						key: bdItem.id,
						link: bdItem.url || ''
					});
				}
			}
			bscastInfo = [...bdTemp];
			break;
		}
		case 20: {
			for (const grandItem of infos) {
				const { detail = {}} = grandItem,
					temp = {};

				// msgType为1是中奖通知
				if (detail.msgType === 1) {
					temp.id = grandItem.id;
					temp.showTime = getTimeRange(detail.bizTime);
					temp.showWinning = detail.winning && formatNumber(detail.winning / 10000, 2) || 0;
					temp.showType = bizType2key[detail.bizType];
					temp.phone = detail.phone;
					grandInfo.push(temp);
				}
			}
			break;
		}
		default:
		}
	}

	return {
		sysInfo,
		bscastInfo,
		grandInfo
	};
}
