export default {
	reqLoading: false,

	depositType: 'card',				// 重置方式card、bank、phone
	currency: window.currency,

	bankList: [],						// bank list
	bankHistoryList: [],				// 历史bank充值列表
	cardHistoryList: [],				// 历史card充值列表
	depositRet: {},						// 重置结果
	errorInfo: {},

	// 存储成功页需要的数据
	dpInfo: {},

	tradeId: '',

	dpSuccess: false,

	verifyType: '',

	bankLoadError: false,

	displayMsg: '' // 后台验证信息展示文案
};
