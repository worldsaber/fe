import dateFormat from 'kernel/js/dateFormat';
import { getCountryMultiple } from '../util';

// 是否是新用户 [时间分界点  + 是否投注]
function isNewCustomer(state) {
	const totalNum = state.totalBetCount;
	return totalNum === 0;
}
// registTime
const timePoints = ['2018/06/10', '2018/07/14', '2018/08/10'];

function getTimeIndex(state) {
	let time = state.registTime;
	time = dateFormat.format(time, 'YYYY/MM/DD');
	let index = 0;
	for (const item of timePoints) {
		if (time > item) {
			index++;
		} else {
			break;
		}
	}
	return index;
}
// never win
function isNeverWin(state) {
	return !state.firstPrizeSequence; // 不存在或者0
}

// 金额判断 分界点
const conditionPoints = [100, 1000, 10000, 100000, 500000];

function getAmountIndex(state) {
	const winning = state.bigPrizeWinning / 10000;
	let index = 0;
	const multiple = getCountryMultiple();

	for (const point of conditionPoints) {
		if (point * multiple < winning) {
			index++;
		} else {
			break;
		}
	}

	return index;
}

const ratios = [50, 70];

function getRatioIndex(state) {
	const ratio = Math.floor(state.winningsSelectionCount / state.selectionCount * 100);
	let index = 0;
	for (const t of ratios) {
		if (t < ratio) {
			index++;
		} else {
			break;
		}
	}
	return index;
}

// share
const betPoint = [1000, 10000, 30000];

function getBetIndex(state) {
	const totalAmount = state.totalStakeAmount / 10000;
	let index = 0;
	const multiple = getCountryMultiple();
	for (const pt of betPoint) {
		if (pt * multiple < totalAmount) {
			index++;
		} else {
			break;
		}
	}
	return index;
}
function getAdjIndex(state) {
	let index = 0;
	const hasProfit = state.totalWinningsAmount - state.totalStakeAmount > 0;
	const betRatioOver = state.meanOdds < 1.5;
	const overSevenPerDay = state.totalBetCount / state.totalPlacebetDays > 7;

	if (hasProfit) {
		index = 1;
	} else if (betRatioOver) {
		index = 2;
	} else if (overSevenPerDay) {
		index = 3;
	}
	return index;
}
const NOUNS = [
	['Captain'],
	['Trainer', 'Boss'],
	['Manager'],
	['CEO', 'President']
];

const ADJS = [
	['a Talented', 'a Versatile'],
	['an Energetic', 'a Jovial'],
	['a Reliable', 'a Humble'],
	['an Experienced', 'a Dynamic'],
];

function getNounText(state, getters) {
	const index = getters.getBetIndex;
	const arr = NOUNS[index];
	const nounRandomIndex = Math.floor(state.totalStakeAmount / 10000) % 2; // gh 小数

	if (arr.length > 1) {
		return arr[nounRandomIndex];
	}
	return arr[0];
}

function getAdjText(state, getters) {
	const index = getters.getAdjIndex;
	const arr = ADJS[index];
	const adjRandomIndex = state.totalBetCount % 2;

	if (arr.length > 1) {
		return arr[adjRandomIndex];
	}
	return arr[0];
}
function getContinentsLight(state) {
	return state.continentsLightend || 'Europe';
}
export default {
	isNewCustomer,
	getTimeIndex,
	isNeverWin,
	getAmountIndex,
	getRatioIndex,
	getBetIndex,
	getAdjIndex,
	getNounText,
	getAdjText,
	getContinentsLight,
};
