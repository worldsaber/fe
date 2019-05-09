const cashoutCfg = window.cashoutCfg || {};

const state = {
	minCashoutAmount: +cashoutCfg.min || 100,

	maxCashOutAmount: +cashoutCfg.max || 100000,

	betKeys: [],

	details: [],

	pageSize: 20,

	pageIndex: 1,

	totalCount: 0,

	errorInfo: {},

	reqLoading: false,

	commentsInfo: null,

	isLogin: window.loginStatus || false,

	cfgInfo: {},

	cashoutInfo: {},

	lockCal: false,

	adCfg: {},

	lockPageUpdate: false
};
export default state;
