import invert from 'utils/invert';

export const bizType = {
	sport: 1,			// 真是体育
	virtual: 2,			// 虚拟体育
	jackpot: 3,			// Jackpot
	bingo: 4			// bingo
};

export const bizTypeValues = Object.values(bizType);

export const betType = {
	single: 1,
	multiple: 2,
	system: 3
};

export const betTypeValues = Object.values(betType);

export const betType2Key = (() => invert(betType))();

export const bizType2key = (() => invert(bizType))();
