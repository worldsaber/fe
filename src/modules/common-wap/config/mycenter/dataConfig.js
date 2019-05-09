/* 一下变量一旦确定需要更改成正确的，主要是个人中心模块的一些常量，集中在此方便修改 */
// 个人中心页面url
import { baseUrl, pagePath } from 'config/pageConfig';
import { getContactsNumber } from 'base/js/utils';

export const userCenterUrl = {
	deposit: `${pagePath.myCenter}/deposit`,
	withdraw: `${pagePath.myCenter}/withdraw`,
	transaction: `${pagePath.myCenter}/transactions`,
	reconciliation: `${pagePath.myCenter}/transactions/reconciliation`,
	sportOrder: `${pagePath.openbet}/bet_history`,
	jackpotOrder: `${pagePath.orderBase}/jackpot`,
	virtualOrder: '',
	gift: `${pagePath.myCenter}/gifts`,
	sportycoin: `${pagePath.myCenter}/sportycoins`,
	myAccountInfo: `${pagePath.myCenter}/my_account_info`,
	myCenterHome: pagePath.myCenter,  // 个人中心首页,
	forgetPassword: pagePath.resetPassword, // 忘记密码url
	promotion: `${baseUrl}promotions`,
	login: pagePath.login,  // 登录页面url
	message: `${baseUrl}message`, // 消息页
};

export const payBillNumber = '202202';

export const withdrawContactPhone = getContactsNumber();
