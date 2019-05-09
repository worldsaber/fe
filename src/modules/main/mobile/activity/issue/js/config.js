import { numberMap } from 'base/js/utils';

const base = window.country || __baseUrl__.replace(/\//g, ''); // eslint-disable-line

export const rulers = [
	{
		text: 'Get 8 Correct Answers WIN The Prize Pool Together',
		img: require('../image/ruler1.png')
	},
	{
		text: 'Answer the 1st or the 5th question correctly, you will also get Gifts!',
		img: require('../image/ruler2.png')
	},
	{
		text: 'Select your answer within 15 seconds!',
		img: require('../image/ruler3.svg')
	},
	{
		text: 'Once you have selected an answer, you can no longer change it.',
		img: require('../image/ruler4.svg')
	},
	{
		text: 'Please, ensure that you are using a network with good connection.',
		img: require('../image/ruler5.png')
	},
	{
		text: 'If you are using a network with poor connection, it is possible that errors may occur.',
		img: require('../image/ruler6.svg')
	}
];

export const shareConfig = {
	ke: 'Prize Pool of 1,000,000! Join me in this Football Quiz ',
	ng: 'Prize Pool of 3,000,000! Join me in this Football Quiz '
};

const rulersUrl = {
	ke: '//www.sportybet.com/swdp/pagemaker/sportybet/ke/footballquzi_activityrules_ke/index.htm',
	ng: '//www.sportybet.com/swdp/pagemaker/sportybet/ng/footballquzi_activityrules_ng/index.htm'
};
const winnersUrl = {
	ke: '//www.sportybet.com/swdp/pagemaker/sportybet/ke/footballquiz_smartphone_winners_ke_0615/index.htm',
	ng: '//www.sportybet.com/swdp/pagemaker/sportybet/ng/footballquiz_smartphone_winners_ng_0615/index.htm'
};

const phone = { ...numberMap };

export function getPhone() {
	return phone[base];
}

export function getRulersUrl() {
	return rulersUrl[base];
}
export function getWinnersUrl() {
	return winnersUrl[base];
}
