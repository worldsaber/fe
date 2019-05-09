const country = window.country;
const downloadAppUrls = [`/swdp/pagemaker/sportybet${__baseUrl__}sportybet-app/index.htm`, '/swdp/pagemaker/sportybet/ng/sportybet-ng-app/index.htm', '/swdp/pagemaker/sportybet/gh/sportybet-gh/index.htm'];
export const baseUrlFix = `${__baseUrl__}m`; // eslint-disable-line

export const baseUrl = `${baseUrlFix}/`;

export const domain = location.hostname || location.host;

export const protocol = location.protocol;
export const pagePath = {
	// 首页
	home: baseUrl,

	// search
	search: `${baseUrl}search`,

	// 首页 load code， 当前只有ng有此页面
	loadCode: `${baseUrl}load_code`,

	// 下载链接
	downloadApp: downloadAppUrls[['ke', 'ng', 'gh'].findIndex(cur => cur === country) || 0],
	// 下载参数请在应用处添加， 如 `${pagePath.reDownloadApp}?channel=wap`
	reDownloadApp: `/api${__baseUrl__}common/config/latestDownload/android`,
	// prematch 默认列表页
	preFootball: `${baseUrl}sport/football/`,
	preBasketball: `${baseUrl}sport/basketball/`,
	preTennis: `${baseUrl}sport/tennis/`,
	preRugby: `${baseUrl}sport/rugby/`,
	preCricket: `${baseUrl}sport/cricket/`,
	preVolleyball: `${baseUrl}sport/volleyball/`,
	preIceHockey: `${baseUrl}sport/iceHockey/`,
	preHandball: `${baseUrl}sport/handball/`,
	preDarts: `${baseUrl}sport/darts/`,
	preBeachVolley: `${baseUrl}sport/beachVolley/`,

	// sports
	sports: `${baseUrl}sports`,
	// live
	liveList: `${baseUrl}sport/football/live_list/`,
	live: `${baseUrl}sport/football/live/`,

	// 虚拟体育
	virtual: `${baseUrl}virtual`,

	// live
	liveHome: `${baseUrl}sport/live`,

	// score
	liveScore: 'https://livescore.sportybet.com/',

	// live Results
	liveResult: `${baseUrl}liveResult`,

	// Cashout
	cashout: `${baseUrl}cashout`,

	// openbet
	openbet: `${baseUrl}my_accounts/open_bets`,

	// orderBase
	orderBase: `${baseUrl}my_accounts/bet_history`,

	// myCenter
	myCenter: `${baseUrl}my_accounts`,
	promotions: `${baseUrl}promotions`,
	// 登录注册
	login: `${baseUrl}independent_login`,
	// fbLogin: `${baseUrl}registration/facebook`,
	resetPassword: `${baseUrl}forget_password`,

	// 帮助页面
	help: `${baseUrl}help`,

	contactUs: `${baseUrl}help?showChat=1#/contact-us`,

	// jackPot
	jackpot: `${baseUrl}jackpot`,
	jackpotResult: `${baseUrl}jackpot/result`,
	// sports: `${baseUrl}sports`,
	redeem: `${baseUrl}my_accounts/gifts/redeem`,
	gifts: `${baseUrl}my_accounts/gifts`,
	manualCheck: `${baseUrl}my_accounts/transactions/reconciliation`,

	// sportybingo
	sportybingo: `${baseUrl}sportybingo`,
	games: `${baseUrl}games`,
	roulette: `${baseUrl}games/roulette`,
	dicebattle: `${baseUrl}games/dicebattle`,
	luckypoker: `${baseUrl}games/luckypoker`,
	// best odds 比赛列表
	bestOdds: `${baseUrl}best_odds`,

	shop: `${baseUrl}shop`,

	// 评论详情页
	commentDetails: `${baseUrl}comment_details`,
	transaction: `${baseUrl}my_accounts/transactions`,
	withdraw: `${baseUrl}my_accounts/withdraw`
};

// 通过 sportId 获取 几种 sport 相关 pagePath
export const sportPageById = {
	'sr:sport:1': pagePath.preFootball,
	'sr:sport:2': pagePath.preBasketball,
	'sr:sport:5': pagePath.preTennis,
	'sr:sport:12': pagePath.preRugby,
	'sr:sport:21': pagePath.preCricket,
	'sr:sport:23': pagePath.preVolleyball,
	'sr:sport:4': pagePath.preIceHockey,
	'sr:sport:6': pagePath.preHandball,
	'sr:sport:22': pagePath.preDarts,
	'sr:sport:34': pagePath.preBeachVolley
};

const thirdPartyUrl4ke = {
	facebook: 'https://www.facebook.com/sportybetke',
	twitter: 'https://twitter.com/sportybetke',
	instagram: 'https://www.instagram.com/sportybetke'
};

const thirdPartyUrl4ng = {
	facebook: 'https://www.facebook.com/sportybetng',
	twitter: 'https://twitter.com/sportybetng',
	instagram: 'https://www.instagram.com/sportybetng'
};

const thirdPartyUrl4gh = {
	facebook: 'https://www.facebook.com/sportybetgh',
	twitter: 'https://twitter.com/sportybetgh',
	instagram: 'https://www.instagram.com/sportybetgh'
};

export const thirdPartyUrl = (() => {
	const country = window.country || `${__baseUrl__.replace(/\//g, '')}`; // eslint-disable-line

	switch (country) {
	case 'ke':
		return thirdPartyUrl4ke;
	case 'ng':
		return thirdPartyUrl4ng;
	case 'gh':
		return thirdPartyUrl4gh;
	default:
	}
})();
