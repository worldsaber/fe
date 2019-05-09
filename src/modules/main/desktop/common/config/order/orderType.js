export const orderTypeMap = {
	sports: 'sport bets',
	jackpot: 'jackpot'
	// virtual: 'virtual'
};

// const country = window.country || 'ke';

// 如果是尼日，则不能有jackpot
// if (country !== 'ng') {
// 	orderTypeMap.jackpot = 'jackpot';
// }

export const orderType = Object.keys(orderTypeMap);
