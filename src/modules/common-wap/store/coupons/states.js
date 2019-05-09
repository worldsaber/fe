const errorInfo = window.loginStatus ?
	null :
{
	type: 'login'
};

const state = {
	// 红包数量
	couponsCount: 0,

	// 红包列表
	couponsList: [],

	// 红包分组列表，AB组未分离
	couponsGroupList: [],

	// 实际需要根据totalStake, 来分离出AB组红包
	realCouponsGroupList: [],

	// gitIds
	couponsKeys: [],

	loading: false,

	errorInfo,

	// checked coupons
	checkGifts: {},

	// bizType
	bizType: 1,

	// 设备渠道
	deviceCh: 3,

	// 当前投注类型 single , mutltiple, system, 如果是jackpo就认为是single模式
	betType: 1,

	// skip statue
	skipStausMap: {},

	// current chicked coupon
	chickedGiftId: '',

	// comfirm status
	comfirmError: false,
	// 是否收起红包列表，true表示收起
	isPack: true,
};

export default state;
