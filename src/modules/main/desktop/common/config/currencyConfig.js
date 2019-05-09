// export const adjoinCountry = [
// 	'ng'
// ];

// 显示大小的货币符号
const tempCurrency = window.currency || 'KES';
export const showCurrency = `${tempCurrency} `;
export function getShowCurrency() {
	// return adjoinCountry.includes(window.country) ?
	// 	showCurrency :
	// 	`${showCurrency} `;
	return showCurrency;
}

export const showCurrencyOrigin = tempCurrency;

export const currencyName = {
	ke: 'Shilling',
	ng: 'Naira',
	gh: 'Cedi'
};

export const currentCurrencyName = (() => currencyName[window.country || 'ke'])();
