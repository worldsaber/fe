import { currentCurrencyName } from 'config/currencyConfig';

export const tabConfig = [
	{
		name: 'SportyCoins',
		key: 'coins'
	}, {
		name: 'History',
		key: 'history'
	}, {
		name: 'How To Use',
		key: 'guide'
	}
];

export const transTab = [
	{
		name: 'SportyCoins',
		key: 0
	}, {
		name: 'Settled Stake',
		key: 1
	}
];

export const descRulers = [
	'SportyCoins can be used for “Real Sports” Betting (Singles or Multiples), but cannot be used for “Virtuals”, Sporty Bingo, Roulette or any other games.',
	'SportyCoins can be withdrawn once the requirements of each promotion are completed.',
	'Only SportyCoins from the same promotion can be hold to at a time. To claim SportyCoins from different promotions, SportyCoins from a previous promotion will have to be given up.',
	'All SportyCoins have an expiry date. All requirements must be completed before that date, otherwise, the number of owned SportyCoins for that promotion will be reset to 0 and the customer won’t be able to take part in the same challenge.',
	'SportyBet may reclaim any SportyCoins amount or increased payments that have been wrongly awarded.',
	'All customer offers are limited to one per person. If SportyBet has reasonable grounds to suspect that the bonus or offer is being claimed by or for the benefit of the same person more than once, or by a group of people, then it may withdraw the availability of any offer or all offers to that customer or group of customers and/or void any bet funded by the bonus or offer and remove any winnings from such bet.',
	'SportyBet may, at any time, make minor amendments to this promotion to correct typographical errors or to improve on clarity or customer experience and may cancel this promotion for legal or regulatory reasons.'
];

export function getShowCoinTip(count) {
	return {
		main: `Complete the ${count > 1 ? 'challenges' : 'challenge'}`,
		desc: `to convert your SportyCoins to ${currentCurrencyName}`
	};
}

export const stakeReqDesc = {
	title: 'Settled Stakes Required',
	infos: [
		'Continue adding up to the required sum of settled stakes of the Challenges to meet the requirements and get rewards.'
	]
};

export const coinsReqDesc = {
	title: 'SportyCoins Required',
	infos: [
		'SportyCoins are profit! Place bets using SportyCoins and complete the turnover challenges.',
		'The following are the conditions for SportyCoins usage:'
	]
};

export const useTips = [
	{
		txt: 'Gain SportyCoins through different SportyBet promotions. ',
		img: require('../img/use1.png')
	},
	{
		txt: 'Choose SportyCoins or Balance to place bet in your betslip.',
		img: require('../img/use2.png')
	},
	{
		txt: 'Complete the Challenges to convert your SportyCoins to Real money.',
		img: require('../img/use3.png')
	}
];
