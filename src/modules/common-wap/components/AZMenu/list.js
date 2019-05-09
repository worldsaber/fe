import { pagePath } from 'config/pageConfig';
import { userCenterUrl } from 'config/mycenter/dataConfig';

const topListUrl = [{
	name: 'Virtuals',
	url: pagePath.virtual,
	cls: 'm-virtual-icon'
}, {
	name: 'Jackpot',
	url: window.URL.addPara(pagePath.jackpot, { source: 'azmenu' }),
	cls: 'm-jackpot-icon'
}, {
	name: 'Livescore',
	url: pagePath.liveScore,
	cls: 'm-livescore-icon'
}, {
	name: 'Results',
	url: pagePath.liveResult,
	cls: 'm-result-icon'
}, {
	name: 'App',
	url: pagePath.downloadApp,
	cls: 'm-mobile-icon'
}].map(cur => {
	cur.url = window.URL.addPara(cur.url, { source: 'azmenu' });
	return cur;
});

const country = window.country;

// if (country !== 'ng') {
// 	topListUrl.splice(1, 0, {
// 		name: 'Jackpot',
// 		url: window.URL.addPara(pagePath.jackpot, { source: 'azmenu' }),
// 		cls: 'm-jackpot-icon'
// 	});
// }
if (window.country === 'ng') {
	topListUrl.splice(1, 0, {
		name: 'Load Code',
		url: window.URL.addPara(pagePath.loadCode, { source: 'azmenu' }),
		cls: 'm-load-code-icon'
	});
}
if (country === 'gh' || country === 'ke') {
	topListUrl.push({
		name: 'Load Code',
		url: window.URL.addPara(pagePath.loadCode, { source: 'azmenu' }),
		cls: 'm-load-code-icon'
	});
}

const userList = [{
	name: 'Deposit',
	url: userCenterUrl.deposit
}, {
	name: 'Withdraw',
	url: userCenterUrl.withdraw
}, {
	name: 'Transactions',
	url: userCenterUrl.transaction
}, {
	name: 'Sports Bet History',
	url: userCenterUrl.sportOrder
}, {
	name: 'Jackpot Bet History',
	url: userCenterUrl.jackpotOrder
}, {
	name: 'Shop',
	url: pagePath.shop
}].map(cur => {
	cur.url = window.URL.addPara(cur.url, { source: 'azmenu' });
	return cur;
});
// // 尼日无jackpot订单
// if (country === 'ng') {
// 	userList.splice(4, 1);
// }

export {
	topListUrl,
	userList
};
