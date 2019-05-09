const errorInfo = window.loginStatus ?
	null : {
		type: 'login'
	};

const state = {
	// 红包数量
	couponsCount: 0,

	// 红包列表
	couponsList: [],

	// gitIds
	couponsKeys: [],

	loading: false,

	errorInfo,

	// checked coupons
	checkGifts: {},

	// bizType
	bizType: 1,

	// 设备渠道
	// deviceCh: 2,
	// 1.2新增： 1-android，2-web，3-wap，4-sms，5-lite
	deviceCh: [1, 2, 3],

	// 当前投注类型
	betType: 1,

	// 选中的红包是否可以使用
	couponunavailable: false,

	// skip statue
	skipStausMap: {},

	// current chicked coupon
	clickedGiftId: '',

	// comfirm status
	comfirmError: false,

	giftsTips: 'Use gifts to bet',

	disabledTips: '',

	giftsStatus: false
};

export default state;
