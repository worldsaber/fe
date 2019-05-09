import { pagePath, baseUrl } from 'config/pageConfig';
import { getContactsNumber } from 'base/js/utils';

const myCenter = `${baseUrl}my_accounts`;

export const userCenterConfig = {
	SportyCoins: `${myCenter}/sportycoins`,
	Gifts: `${myCenter}/gifts`,
	'Bet History': pagePath.sportOrder,
	'': '',  // 占坑，注释掉Message后，userCenter，userCenterUrl这个两个变量如果不占位同样角标取值会有问题
	// Message: `${myCenter}/message`,
	Deposit: `${myCenter}/deposit`,
	Withdraw: `${myCenter}/withdraw`,
	Transactions: `${myCenter}/transactions`,
	'My Account Info': `${myCenter}/my_account_info`
};

export const userCenter = Object.keys(userCenterConfig);

export const userCenterUrl = Object.values(userCenterConfig);

export const pushBetUrl = {
	sport: `${pagePath.sportOrder}?isSettled=1`,
	jackpot: `${pagePath.jackpotOrder}?isSettled=1`
};

export const jackPotBetHistory = pagePath.jackpotOrder;

// 账户冻结联系电话
export const withdrawContactPhone = getContactsNumber();

export const payBillNumber = '202202';
