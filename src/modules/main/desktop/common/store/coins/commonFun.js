import dateFormat from 'kernel/js/dateFormat';

export function getStepDesc(item) {
	const status = item.status;
	let showStatusDesc = '';

	switch (status) {
	case 1:
		showStatusDesc = 'Your SportyCoins have been cancelled by SportyBet according to the T&C of activities and SportyCoins.';
		break;
	case 2:
		showStatusDesc = 'Your SportyCoins have been cancelled due to another SportyCoins have been claimed.';
		break;
	case 3:
		showStatusDesc = `Your SportyCoins expired on ${dateFormat.format(item.predefinedExpireTime, 'DD/MM/YY HH:mm')}`;
		break;
	case 4:
		showStatusDesc = 'have been transferred to your balance.';
		break;
	case 5:
		showStatusDesc = 'Your SportyCoins have been used up.';
		break;
	default:
	}

	return showStatusDesc;
}

function getStepTitle(item) {
	const status = item.status;
	switch (status) {
	case 1:
	case 2:
		return 'Cancelled';
	case 3:
		return 'Expired';
	case 4:
		return 'Succeeded!';
	case 5:
		return 'Used Up';
	default:
		return '';
	}
}

function getProsDesc(total, cur) {
	if (total) {
		let perct = (total - cur) / total;
		perct *= 100;

		if (perct === 0) {
			return {
				title: 'Well done!',
				isSuc: true,
				isInner: true
			};
		} else if (perct <= 30) {
			return {
				title: 'Almost There!',
				isInner: true
			};
		} else if (perct <= 70) {
			return {
				title: 'Cheer up!'
			};
		}

		return {
			title: 'Way to go!'
		};
	}

	return '';
}

export function clearHistoryData(list = []) {
	let temp;

	for (const item of list) {
		temp = (temp = item.currentCoins) && temp / 10000 || 0;
		temp = temp.toFixed(2);

		item.showCoins = temp;

		temp = (temp = item.finalAmount) && temp / 10000 || 0;
		temp = temp.toFixed(2);
		item.showBalance = temp;

		const status = item.status;
		if (status === 4) {
			item.isSuc = true;
		} else {
			item.isSuc = false;
		}

		if (status === 3) {
			item.prompt = `Expired on ${dateFormat.format(item.predefinedExpireTime, 'DD/MM/YY HH:mm')}`;
		}

		item.showTitle = getStepTitle(item);

		if ((temp = item.banner )&& (temp = temp.promotation)) { // eslint-disable-line
			item.banner.promotation = /\D/.test(temp) ? temp.replace(/\D/g, '') : temp;
		}
	}

	return list;
}

export function clearTransData(list = [], type = 0) {
	let temp;
	const ret = [];

	for (const item of list) {
		if (+type !== +item.type) {
			continue;
		}

		temp = (temp = item.amount) && temp / 10000 || 0;
		temp = temp.toFixed(2);

		item.showAmount = temp;

		if (item.createTime) {
			item.showCreateTime = `${dateFormat.format(item.createTime, 'DD/MM/YY HH:mm')}`;
		}

		// 修正后台错误数据
		if (+type === 1 && !item.amountSign) {
			item.amountSign = '+';
		}

		// 修正后台错误数据
		// if (+type === 1 && item.prompt) {
		// 	item.prompt = '';
		// }

		ret.push(item);
	}

	return ret;
}

export function clearCoinsInfo(data) {
	const { settleCoinsRequire = 0, settleStakeRequire = 0 } = data || {},
		coins = {},
		stake = {};
	const { currentCoins = 0, currentStake = 0 } = data || {};

	let temp,
		showExpireTime = '',
		count = 0;

	let fixVal = 0;

	if (settleCoinsRequire) {
		coins.showCoins = true;

		fixVal = currentCoins > settleCoinsRequire ? settleCoinsRequire : currentCoins;

		temp = settleCoinsRequire - currentCoins;
		temp = temp && temp / 10000 || 0;
		coins.left = temp;
		temp = temp.toFixed(2);
		coins.showLeft = temp;

		coins.perct = (fixVal / settleCoinsRequire).toFixed(2) * 100;

		coins.showProsDesc = getProsDesc(settleCoinsRequire, fixVal);

		++count;

		if (temp = currentCoins) { // eslint-disable-line
			temp /= 10000;
			coins.current = temp;
			temp = temp.toFixed(2);
			coins.showCur = temp;
		} else {
			coins.showCur = currentCoins.toFixed(2);
		}

		temp = settleCoinsRequire;
		temp /= 10000;
		coins.settleRequire = temp;
		temp = temp.toFixed(2);
		coins.showReq = temp;
	} else {
		coins.showCoins = false;
	}

	if (settleStakeRequire) {
		stake.showStake = true;

		fixVal = currentStake > settleStakeRequire ? settleStakeRequire : currentStake;

		temp = settleStakeRequire - currentStake;
		temp = temp && temp / 10000 || 0;
		stake.left = temp;
		temp = temp.toFixed(2);
		stake.showLeft = temp;

		stake.perct = (fixVal / settleStakeRequire).toFixed(2) * 100;

		stake.showProsDesc = getProsDesc(settleStakeRequire, fixVal);

		++count;

		if (temp = currentStake) { // eslint-disable-line
			temp /= 10000;
			stake.current = temp;
			temp = temp.toFixed(2);
			stake.showCur = temp;
		} else {
			stake.showCur = currentStake.toFixed(2);
		}

		temp = settleStakeRequire;
		temp /= 10000;
		stake.settleRequire = temp;
		temp = temp.toFixed(2);
		stake.showReq = temp;
	} else {
		stake.showStake = false;
	}

	if (temp = data.predefinedExpireTime) { // eslint-disable-line
		temp = dateFormat.format(temp, 'DD/MM/YY HH:mm');
		showExpireTime = `Expires on ${temp}`;
	}

	stake.odds = data.odds && data.odds.toFixed(2) || ''; // eslint-disable-line

	if ((temp = data.banner) && (temp = temp.promotation)) { // eslint-disable-line
		data.banner.promotation = /\D/.test(temp) ? temp.replace(/\D/g, '') : temp;
	}

	const clearBanner = [];
	for (const item of (data.showBanners || [])) {
		if (!item.activityUrl) {
			continue;
		}
		if ((temp = item.promotation)) { // eslint-disable-line
			item.promotation = /\D/.test(temp) ? temp.replace(/\D/g, '') : temp;
		}

		clearBanner.push(item);
	}

	return {
		coins,
		stake,
		banner: data.banner || {},
		showBanners: clearBanner,
		status: data.status,
		showExpireTime,
		count,
		activityId: data.activityId || ''
	};
}
