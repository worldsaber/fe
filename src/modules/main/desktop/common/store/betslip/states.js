import { LS } from 'storage';
import { URL } from 'utils';
import { getMutexList } from '../betslipStake/commonFun';

const threshold = 30;
const systemThreshold = 15;

const flexiCfg = window.flexiCfg || {};

// betslip outcomes
let localBetSlips = LS.get('betslips');
localBetSlips = localBetSlips ? JSON.parse(localBetSlips) : [];
localBetSlips.forEach(item => {
	item.outcomeInfo.showOdds = true;
	item.outcomeInfo.statusDesc = '';
});

// betslip 选项
let localSelections = LS.get('betslipsSelections');
localSelections = localSelections ? JSON.parse(localSelections) : {};

// betslip bankers
let localBankers = LS.get('betslipsBankers');
localBankers = localBankers ? JSON.parse(localBankers) : [];

// 本地存储的投注项
const localBetSlipsKey = (() => {
	const ret = [];
	(localBetSlips || []).forEach(item => {
		ret.push(item.key);
	});

	return ret;
})();

// 修正single问题
// if ((!localSelections.single ||
// 	localSelections.single.length) && localBetSlipsKey.length === 1
// 	) {
// 	localSelections.single = [localBetSlipsKey[0]];
// 	localSelections.multiple = [localBetSlipsKey[0]];
// 	localSelections.system = [localBetSlipsKey[0]];
// }

// 由于gameId可能会重发，对投注项按照eventId归类, 同时恢复色块组
const eventColorLump = [];
const sameGameMap = (() => {
	const ret = {};

	(localBetSlips || []).forEach(item => {
		const eventId = item.eventId;
		!ret[eventId] && (ret[eventId] = []);
		ret[eventId].push(item.key);
		if (!eventColorLump.includes(eventId) && ret[eventId].length >= 2) {
			eventColorLump.push(eventId);
		}
	});

	return ret;
})();

// 由于优先选择multiple，故type取multiple
const supportMultiple = (() => {
	const mutexList = getMutexList({ sameGameMap, currentType: 'multiple' }, localBetSlipsKey) || {};
	const mutexCounts = Object.keys(mutexList).length;
	if (mutexCounts <= 1) {
		return false;
	}

	return true;
})();

const mulMutexCounts = (() => {
	const mutexList = getMutexList({ sameGameMap, currentType: 'multiple' }, localSelections.multiple || []) || {};
	return Object.keys(mutexList).length;
})();

// 超过15项，不支持system
const supportSystem = localBetSlipsKey.length <= systemThreshold;

// 达到30项
const betable = localBetSlipsKey.length < threshold;

// share code
const shareCode = URL.getPara('shareCode');

const state = {
	// selected bet (Array)
	betslips: localBetSlips,

	// 为保证投注顺序---后选择的优先 (Array) [key]
	betslipsKeys: localBetSlipsKey,

	// 存储gameId一样的key
	sameGameMap,

	// 保存single、multiple、system的选中状态
	singleCheckedList: localSelections.single || [],
	multipleCheckedList: localSelections.multiple || [],
	systemCheckedList: localSelections.system || [],

	// 当前类型
	currentType: supportMultiple ? 'multiple' : 'single',

	// 最多能够投注30项
	threshold,

	// bet type
	betType: ['single', 'multiple', 'system'],

	// bankers
	bankerList: localBankers,

	bankerStatus: !!localBankers.length,

	// 互斥组色块标识, 只记录eventId
	eventColorLump,

	// 是否支持multiple
	supportMultiple,

	// 是否支持system
	supportSystem,

	systemThreshold,

	// suspended outcome, accept change保留
	suspendedKeys: [],

	// unavailable outcome， accept change移除
	unavailableKeys: [],

	// change odds outcome, 5s后移除up/dowm状态
	changesKeys: [],

	// 记录accept change的状态
	acceptStatus: false,

	betable,

	// betslipLoading
	betslipLoading: false,

	// 分享码信息
	betCodeInfo: shareCode ? { shareCode } : {},

	// isInit
	isInit: false,

	// flexbet开关(0-可以flexiblebet，1-不支持Live，2-不许flexibleBet)
	flexiVal: -1,

	// flexBet n
	flexiSelect: mulMutexCounts,

	// 正常模式：1； flexibet模式： 2
	multipleMode: 1,

	// flex n 最小值
	flexLimit: 2,

	isFlexiLocked: false,

	isFlexiAutoChg: false,

	oddsThreshold: flexiCfg.oddsThreshold || 1.05,

	// oddsKey
	oddsKey: -1,

	payMethod: {
		single: 0,
		multiple: 0,
		system: 0
	}
};

export default state;
