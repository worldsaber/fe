/*
与组件功能无关, 业务事件
*/

export default {
	// 更新登录状态
	UPDATE_LOGIN_STATUS: 'updateLoginStatus',

	// 仅用于更新注册流程中的登录状态
	SAVE_LOGIN_STATUS: 'saveLoginStatus',

	// 更新账号
	UPDATE_ACCOUNT: 'updateAccount',

	// 刷新账号余额
	UPDATE_ACCOUNT_BALANCE: 'updateAccountBalance',

	// 比赛不可玩儿
	UPDATE_EVENT_BETABLE: 'updateEventBetable',

	// 弹窗登录back健被点击
	UPDATE_POP_LOGIN_BACK: 'updatePopLoginBack',
};
