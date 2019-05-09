const cashoutCfg = window.cashoutCfg || {};

const state = {

	// 最小可以cashout的值
	minCashoutAmount: +cashoutCfg.min || 100,

	// 最大可以cashout的值
	maxCashOutAmount: +cashoutCfg.max || 100000,

	// cashout list
	cashoutList: [],

	// 记录betId在list对应的index值
	betIdKeys: [],

	// 当前显示的cashout detail
	cashoutDetail: [],

	// 当前显示的cashout的详细信息
	cashoutInfo: {},

	// 当前显示详情的betId
	currentBetId: '',

	// 存储detail的错误消息
	errorInfo: {},

	// 分页配置pageSize
	pageSize: 5,

	// pageTotal
	totalCashout: 0,

	// 当前id更新后的最后一条id
	lastId: null,

	// 获取list发生错误，不需要明确错误
	loadListError: false,

	// 获取detail发生错误，不需要明确错误
	loadDetailError: false,

	// 没有cashout列表
	noCashout: true,

	// cashout列表 loading状态
	listLoading: false,

	// cashout detial loading状态
	detailLoading: false,

	// cashout detail refresh loading状态
	refreshLoading: false,

	// cashout loading
	cashoutLoading: false,

	// 成功cashout betId
	successedBetId: '',

	commentsInfo: {},

	betDetailOddsMap: {}
};

export default state;
