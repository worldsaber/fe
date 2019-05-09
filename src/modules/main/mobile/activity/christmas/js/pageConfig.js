import { showCurrency } from 'config/currencyConfig';

export const country = window.country || 'ke';

const timeZoneCfg = {
	ke: 'GMT+3',
	ng: 'GMT+1',
	gh: 'GMT+0'
};

const moneyCfg = {
	ke: `${showCurrency}50`,
	ng: `${showCurrency}100`,
	gh: `${showCurrency}1`
};

const timeCfg = {
	ke: ['14:00', '19:00'],
	ng: ['12:00', '17:00'],
	gh: ['11:00', '16:00']
};

const curMoney = moneyCfg[country];

export const curTimeZone = timeZoneCfg[country];
export const actTime = timeCfg[country];

const bannerCfg = {
	ke: {
		'default': require('../image/banner_ke1.png'),
		special: require('../image/banner_ke2.png'),
	},
	ng: {
		'default': require('../image/banner_ng1.png'),
		special: require('../image/banner_ng2.png'),
	},
	gh: {
		'default': require('../image/banner_gh1.png'),
		special: require('../image/banner_gh2.png'),
	}
};

export const bannerImg = bannerCfg[country];

export const helpTips = [
	'Promotion Period: 17/12 to 25/12',
	`During 17/12-23/12, SportyBet will offer 100 Free Bets as Christmas Gifts to our customers everyday at ${actTime[1]} (${curTimeZone}). From 24/12 to 25/12, the prize will be doubled for Christmas and 200 Free Bets will be offered at ${actTime[0]} and ${actTime[1]} each round (${curTimeZone}). The first to click the "Grab" button will get the Free Bet!`,
	`All Free Bets (worth ${curMoney} each) obtained can be found in "Gifts", under "My Account".`,
	'Free Bets offered in this promotion are valid for 24 hours.',
	'Promotions and Gifts are created in order to reward our most valued customers. Under suspicion of fraud or abuse of this promotion by any customer, SportyBet reserves the right to remove Gifts and associated winnings from a given account or any associated accounts.'
	// 'In this promotion, SportyBet only allows one chance to award the offer per person/household address/email address/mobile number/debit/credit card number/IP address/device number. Duplicate accounts will be closed and will not qualify for this offer. Promotions and Gifts are created in order to reward our most valued customers. Under suspicion of fraud or abuse of this promotion by any customer, we reserve the right to remove Gifts and associated winnings from a given account or any associated accounts. SportyBet reserves the right to amend, cancel, reclaim or refuse any promotion at its own discretion.'
];
