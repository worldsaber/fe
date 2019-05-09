/*
与组件功能无关, 业务事件
*/

export default {
	// betslips相关
	DELETE_BET_SLIPS_ITEM: 'delete-betslips-item',					// 取消一个投注项
	RESET_BET_SLIPS: 'resetBetslips', 								// reset outcome checked status
	NOTIFY_BETSLIPS_CHANGE: 'notifyBetSlipsChange',					// betslips向外提供的同步localstorage的接口
	NOTIFY_REACH_TRESHOLD: 'notifyReachTheshold',					// 达到betslip的上限
	NOTIFY_BET_COUNT: 'notifyBetCount',								// betslip selection counts

	// 更新登录状态
	UPDATE_LOGIN_STATUS: 'updateLoginStatus',

	// 更新账号
	UPDATE_ACCOUNT: 'updateAccount',

	// 刷新账号余额
	UPDATE_ACCOUNT_BALANCE: 'updateAccountBalance',

	// 同步账号余额
	SYNC_ACCOUNT_BALANCE: 'syncAccountBalance',

	// 比赛不可玩儿
	UPDATE_EVENT_BETABLE: 'updateEventBetable',

	// 账号提示信息状态变化
	UPDATE_BALANCE_STATUS: 'updateBalanceStatus',

	// 红包数量
	UPDATE_GIFTS: 'updateGifts',

	// 提现相关
	NOTIFY_CLEAR_AMOUNT: 'notifyClearAmount'
};
