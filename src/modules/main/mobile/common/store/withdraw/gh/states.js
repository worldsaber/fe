export default {
	reqLoading: false,

	currency: window.currency,

	bankList: [],						// bank list

	bankHistory: {},

	errorInfo: {},

	wdInfo: {},							// 提交给后台的数据，数据验证成功后才存储

	tradeId: '',

	wdSuccess: false,

	needAudit: false,

	bankLoadError: false
};
