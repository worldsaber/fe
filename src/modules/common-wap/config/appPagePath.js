export const appPath = {
	// 红包列表
	gifts: 'sportybet://gifts',

	// 真实体育订单列表
	orders: 'sportybet://orders',

	// Jackpot订单列表
	jackpotOrders: 'sportybet://jackpotOrders',

	// 充值
	deposit: 'sportybet://deposit',

	// 首页
	home: 'sportybet://home',

	// events
	events: 'sportybet://events',

	// Live列表
	live: 'sportybet://live',

	// login
	login: 'sportybet://login',

	// shop
	shop: 'sportybet://shop',
	// withdraw
	withdraw: 'sportybet://withdraw',
	// 交易列表页
	transaction: 'sportybet://trans',
};

/*
 赛事详情
 eventId: sr:match:13805545 或者 13805545
 */
export function jmpEventDetail(eventId, isLive) {
	if (!eventId) {
		throw error('eventId is required');
	}

	eventId = eventId.startsWith('sr:match:') ? eventId : `sr:match:${eventId}`;

	if (isLive) {
		return `sportybet://event?eventId=${eventId}&live=1`;
	}

	return `sportybet://event?eventId=${eventId}`;
}

/*
 prematch列表页
sportId：sr:sport:5 后者 5
timeline字段：-1表示today，0传表示all
 */
export function jmpPrematchList(sportId, timeline) {
	if (!sportId) {
		throw error('sportId is required');
	}

	sportId = sportId.startsWith('sr:sport:') ? sportId : `sr:sport:${sportId}`;

	return `sportybet://events?sportId=${sportId}` + (timeline ? `&timeline=${timeline}` : '');
}

/*
tournament列表
sportId：sr:sport:5 或者 5
tournamentId: sr:tournament:17 或者 17
 */
export function getTournamentList(sportId, ...tournaments) {
	if (!sportId || !tournaments || !tournaments.length) {
		throw error('sportId is required');
	}

	let tournamentStr = '';
	for (let item of tournaments) {
		item = item.startsWith('sr:tournament:') ? item : `sr:tournament:${item}`;
		tournamentStr += tournamentStr ? `,tournamentId=${item}` : `tournamentId=${item}`;
	}

	sportId = sportId.startsWith('sr:sport:') ? sportId : `sr:sport:${sportId}`;

	return `sportybet://tournament?sportId=${sportId}&tournamentId=${tournamentStr}`;
}
