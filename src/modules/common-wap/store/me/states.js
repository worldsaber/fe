const state = {
	// 账户余额 实际值，也就是后台接口返回的balance／10000得到的值
	// 跟/pocket/v1/finAccs/finAcc/userBal（这个接口比后去资产信息接口性能高）这个接口获取到的 avlBal（可用余额）是一样的，后台同学说这个
	balance: 0,
	// 头像url
	avatar: '',
	// 手机号码
	phone: '',
	// 红包数量
	giftNum: 0,
	// 红包金额
	giftAmount: 0,
	// message number
	msgNum: 0,

	firstName: '',

	lastName: '',
	// yyyyMMdd
	birthday: '',
	// 1：男， 2：女
	gender: 0,

	email: '',
	nickname: '',
	// 是否登录， me页无论登录与否都可以访问
	isLogin: false
};

export default state;
