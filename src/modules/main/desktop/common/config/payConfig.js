// balance: 1, coins: 2
export const payMethodConfig = [
	{
		key: 1,
		value: 'SportyCoins',
		showConfirmTxt: 'SportyCoins'
	}, {
		key: 0,
		value: 'Balance',
		showConfirmTxt: ''
	}
];

export const payConfirmTxt = (() => {
	const ret = {};
	for (const item of payMethodConfig) {
		ret[item.key] = item.showConfirmTxt;
	}

	return ret;
})();

export const payText = key => {
	for (const item of payMethodConfig) {
		if (item.key === +key) {
			return item.value;
		}
	}

	return '';
};
