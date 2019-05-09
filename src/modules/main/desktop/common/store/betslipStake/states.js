import { getShowCurrency, showCurrencyOrigin } from 'config/currencyConfig';

const sportsCfg = window.sportsCfg || {};
const currency = window.currency || 'KES';
const showCurrency = showCurrencyOrigin;

const state = {
	// stake
	singleStake: '',
	multipleStake: '',
	systemStake: {
		union: ''
	},
	minStake: +sportsCfg.min || 50,
	maxStake: +sportsCfg.max || 500000,

	// 货币类型
	currency,
	showCurrency: getShowCurrency(),
	showCurrencyFix: showCurrency,

	// odds 上限
	// 12/22 从10000000改成1000000
	// 改成动态配置
	maxPotWin: sportsCfg.potWinMax || 1000000,
	// 订单信息
	orderInfo: null,

	// 生单相关错误信息
	errorInfo: null,

	// place bet loading 状态
	betLoading: false
};

export default state;
