import {
	pagePath
} from 'config/pageConfig';
import dialog from 'components/dialog';
import { goHome, goShop } from 'appCore/util';

export function parseQuery(search) {
	let temp = search;
	const map = {};
	if (search.indexOf('?') === 0) {
		temp = search.slice(1);
	}
	const splits = temp.split('&');
	for (const fragment of splits) {
		const arr = fragment.split('=');
		// 成对模式
		if (arr.length === 2) {
			const key = arr[0];
			const value = arr[1];
			// 已存在
			if (Object.hasOwnProperty.call(map, key)) {
				const old = map[key];
				// []
				if (Array.isArray(old)) {
					map[key] = old.push(value);
				} else {
					map[key] = [old, value];
				}
			} else {
				map[key] = value;
			}
		}
	}
	return map;
}
export function shopDialog() {
	// 不具备首充资格
	dialog({
		title: `You have got ${window.country === 'ke' ? 'Karubi' : 'Welcome'} Gifts`,
		content: 'Check discounts in our Shop that saves your money!',
		css: 'm-fm-dialog-first-deposit',
		width: '78%',
		button: ['Home Page', 'Save Money']
	}).onBtnClick(ret => {
		if (ret === 0) {
			// window.location.href = pagePath.home;
			goHome();
		}
		if (ret === 1) {
			// window.location.href = pagePath.shop;
			goShop();
		}
	});
}
export function registeredDialog() {
	dialog({
		title: 'This mobile number already registered',
		content: 'Login first to enjoy our deals!',
		css: 'm-fm-dialog-first-deposit',
		width: '78%',
		button: ['Home Page', 'Log In']
	}).onBtnClick(ret => {
		if (ret === 0) {
			// window.location.href = pagePath.home;
			goHome();
		}
		if (ret === 1) {
			window.location.href = `${pagePath.login}?okUrl=${encodeURIComponent(document.URL)}`;
		}
	});
}
export function checkFirstDeposit(userId) {
	return fetch(`marketing/v1/activities/getByKind?kind=1${userId ? `&userId=${userId}` : ''}`, {
		method: 'GET'
	}).then(res => res.json()).then(res => {
		if (res.bizCode === 10000) {
			const data = res.data;
			return !!data.isQualified;
		}
	});
}
export const creditTextMap = {
	ke: 'Licence: SportyBet Ltd trading as SportyBet Kenya is licensed by BCLB under the Betting, Lotteries and Gaming Act, Cap 131, Laws of Kenya under License No 683.',
	ng: 'SportyBet Nigeria is licensed by the Lagos State Lotteries Board (LSLB) under License No 0000355.',
	gh: 'SportyBet Ghana is licensed by the Gaming Commission of Ghana under the Gaming Act, 2006 (Act, 721).'
};

export default {
	parseQuery,
	shopDialog
};

