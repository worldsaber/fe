// insert one bet item into betslips
export const ADD_BETSLIP_ITEM = 'addBetslipItem';

// delete one bet item according to key(event_sport_market_specifier)
export const DELETE_BETSLIP_ITEM = 'deleteBetslipItem';

// update one bet item according to push info
export const UPDATE_BETSLIP_ITEM = 'updateBetslipItem';

// accept changes
export const ACCEPT_BETSLIP_CHANGES = 'acceptBetslipChanges';

export const CHANGE_AUTO_ACCEPT_CHANGES = 'changeAutoAcceptChanges';

// clear all betslips
export const CLEAR_BETSLIP = 'clearBetslip';

// update type
export const UPDATE_BET_TYPE = 'updateBetType';

// update banker list
export const UPDATE_BANKERS = 'updateBankers';

// update betslip
export const UPDATE_BETSLIP = 'updateBetslip';
// 通过code加载betslip
export const LOAD_BETSLIP = 'loadBetslip';
// 切换加载状态
export const CHANGE_LOADING_STATUS = 'changeLoadingStatus';

// banker状态的切换
export const CHANGE_BANKER_STATUS = 'changeBankerStatus';

// 当选选择达到最大个数的时候发生
export const UPDATE_REACH_MAX_THRESHOLD = 'updateReachMaxThreshold';

// 如果当前是system并且选择达到最大system时候出发
export const UPDATE_REACH_CHANGE_MAX_SYSTEM_THRESHOLD = 'updateReachChangeMaxSystemThreshold';

// 是否接受超出限额的bet，多余的需删除
export const UPDATE_IS_ACCEPT_MORE = 'updateIsAcceptMore';

// 更新临时的bet outcomes
export const UPDATE_STAGE_BET_OUTCOMES = 'updateStageBetOutcomes';

export const UPDATE_FLEXIBET_NUM = 'updateFlexibetNum';

export const UPDATE_MULTIPLE_MODE = 'updateMultipleMode';

export const UPDATE_ODDS_BOOST_STATUS = 'updateOddsBoostStatus';

export const UPDATE_ODDS_BOOST_PERMISSION = 'updateOddsBoostPermission';

export const UPDATE_ODDS_BOOST_EVENTS = 'updateOddsBoostEvents';

export const UPDATE_FAST_MODE = 'updateFastMode';

export const UPDATE_PAY_MODE = 'updatePayMode';

export const FETCH_BESLIP_ADS = 'fetchBeslipAds';
