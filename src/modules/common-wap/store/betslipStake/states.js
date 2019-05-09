import { showCurrency } from 'config/currencyConfig';

const sportsCfg = window.sportsCfg || {};
const bonusCfg = window.bonusCfg || {};

const state = {
	// 3种不同方式的stake，默认值为 50
	singleStake: {
		union: sportsCfg.min || '50'
	},
	multipleStake: sportsCfg.min || '50',
	systemStake: {
		union: sportsCfg.min || '50'
	},
	minStake: +sportsCfg.min || 50,
	maxStake: +sportsCfg.max || 500000,

	// bonus
	bonus: 0,

	// 货币类型
	currency: window.currency,
	// 显示的货币种类
	showCurrency,

	// odds 上限
	maxPotWin: sportsCfg.potWinMax || 10000000,
	// 最大bonus
	maxBonus: +bonusCfg.max || 1000000,
	// 订单信息- 生单成功后的展示
	orderInfo: null,

	// place bet loading 状态
	betLoading: false,

	// 算bonus时候赔率大于多少
	qualifyingOddsLimit: 1.2,

	// 加奖配置
	bonusRatios: [],

	oddsKey: '',
	// flexibet开关配置 0-可以flexiblebet，1-不支持Live，2-不许flexibleBet
	flexibetStatus: 0
};

export default state;
