export default {
	reqLoading: false,

	currentTab: 'coins',

	curTransTab: 0,

	errorInfo: {},

	historyList: [
		// {
		// 	activityId: 1234567,
		// 	currentCoins: 12340000,
		// 	showCoins: '1,234.00',
		// 	predefinedExpireTime: 1538981287067,
		// 	status: 4,
		// 	finalAmount: 2345000,
		// 	showBalance: '2,345.00',
		// 	isSuc: true,
		// 	showTitle: 'Succeeded!',
		// 	prompt: 'SportyCoins have been transferred to your balance.',
		// 	banner: {
		// 		bgUrl: '//s.sporty.net/ke/main/modules/main/desktop/common/components/adBar/gh.jpg',
		// 		title: 'Crazy Week for New Customer',
		// 		promotion: 'KES 100',
		// 		activityUrl: '/ke/sport/football/today',
		// 	}
		// }
	],

	coinsTransInfo: [
		// {
		// 	status: 4,
		// 	createTime: 1538981287067,
		// 	showAmount: '1,234.00',
		// 	amount: 12340000,
		// 	orderId: '',
		// 	activityId: 2345678,
		// 	type: 0,
		// 	amountSign: '√',
		// 	prompt: 'Auto Transferred to Balance',
		// 	showCreateTime: '08/10/18 14:48'
		// },
		// {
		// 	status: 3,
		// 	createTime: 1538981287067,
		// 	showAmount: '1,234.00',
		// 	amount: 12340000,
		// 	orderId: '',
		// 	activityId: 2345678,
		// 	type: 0,
		// 	amountSign: '+',
		// 	prompt: 'Return to SportyCoins',
		// 	showCreateTime: '08/10/18 14:48'
		// },
		// {
		// 	status: 2,
		// 	createTime: 1538981287067,
		// 	showAmount: '1,234.00',
		// 	amount: 12340000,
		// 	orderId: '12345678',
		// 	activityId: 2345678,
		// 	type: 0,
		// 	amountSign: '-',
		// 	prompt: 'Bet with SportyCoins',
		// 	showCreateTime: '08/10/18 14:48'
		// },
		// {
		// 	status: 1,
		// 	createTime: 1538981287067,
		// 	showAmount: '1,234.00',
		// 	amount: 12340000,
		// 	orderId: '',
		// 	activityId: 2345678,
		// 	type: 0,
		// 	amountSign: '+',
		// 	prompt: 'Claimed',
		// 	showCreateTime: '08/10/18 14:48'
		// }
	],

	coinsInfo: {},

	// 当前页的index
	pageIndex: 1,

	// 分页配置pageSize
	pageSize: 10,

	totalRecords: 0
};
