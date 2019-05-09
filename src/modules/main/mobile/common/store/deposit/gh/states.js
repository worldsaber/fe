export default {
	reqLoading: false,

	currency: window.currency,

	depositType: 'paybill',				// 重置方式online、paybill

	bankList: [],						// bank list

	bankHistory: {},

	errorInfo: {},

	dpInfo: {}, 						// 存储成功页需要的数据

	tradeId: '',

	pageModule: 'index',

	bankLoadError: false,

	sysNotification: ''
};
