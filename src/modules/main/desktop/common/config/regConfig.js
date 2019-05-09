import { getShowCurrency } from 'config/currencyConfig';

const showCurrency = getShowCurrency();

const regSuccess = {
	ke: {
		main: '200% Karibu Gifts',
		desc: `on your 1st Deposit of ${showCurrency}50`
	},
	ng: {
		main: `Up to ${showCurrency}10,000 in Discount Gifts`,
		desc: '100% Return on your First Deposit!'
	},
	gh: {
		main: 'Up to 150% Discount Gifts',
		desc: 'on your First Deposit of min. GHS 1'
	}
};

// 成功页按钮是否显示的补充信息
const dpFeeConfig = {
	ke: '(0 Fee)',
	ng: '',
	gh: '(0 Fee)',
};

const country = window.country || 'ke';

export function getSucTips() {
	return regSuccess[country] || {};
}

export function getDpFee() {
	return dpFeeConfig[country] || '';
}
