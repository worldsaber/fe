const state = {
	// 订单类型
	settleType: 'settled',

	// // 订单体育类型
	// orderType4Sport: 'sports',

	// 订单列表
	orderList: [],

	// 显示的订单详情
	betDetail: [],

	// 显示的combination信息, sports中有
	combinationInfo: [],

	// 显示的cashout history
	cashoutHistory: [],

	// 当前显示订单详情的订单号, 默认不限是订单详情(betId)
	currentBetId: '',

	// 记录最后一个orderno，用于分页  这个只适用于wap端的滑动分页，每次获取当前订单的下一页，pc的传pageNo获取
	lastOrderNo: '',

	// 分页配置pageCount
	pageCount: 1,

	// pageTotal
	totalOrder: 0,

	// pageSize
	pageSize: 5,

	// 当前页的index，如果订单数量少于10条时，本地分页，需要改该值，后端分页时，该值固定为1
	pageIndex: 1,

	// 是否在获取列表数据
	isLoading: false
};

export default state;
