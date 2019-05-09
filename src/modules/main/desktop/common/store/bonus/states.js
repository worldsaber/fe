const bonusCfg = window.bonusCfg || {};
const state = {
	bonusConf: {},

	// 暂时不用
	planId: '',

	oddsLimit: 0,

	// bonus 上限
	maxBonus: +bonusCfg.max || 1000000,

	// 暂时不用
	superposePolicy: 1,			// 叠加策略（1-累加，2-取最高
};

export default state;
