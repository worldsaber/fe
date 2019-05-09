export default {
	reqLoading: false,

	currency: window.currency,

	bankList: [],						// bank list
	bankHistoryList: [],				// 历史bank提现列表
	errorInfo: {},

	// 提交给后台的数据，数据验证成功后才存储
	wdInfo: {},

	tradeId: '',

	verifyType: '',

	wdSuccess: false,

	needAudit: false,

	bankAccount: '',

	verfiyInfo: null,

	bankLoadError: false
};
