/*
	首页顶级导航
	注：区分国家，部分导航顺序不同，修改后注意验证
 */
import { pagePath } from 'config/pageConfig';
import sportsConfig from 'config/sports';

// const worldCup = {
// 	cls: 'm-world-cup',
// 	text: 'World Cup',
// 	linkUrl: `${baseUrl}sport/football/sr:category:4/sr:tournament:16?sort=2&source=home`
// };

// 所有用到的导航信息
const list = {
	// Sports 使用 football 的icon
	sports: {
		cls: sportsConfig.football.icon,
		text: 'Sports',
		linkUrl: `${pagePath.sports}?source=home`
	},
	live: {
		cls: 'm-live-icon',
		text: 'Live',
		linkUrl: `${pagePath.liveList}?source=home`
	},
	games: {
		cls: 'm-games-icon',
		text: 'Games',
		linkUrl: `${pagePath.games}?source=home`
	},
	virtuals: {
		cls: 'm-virtual-icon',
		text: 'Virtuals',
		linkUrl: `${pagePath.virtual}?source=home`
	},
	sportyBingo: {
		cls: 'm-bingo-icon',
		text: 'SportyBingo ',
		linkUrl: `${pagePath.sportybingo}?source=home`
	},
	loadCode: {
		cls: 'm-load-code-icon',
		text: 'Load Code',
		linkUrl: `${pagePath.loadCode}?source=home`
	},
	jackpot: {
		cls: 'm-jackpot-icon',
		text: 'Jackpot',
		linkUrl: `${pagePath.jackpot}?source=home`
	},
	shop: {
		cls: 'm-shop-icon',
		text: 'Shop',
		linkUrl: `${pagePath.shop}?source=home`
	},
	liveScore: {
		cls: 'm-livescore-icon',
		text: 'Livescore',
		linkUrl: `${pagePath.liveScore}?source=home`
	},
	results: {
		cls: 'm-result-icon',
		text: 'Results',
		linkUrl: `${pagePath.liveResult}?source=home`
	}
};

// 给 list 添加各种 sport 属性
Object.entries(sportsConfig).forEach(([key, value]) => {
	list[key] = {
		cls: value.icon,
		text: value.text,
		linkUrl: `${pagePath.sports}?sport=${key}&source=home`
	};
});

const countryNavs = {
	ke: [
		'sports',
		'live',
		'games',
		'virtuals',
		'sportyBingo',
		'jackpot',
		'shop',
		'loadCode',
		'liveScore',
		'results',
		'basketball',
		'tennis',
		'rugby',
		'cricket',
		'volleyball',
		'iceHockey',
		'handball',
		'darts',
		'beachVolley'
	].map(nav => list[nav]),

	ng: [
		'sports',
		'live',
		'games',
		'virtuals',
		'sportyBingo',
		'jackpot',
		'shop',
		'loadCode',
		'liveScore',
		'results',
		'basketball',
		'tennis',
		'rugby',
		'cricket',
		'volleyball',
		'iceHockey',
		'handball',
		'darts',
		'beachVolley'
	].map(nav => list[nav]),

	gh: [
		'sports',
		'live',
		'games',
		'virtuals',
		'jackpot',
		'shop',
		'loadCode',
		'liveScore',
		'results',
		'basketball',
		'tennis',
		'rugby',
		'cricket',
		'volleyball',
		'iceHockey',
		'handball',
		'darts',
		'beachVolley'
	].map(nav => list[nav])
};

const country = window.country || 'ke';

export default countryNavs[country];
