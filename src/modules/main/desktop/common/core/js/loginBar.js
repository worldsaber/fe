import md5 from 'blueimp-md5';
import { cookie } from 'storage';
import { formatNumber } from 'utils';

import { EventBus } from 'kernel/js/eventBus.js';
import commonEvent from 'config/eventConfig/commonEvent';
import { pagePath } from 'config/pageConfig';
import { getShowCurrency } from 'config/currencyConfig';

import '../../../mockData/user/account?debug';
import '../../../mockData/user/logout?debug';
import '../../../mockData/loginRegister/login?debug';

/*
获取用户账号余额
 */
export function getbalance() {
	return new Promise((resolve, reject) => {
		let showVal = '- - -',
			coins = 0;

		fetch('/pocket/v1/finAccs/finAcc/userBal/' + window.currency, {
			method: 'GET'
		})
		.then(res => res.json())
		.then(data => {
			const code = data.bizCode,
				originData = data.data || {};

			if (code === 10000) {
				(typeof originData.avlBal === 'number') && (showVal = +originData.avlBal / 10000);
				(typeof originData.avlCoins === 'number') && (coins = +originData.avlCoins / 10000);

				EventBus.$emit(commonEvent.SYNC_ACCOUNT_BALANCE, {
					balance: showVal,
					coins,
					updateLet: 'userInfo'
				});
			}

			resolve({
				showVal,
				coins
			});
		})
		.catch(() => {
			resolve({
				showVal,
				coins
			});
		});
	});
}

/*
登录
 */
export function commitLogin(phone, psd) {
	return new Promise((resolve, reject) => {
		fetch('/patron/accessToken', {
			method: 'POST',
			body: {
				username: phone,
				password: md5(psd)
			}
		})
		.then(res => res.json())
		.then(data => {
			const code = data.bizCode,
				originData = data.data || {};

			if (code === 10000 && originData) {
				cookie('phone', phone, {
					path: '/',
					expires: 365
				});
				// // 广播登陆全局消息
				EventBus.$emit(commonEvent.UPDATE_LOGIN_STATUS);
				window.loginStatus = true;
				resolve({ login: true });
			} else {
				reject({
					code,
					msg: data.message || 'No internet connection, try again.'
				});
			}
		})
		.catch(() => {
			reject({
				msg: 'No internet connection, try again.'
			});
		});
	});
}

/*
facebook login
 */
export function thirdPartyLogin(fbToken) {
	return new Promise((resolve, reject) => {
		fetch('/patron/account/thirdParty', {
			method: 'POST',
			body: {
				thirdPartyToken: fbToken || cookie('fbToken')
			}
		})
		.then(res => res.json())
		.then(ret => {
			const code = ret.bizCode,
				originData = ret.data || {};

			if (code !== 19999) {
				// 从 cookies中删除fbToken
				cookie('fbToken', null, {
					path: '/'
				});
			}

			if (code === 10000) {
				//  登录成功
				cookie('phone', originData.phone || '', {
					path: '/',
					expires: 365
				});

				// // 更新登录状态
				window.loginStatus = true;

				// // 广播登陆全局消息
				EventBus.$emit(commonEvent.UPDATE_LOGIN_STATUS);
				resolve({
					login: true
				});
			}

			// 未绑定手机号码
			if (code === 11608 && originData.token) {
				location.href = pagePath.fbLogin;
				cookie('lgToken', originData.token || '', {
					path: '/',
					expires: 1
				});
			}
		})
		.catch(() => {
			// 从 cookies中删除fbToken
			cookie('fbToken', null, {
				path: '/'
			});
			reject();
		});
	});
}
/*
退出
 */
export function commitLogout() {
	fetch('/patron/accessToken/delete', {
		method: 'DELETE'
	}).then(res => res.json()).then(data => {
		const code = data.bizCode;

		if (code === 10000) {
			location.href = pagePath.home;
		}
	});
}

export function getShowBalance(isShow) {
	let showVal = +window.userBalance;

	if (isShow) {
		if (typeof showVal === 'number' && !isNaN(showVal)) {
			// 0 显示成0.00
			showVal = getShowCurrency() + formatNumber(showVal, 2);
		} else {
			// 取不到余额显示成空
			showVal = '---';
		}
		return showVal;
	}

	return getShowCurrency() + '**** ';
}
