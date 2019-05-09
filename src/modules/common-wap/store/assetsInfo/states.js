const state = {
	// 账户余额 实际值，也就是后台接口返回的balance／10000得到的值
	// 跟/pocket/v1/finAccs/finAcc/userBal（这个接口比后去资产信息接口性能高）这个接口获取到的 avlBal（可用余额）是一样的，后台同学说这个
	balance: 0,
	coin: 0, // sportyCoin数量
	// 红包数量
	giftNum: 0,
	giftAmount: 0,
	auditStatus: '', // withdraw block 状态 11: to be verify, 12: blocked, 13: failed
	// 是否登录， me页无论登录与否都可以访问
	isLogin: !!window.loginStatus,
	isLoading: true
};

export default state;
