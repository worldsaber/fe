const state = {
	settleType: 'Settled',
	ticketList: [],
	ticketDetail: {},
	totalOrder: 0,
	betDetail: [],
	// 记录最后一个orderno，用于分页  这个只适用于wap端的滑动分页，每次获取当前订单的下一页，pc的传pageNo获取
	lastOrderNo: '',
	pageSize: 10,
	// sports中用tracker
	showTracker: false,
	jp_showStatistics: false,
	openBetDetail: false,
	from: null,
	to: null,
	flagForDate: {},
	flagForYear: {},
	bizCode: 0,
	isLoading: false,

	shareGiftId: '',
	giftLoaded: false,
	onlyWinnings: 0,
	isHistory: 0,
	noMore: false,

	errorInfo: {}
};

export default state;
