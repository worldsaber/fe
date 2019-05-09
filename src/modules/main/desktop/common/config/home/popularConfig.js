import { pagePath, baseUrl } from 'config/pageConfig';

export const popularConfig = [ // eslint-disable-line
	{
		linkUrl: `${baseUrl}sport/football/today`,
		text: 'Today\'s Football'
	},
	{
		linkUrl: `${baseUrl}sport/football/sr:category:1/sr:tournament:17`,
		text: 'English Premier League'
	},
	{
		linkUrl: `${baseUrl}sport/football/upcoming`,
		text: 'Football in next 3 hours'
	},
	{
		linkUrl: pagePath.preBasketball,
		text: 'Basketball'
	},
	{
		linkUrl: pagePath.preTennis,
		text: 'Tennis'
	}
];
