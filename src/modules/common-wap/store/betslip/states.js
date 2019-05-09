import { LS, cookie } from 'storage';
import { colorLump } from 'config/betslip/stakeConfig';

let betslips = LS.get('wapBetslips') || '[]';
let fastMode = LS.get('wap_fast_betslip') || '0'; // 默认关闭
fastMode = !!+fastMode;
const eventSizeMap = {};
const colorEventOrder = [];

const flexiCfg = window.flexiCfg || {};
const boostCfg = window.boostCfg || {};

try {
	betslips = JSON.parse(betslips);
} catch (e) {
	betslips = [];
	console.error(e);
}

let supportMultiple = betslips.length > 1;
// 默认的时候，不是 unavailable或suspended
betslips.forEach(item => {
	// up(赔率上涨) down（赔率下跌） unavailable suspended
	item.outcomeInfo.statusDesc = '';
	// 是否显示赔率
	item.outcomeInfo.showOdds = true;
	const eventId = item.eventId;
	eventSizeMap[eventId] = eventSizeMap[eventId] || [];
	eventSizeMap[eventId].push(item.key);
	if (eventSizeMap[eventId].length > 1) {
		colorEventOrder.push(eventId);
	}
});
// 分组大于1，因为这里分组下的比赛一定可投注，还没刷快照
supportMultiple = Object.keys(eventSizeMap).length > 1;

let autoAcceptChange;
if (window.loginStatus) {
	autoAcceptChange = LS.get(`acceptChanges_${cookie('userId')}`) === '1';
} else {
	try {
		autoAcceptChange = sessionStorage.getItem('acceptChanges') === '1';
	} catch (e) {
		console.error(e);
	}
}

/**
 * betslips数据结构
 * [
 *  {
 *  	home: 主队名称
 *		away: 客队名称
 *		outcomeInfo : {
 *			id
 *			desc
 *			odds
 *			isActive
 *			pushtime
 *		}
 *		marketInfo: {
 *			 desc
 *			 id
 *			 speciefier
 *		}
 *		gameId
 *		eventId
 *		sportId
 *		sportName
 *		categoryId
 *		tournamentId
 *      showOdds
 *      赔率 状态 up(赔率上涨) down（赔率下跌） unavailable ususpended
 *		statusDesc
 *      key: sportId_eventId_marketId(?speciefier不空时拼上)_outcomeId
 * 	}
 * ]
 */
const state = {
	// selected bet ([])
	betslips,
	// 当前所选的event，组成map，同一个event可以选择多个outcome
	eventSizeMap,
	// 需要标记颜色的数组，为了保证颜色的顺序，在增加或者删除outcome的时候不可以改变颜色
	colorEventOrder,
	// 当前类型
	currentType: supportMultiple ? 'multiple' : 'single',
	// 最多能够投注30项
	threshold: 30,
	// system最多选几个
	systemThreshold: 15,
	// bet type
	betType: ['single', 'multiple', 'system'],
	// 如果有比赛 suspended了，自动删除胆码
	bankerMap: {},
	// 发生改变的outcome按照顺序表示
	changeOutcomes: [],
	// 15种支持的颜色，同一个eventId用相同的颜色
	colors: colorLump.slice(0),
	// 是否需要点击接受
	acceptStatus: false,
	// 是否自动接收赔率变化
	autoAcceptChange,
	// 加载状态 true加载中，false加载完成 -1加载失败
	loading: false,
	// 当前是否开启banker模式
	bankerStatus: false,
	// 当选选择达到最大个数的时候发生
	reachMaxThreshold: false,
	// 如果当前是system并且选择达到最大system时候出发
	reachChangeMaxSystemThreshold: false,
	// 是否接受超出限额的bet，多余的需删除
	isAcceptMore: false,
	// 临时缓存bet outcomes
	stageBetOutcomes: [],
	// flexibet 小n数量
	flexibetNum: betslips.length,
	minFlexibetNum: 2,
	isFlexiAutoChg: false,

	multipleMode: 1, // 1普通multip  2 flexibet
	isFlexiLocked: false,
	oddsThreshold: flexiCfg.oddsThreshold || 1.05,

	usingOddsBoost: false,
	oddsBoostStatus: false,
	oddsBoostEvents: [],
	boostOddsKey: boostCfg.oddsThreshold || 1.05,
	boostPeriod: '',
	fastMode,
	payMode: 0, // 支付方式  0: balance 1: sportyCoin
	// betslip 广告信息
	betslipAds: null
};

export default state;
