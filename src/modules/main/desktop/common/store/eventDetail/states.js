import { LS } from 'storage';

const priorityMarketMap = (() => {
	const priorityKeys = LS.get('priorityMarketKeys');
	return priorityKeys ? JSON.parse(priorityKeys) : {};
})();

// let localBetSlips = LS.get('betslips');
// localBetSlips = localBetSlips ? JSON.parse(localBetSlips) : [];

// 本地存储的投注项
// const localBetSlipsKey = (() => {
// 	const ret = [];
// 	(localBetSlips || []).forEach(item => {
// 		ret.push(item.key);
// 	});
//
// 	return ret;
// })();

const state = {
	/*
	常用赛事列表，赛事详情切换时，清空，不必一直存储, 防止多个赛事之间相互影响
	 */
	marketGroup: [],

	/*
	赛事基本信息, 占时不清空, sportId_eventId 为key
	 */
	eventInfo: {},

	/*
	market信息，market基础信息
	 */
	marketInfo: [],
	marketKeys: [],

	/*
	outcome信息
	 */
	outcomeInfo: [],
	outcomeKeys: [],

	/*
	选中的outcome, 需要记录对应的outcomeId、marketId、eventID、sportId(sportId、categoryID、tournamentID唯一且不会等)
	 */
	selectList: [],

	/*
	收起的table列表，赛事切换是清空，以marketId为key
	 */
	userUnpackedList: [],
	userPackedList: [],

	/*
	当前赛事eventID
	 */
	currentEvent: '',

	/*
	sportID
	 */
	currentSport: null,

	/*
	marketGroup
	 */
	currentMarketGroup: '',

	// outcomeUpdateTime
	outcomeUpdateTime: {},

	// 置顶的market, 后收藏的优先，与sport、market和specifier有关
	priorityMarketMap,

	priorityMarketKeys: [],

	// liveBetting event count
	eventCount: 0,

	// 比赛是否结束
	eventFinished: false,

	// autoPackedList
	autoPackedList: [],

	// event detail loading
	loading: false,

	// event detail load error
	loadError: false,

	isLive: false,

	// 是否有直播
	liveChannel: false,

	// 直播流地址
	liveChannelUrl: null,

	// product down
	isProductOff: false
};

export default state;
