import { showCurrency } from 'config/currencyConfig';

// update PageData
export const UPDATE_BANNER = 'updateBanner';

// update gameSize
export const UPDATE_GAME_SIZE = 'updateGameSize';

// update betting Period data
export const UPDATE_PERIOD_DATA = 'updatePeriodData';

// update result Period list
export const UPDATE_RESULT_PERIODS = 'updateResultPeriods';

// update index result Period detail
export const UPDATE_PREVIOUS_DETAIL = 'updatePreviousDetail';

// update Selected item list
export const UPDATE_SELECTIONS = 'updateSelections';
// set order result
export const SET_ORDER_DATA = 'setOrderData';

// update Selected all match number
export const UPDATE_SELECT_NUM = 'updateSelectNum';

export const UPDATE_BET_TATUS = 'updateBetTatus';

export const CHANGE_LOGIN_STATUS = 'changeLoginStatus';

export const CURRENCY = window.currency || 'KES';
export const SHOW_CURRENCY = showCurrency;
export const MINBET = +window.jackpotCfg.min || 50;
