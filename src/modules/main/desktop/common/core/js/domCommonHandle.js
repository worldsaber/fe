import { getbalance, getShowBalance } from './loginBar';

const balanceDom = document.querySelector('#j_balance');

export function updateBalance(isShow, balance, coins = 0) {
	if (!balanceDom) {
		return;
	}

	if (balance) {
		refreshBalance(balance, isShow, coins);
		return;
	}

	// 其他币种时需要修改
	return getbalance().then(({ showVal, coins }) => {
		refreshBalance(showVal, isShow, coins);
	});
}

function refreshBalance(showVal, isShow, coins) {
	// 如果没有balance，显示影藏按钮隐藏
	// 余额有可能是  负数 或者0
	if (typeof +showVal === 'number' && !isNaN(+showVal)) {
		const wrapperDom = document.querySelector('#j_page_header .m-info');
		wrapperDom.addClass('on');
	}

	window.userBalance = showVal;
	window.coins = coins;

	showVal = getShowBalance(isShow);
	balanceDom.innerHTML = showVal;

	return showVal;
}

export function initUserCenter() {
	const userInfoDom = document.querySelector('#j_userInfo');
	const listWrapper = userInfoDom && userInfoDom.querySelector('.m-user-center') || null;

	if (listWrapper) {
		return;
	}

	if (window.showUserInfo) {
		window.showUserInfo({
			hasBalance: false,
			hasLogout: true
		});
	}

	const betHistoryDom = document.querySelector('#j_betHistory');
	if (window.showUserInfo && betHistoryDom) {
		window.showBetHistoryTips();
	}
}
