/*
system时，获取stake的名称
 */

export const stakeKeys = ['Singles', 'Doubles', 'Trebles'];

export function getStakeShowName(m) {
	return m < stakeKeys.length ? stakeKeys[m] : `${m + 1} Folds`;
}

export function getStakeIndex(name) {
	if (!name) {
		return 0;
	}
	const index = stakeKeys.indexOf(name);
	if (index !== -1) {
		return index + 1;
	}
	return parseInt(name, 10) || 0;
}

/*
投注项互斥组的色块
 */
// export const colorLump = ['#EBF0FE', '#E5F8CC', '#FFEBBC', '#CCEFFF', '#FAF6E2',
// 	'#FFD9BF', '#C6F6DE', '#FFBDCA', '#D0D2F3', '#F3DAFB', '#B2D2F7',
// 	'#DCDEE5', '#C6ECE3', '#C3FFC4', '#C1F7FD'];

export const colorLump = ['#9ad4ed', '#e5d588', '#c2ba94', '#c9948a', '#ed94a5',
	'#8692ac', '#de9ff2', '#91a8ab', '#88d0ef', '#9caeee', '#a6adc4',
	'#87d9c5', '#8bbf8c', '#c4c4c4', '#a09e79'];
