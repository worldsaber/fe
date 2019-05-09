const state = {
	// 订单类型
	settleType: 'unsettled',

	// 订单列表
	orderList: [],

  // 显示的订单详情
	orderDetail: {},

  // 当前显示订单详情的订单号, 默认不限是订单详情(betId)
	currentOrderId: '',

	// 分页配置pageCount
	pageCount: 1,

	// pageTotal
	totalOrder: 0,

	// pageSize
	pageSize: 10,

	// 当前页的index
	pageIndex: 1,

	// 是否址加载ajax列表数据
	isLoading: false

};

export default state;
