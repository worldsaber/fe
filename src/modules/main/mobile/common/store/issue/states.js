import { showCurrencyOrigin } from 'config/currencyConfig';

const state = {
	country: window.country,

	showCurrencyOrigin,

	isLogin: window.loginStatus,

	/*
	首页答题状态
	1: onGoing(进行中)
	2: coming soon
	3: 开始时间（DD/MM hh:mm）,
	4: timer (10分钟之内)
	5： 结束
	 */
	homeStatus: 2,

	/*
	当前页面name
	home、答题页面、结果页面(result)、rulers
	 */
	pageModule: 'home',

	/*
	首页使用的基本信息
	 */
	baseInfo: {
		// startTime: Date.now() + 610000,
		// prizeAmount: 1234567,
		// showPrizeAmount: '1,234,567',
		// userTotalPrize: 2000,
		// showTotalPrize: '2,000',
		// theme: 'Next Round Theme',
		// periodNumber: '2014 World Cup'
	},
	/*
	补偿时间
	*/
	deltaTime: 0,

	/*
	请求状态
	 */
	reqLoading: false,

	/*
	time config
	 */
	timeConfig: {},
	/*
	题目数量
	 */
	subjectSize: 0,

	/*
	是否显示share 栏
	 */
	showShareBar: false,

	/*
	参与人数
	 */
	participantsCount: 0,

	/*
	是否为观战模式
	 */
	isSpectator: false,
	/*
	本局当前获得的红包数
	*/
	gift: 0,
	/*
	国家热度
	*/
	heatObj: {
		// home: 0
		// away: 0
	},
	alreayJoin: false,

	hasFinish: false,
	/* 音乐播放状态*/
	musicStatus: false,

	hasRefreshLoginStatus: false,
	// 本轮可用的复活数
	currentPeriodLives: 0,
	totalLives: 0,
	baseLives: 0,
	adConfig: {}, // 答题广告页
	smartPhoneUrl: '', // 大奖结果j链接
};
export default state;
