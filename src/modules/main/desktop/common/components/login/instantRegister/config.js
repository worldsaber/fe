import { getShowCurrency } from 'config/currencyConfig';

const showCurrency = getShowCurrency();

const tips = {
	ke: `First Deposit up to ${showCurrency}1,000 return as KARIBU GIFTS`,
	ng: `Up to ${showCurrency}10,000 in Discount Gifts`,
	gh: 'First Deposit Return up to 150% as Discount Gifts'
};

export const getTips = (() => { // eslint-disable-line
	const country = window.country || `${__baseUrl__.replace(/\//g, '')}`; // eslint-disable-line

	return tips[country];
})();
