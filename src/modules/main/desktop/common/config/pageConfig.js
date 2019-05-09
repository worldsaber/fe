export const baseUrl = __baseUrl__; // eslint-disable-line

export const wapBaseUrl = `${__baseUrl__}m/`; // eslint-disable-line

export const baseUrlFix = baseUrl.slice(0, baseUrl.length - 1);

export const domain = location.hostname || location.host;

export const protocol = location.protocol;

const country = window.country;

export const pagePath = {
	// 首页
	home: baseUrl,
	wapHome: wapBaseUrl,

	// 下载链接
	download: `${baseUrl}mobile`,
	downloadApp: `/api${baseUrl}common/config/latestDownload/android`,
	downloadShort: `http://sporty.bet/${country}app`,
	// ng版短连接
	downloadNgShort: 'http://sporty.bet/ngapp',
	downloadGhShort: 'http://sporty.bet/ghapp',
	// prematch 默认列表页
	preFootball: `${baseUrl}sport/football/`,
	preBasketball: `${baseUrl}sport/basketball/`,
	preTennis: `${baseUrl}sport/tennis/`,
	preRugby: `${baseUrl}sport/rugby/`,
	preCricket: `${baseUrl}sport/cricket/`,

	// 登录注册
	login: `${baseUrl}registration?type=login`,
	register: `${baseUrl}registration?type=register`,
	fbLogin: `${baseUrl}registration/facebook`,
	resetPassword: `${baseUrl}profile/reset_password`,
	wapLogin: `${wapBaseUrl}independent_login`,

	// 帮助页面
	help: `${baseUrl}help`,

	// order
	orderBase: `${baseUrl}my_accounts/bet_history`,
	sportOrder: `${baseUrl}my_accounts/bet_history/sport_bets`,
	jackpotOrder: `${baseUrl}my_accounts/bet_history/jackpot`,

	// jackPot
	jackpot: `${baseUrl}jackpot`,
	jackpotResult: `${baseUrl}jackpot/result`,

	// live
	live: `${baseUrl}sport/live/`,

	// virtual
	virtual: `${baseUrl}virtual`,
	transaction: `${baseUrl}my_accounts/transactions`,
	withdraw: `${baseUrl}my_accounts/withdraw`
};
