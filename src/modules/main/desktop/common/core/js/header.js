import { domReady, delegate, closest, triggerEvt } from 'utils/dom';
import 'utils/class';

import { EventBus } from 'kernel/js/eventBus.js';

import { cookie, LS } from 'storage';

import { fbLogin } from 'base/js/fbLogin';
import { fixPhone } from 'base/js/utils';

import { sportConfigLowerCase } from 'config/sportsType';
import commonEvent from 'config/eventConfig/commonEvent';
import { pagePath } from 'config/pageConfig';

import { getErrorInfo } from 'store/changePsd/commonFun';

import CommonPop from 'components/popDialog/commonPop';
import dialog from 'components/dialog';
import version from 'constant/version';

import './headerCommon';

import { commitLogin, thirdPartyLogin, getShowBalance/* , commitLogout*/ } from './loginBar';
import { validatorPhone, validatorPsd } from './validator';
import { updateBalance, initUserCenter } from './domCommonHandle';

let popDialog = null;
const navItemSelector = '.m-flex-item';
const navItemActiveClass = 'm-flex-item--active';
let originLogoBarHeight;
let originMainPadTop;
const key = 'local_new_badge';

domReady(() => {
	// 部分页面没有header，后续事件绑定等操作不需要进行
	if (!shouldInit()) {
		return;
	}

	// 页面初始化时，矫正导航位置
	fixNavigatorPos();

	// 部分页面没有二级导航，矫正吸顶位置
	fixCeilingPos();

	// 用户中心相关的页面，my account部分需要加亮当前router项，其他页面不需要加亮
	fixUserCenter();

	// 初始化登录条中
	window.loginStatus && updateBalance(LS.get('isShowBalance') !== '0');

	// 绑定登录块儿事件
	bindEvent();

	// init account
	initPhone();

	const topTab = document.querySelector('#topHeader');
	const subTab = document.querySelector('#header');

	// 一级导航对应click事件
	delegate(topTab, 'click', navItemSelector, e => {
		const currentNode = e.target;

		if (window.v_router && currentNode.getAttribute('data-path')) {
			e.preventDefault();
			e.stopPropagation();
			e.stopImmediatePropagation();

			// 点中active tab直接返回
			if (currentNode.hasClass(navItemActiveClass)) {
				return;
			}

			const name = currentNode.getAttribute('data-path');
			const routerOption = {
				name
			};
			const sportId = currentNode.getAttribute('data-sportsid');

			if (sportId) {
				routerOption.params = {
					sportName: sportConfigLowerCase[sportId]
				};
			}
			window.v_router.push(routerOption);
			topTab.querySelectorAll('.' + navItemActiveClass).removeClass(navItemActiveClass);
			currentNode.addClass(navItemActiveClass);
		}
	});

	// 二级导航对应的事件
	delegate(subTab, 'click', navItemSelector, e => {
		const currentNode = e.target;
		const name = currentNode.getAttribute('data-path');

		if (window.v_router && name && name !== 'home') {
			e.preventDefault();
			e.stopPropagation();
			e.stopImmediatePropagation();

			// 点中active tab直接返回
			if (currentNode.hasClass(navItemActiveClass)) {
				return;
			}

			const routerOption = {
				name
			};
			const sportId = currentNode.getAttribute('data-sportsid');

			if (sportId) {
				routerOption.params = {
					sportName: sportConfigLowerCase[sportId]
				};
				routerOption.meta = {
					sportId
				};
			}

			window.v_router.push(routerOption);
			subTab.querySelectorAll('.' + navItemActiveClass).removeClass(navItemActiveClass);
			currentNode.addClass(navItemActiveClass);
		}
	});

	// 初始化时区信息
	const timeZoneDom = document.querySelector('#j_timezone');
	const now = new Date();
	let timeZone = now.getTimezoneOffset();
	const zoneHours = Math.abs(timeZone / 60);
	const zoneSeconds = Math.abs(timeZone % 60);
	const prefix = timeZone > 0 ? '-' : '+';

	timeZone = 'GMT' + prefix + (zoneHours > 9 ? zoneHours : '0' + zoneHours) + ':' + (zoneSeconds > 9 ? zoneSeconds : '0' + zoneSeconds);
	timeZoneDom.innerHTML = timeZone;

	// 页面滚动时，导航吸顶
	window.addEventListener('scroll', e => {
		fixNavigatorPos();
	});

	// 展示new badge
	try {
		const cricketEl = document.querySelector('.m-flex-item[data-sportsid="21"]');
		if (cricketEl) {
			const badgeValue = LS.get(key);
			// 显示
			if (!badgeValue && version === '1.13.0') {
				const badge = cricketEl.querySelector('.new-badge');
				badge.style.display = 'block';
			}
			// 事件绑定
			cricketEl.addEventListener('click', () => {
				// new badge
				try {
					if (version === '1.13.0') {
						const badge = cricketEl.querySelector('.new-badge');
						badge.style.display = 'none';
						LS.set(key, 1);
					}
				} catch (e) {
					console.log(e);
				}
			});
		}
	} catch (e) {
		console.log(e);
	}
});

function fixNavigatorPos() {
	const headerDom = document.querySelector('#j_page_header');
	const scrollHeight = window.scrollY;
	const logoBarHeight = headerDom && headerDom.querySelector('.m-logo-bar').getBoundingClientRect().height;
	const mainNode = document.querySelector('#j_page_header + .s-page');
	const noteNode = document.querySelector('#j_note');
	const noteHeight = noteNode && noteNode.getBoundingClientRect().height || 0;

	if (!originMainPadTop) {
		originMainPadTop = mainNode && getComputedStyle(mainNode, null).getPropertyValue('padding-top');
	}

	if (scrollHeight > logoBarHeight + noteHeight) {
		if (!headerDom.hasClass('s-header-fix')) {
			headerDom.addClass('s-header-fix');

			const topTab = document.querySelector('#topHeader'),
				topTabHeight = topTab && topTab.getBoundingClientRect().height || 0,
				subTab = document.querySelector('#header'),
				subTabHeight = subTab && subTab.getBoundingClientRect().height || 0;

			mainNode && (mainNode.style.paddingTop = subTabHeight + topTabHeight + (noteHeight * 2) + originLogoBarHeight + 5 + 'px');
		}
	} else {
		headerDom.removeClass('s-header-fix');
		mainNode && (mainNode.style.paddingTop = originMainPadTop);
	}
}

function fixCeilingPos() {
	const headerDom = document.querySelector('#j_page_header');
	const subTab = document.querySelector('#header');

	if (!subTab) {
		headerDom.addClass('s-header-fixed');
	}
}

function fixUserCenter() {
	const path = location.pathname,
		userCenterDom = document.querySelector('#j_userInfo'),
		betHistoryDom = document.querySelector('#j_betHistory');

	if (!/\/my_accounts\//.test(path) && userCenterDom) {
		userCenterDom.addClass('m-userInfo-fix');
	}

	if (window.loginStatus && userCenterDom && window.showUserInfo) {
		window.showUserInfo({
			hasBalance: false,
			hasLogout: true
		});
	}

	if (window.loginStatus && betHistoryDom && window.showBetHistoryTips) {
		window.showBetHistoryTips();
	}
}

/*
初始化账号输入框
 */
function initPhone() {
	const phoneSelector = '#j_page_header [name="phone"]';

	document.querySelector(phoneSelector).value = cookie('phone') || '';
}

/*
login 相关事件
 */
function bindEvent() {
	const userInfoSelector = '#j_userInfo';
	const betHistorySelector = '#j_betHistory';
	// logoutSelector = '#j_logout'
	const loginSelector = '.m-btn-login';
	const registerSelector = '.m-btn-register';
	const thirdPartySelector = '.m-third-party';
	const phoneSelector = '[name="phone"]';
	const psdSelector = '[name="psd"]';
	const showBalanceSelector = '#j_toggleBalance';
	const refreshBalanceSelector = '#j_refreshBalance';
	const loginWrapperSelector = '.m-login-bar';
	const headerDom = document.querySelector('#j_page_header');
	const showBalanceDom = document.querySelector(showBalanceSelector);
	// 初始化重置class
	if (LS.get('isShowBalance') === '0') {
		showBalanceDom.removeClass('on');
	} else {
		showBalanceDom.addClass('on');
	}
	// toggle show balance
	delegate(headerDom, 'click', showBalanceSelector, e => {
		showBalanceDom.toggleClass('on');

		const balanceDom = document.querySelector('#j_balance');

		if (showBalanceDom.hasClass('on')) {
			LS.set('isShowBalance', 1);
			balanceDom.innerHTML = getShowBalance(true);
		} else {
			LS.set('isShowBalance', 0);
			balanceDom.innerHTML = getShowBalance(false);
		}
	});

	// refresh balance
	delegate(headerDom, 'click', refreshBalanceSelector, e => {
		const refreshDom = document.querySelector(refreshBalanceSelector);

		if (refreshDom.hasClass('loading')) {
			return;
		}

		refreshDom.addClass('loading');

		setTimeout(() => {
			refreshDom.removeClass('loading');
		}, 5000);

		if (showBalanceDom.hasClass('on')) {
			updateBalance(true);
		} else {
			updateBalance(false);
		}
	});

	// phone input
	delegate(headerDom, 'change', phoneSelector, e => {
		const inputDom = headerDom.querySelector(phoneSelector);
		const val = inputDom.value;
		let tempVal = val.replace(/\s/g, '');

		if (tempVal.length > 18) {
			tempVal = val.slice(0, 18);
		}
		if (tempVal !== val) {
			inputDom.value = tempVal;
		}

		// EventBus.$emit(commonEvent.UPDATE_ACCOUNT, tempVal);
	});

	// psd input
	delegate(headerDom, 'change', psdSelector, e => {
		const inputDom = headerDom.querySelector(psdSelector);
		let val = inputDom.value;

		if (val.length > 14) {
			val = val.slice(0, 14);
			inputDom.value = val;
		}
	});

	delegate(headerDom, 'keyup', psdSelector + ',' + phoneSelector, e => {
		if (e.keyCode === 13) {
			triggerEvt(headerDom.querySelector(loginSelector), 'click');
		}
	});
	// // log out
	// delegate(headerDom, 'click', logoutSelector, functione {
	// 	commitLogout();
	// });

	// log in
	delegate(headerDom, 'click', loginSelector, e => {
		if (headerDom.hasClass('s-header-fix')) {
			if (window.login) {
				window.login({ activeTab: 'Log In' });
			} else {
				location.href = pagePath.login;
			}

			return;
		}

		const phoneDom = headerDom.querySelector(phoneSelector);
		let phone = phoneDom.value;
		let password = headerDom.querySelector(psdSelector).value;
		const phoneWrapperDom = headerDom.querySelector('.m-phone-wrapper');
		const psdWrapperDom = headerDom.querySelector('.m-psd-wrapper');
		const phoneErrorDom = phoneWrapperDom && phoneWrapperDom.querySelector('.m-error-wrapper');
		const psdErrorDom = psdWrapperDom && psdWrapperDom.querySelector('.m-error-wrapper');

		phone = phone.replace(/^\s+|\s+$/g, '');
		password = password.replace(/^\s+|\s+$/g, '');

		const validatorPhoneRet = validatorPhone(phone);
		if (validatorPhoneRet) {
			phoneErrorDom.innerHTML = validatorPhoneRet;
			phoneWrapperDom.addClass('on');
			return;
		}

		const validatorPsdRet = validatorPsd(password);
		if (validatorPsdRet) {
			psdErrorDom.innerHTML = validatorPsdRet;
			psdWrapperDom.addClass('on');
			return;
		}

		if (phone && password) {
			psdErrorDom.innerHTML = '';
			phoneErrorDom.innerHTML = '';
			phoneWrapperDom.removeClass('on');
			psdWrapperDom.removeClass('on');

			// fix phone
			const tempPhone = fixPhone(phone);
			if (phone !== tempPhone) {
				phoneDom.value = tempPhone;
				phone = tempPhone;
			}

			commitLogin(phone, password).then(res => {
				// 登录后切换loginBar
				if (res.login) {
					headerDom.addClass('s-header-on');
					headerDom.querySelector('.m-login-bar').addClass('m-login-bar-fix');
					EventBus.$emit(commonEvent.UPDATE_LOGIN_STATUS);
				}
			}, ret => {
				const code = ret.code;
				let msg = ret.msg;
				const errorType = code && getErrorInfo(code);

				if (errorType) {
					msg = [
						'<i class="m-icon-tips"></i>',
						msg
					];
					// if (code === 11602 || code === 11605) {
					// 	msg.push('<span class="m-text-highlight">Find out more.</span>');
					// }

					msg = msg.join('');

					if (errorType === 'phone') {
						phoneErrorDom.innerHTML = msg;
						phoneWrapperDom.addClass('on');
					}

					if (errorType === 'psd') {
						psdErrorDom.innerHTML = msg;
						psdWrapperDom.addClass('on');
					}
				} else {
					const toastDom = headerDom.querySelector('.m-error-toast');

					toastDom && (toastDom.innerHTML = msg);

					setTimeout(() => {
						toastDom && (toastDom.innerHTML = '');
					}, 2000);
				}
			});
		}
	});

	// facebook log in
	delegate(headerDom, 'click', thirdPartySelector, e => {
		fbLogin().then(res => {
			thirdPartyLogin(res && res.fbToken || '').then(null, () => {
				showError('An error occurred while connecting to Facebook');
			});
		}, () => {
			showError('An error occurred while connecting to Facebook');
		}).catch(() => {
			showError('An error occurred while connecting to Facebook');
		});
	});

	// register
	delegate(headerDom, 'click', registerSelector, e => {
		let phone = headerDom.querySelector(phoneSelector).value;

		phone = phone.replace(/^\s+|\s+$/g, '');

		if (window.login) {
			window.login({ activeTab: 'Register', account: phone });
		} else {
			location.href = pagePath.register;
		}
	});

	// user info
	delegate(headerDom, 'mouseover', userInfoSelector, e => {
		// const userInfoDom = document.querySelector(userInfoSelector);

		// if (userInfoDom.hasClass('on')) {
		// 	userInfoDom.removeClass('on');
		// 	return;
		// }

		const tipsDom = document.querySelector(betHistorySelector).querySelector('.m-balance-tips');
		if (tipsDom && tipsDom.hasClass('on')) {
			EventBus.$emit(commonEvent.UPDATE_BALANCE_STATUS, false);
		}

		// const listWrapper = userInfoDom.querySelector('.m-user-center');
        //
		// if (listWrapper) {
		// 	// userInfoDom.addClass('on');
		// 	return;
		// }
        //
		// if (window.showUserInfo) {
		// 	window.showUserInfo({
		// 		hasBalance: false,
		// 		hasLogout: true
		// 	});
        //
		// 	// userInfoDom.addClass('on');
		// }

		initUserCenter();
	});

	// bet history
	delegate(headerDom, 'click', betHistorySelector, e => {
		const tipsDom = document.querySelector(betHistorySelector).querySelector('.m-balance-tips');
		if (tipsDom.hasClass('on')) {
			EventBus.$emit(commonEvent.UPDATE_BALANCE_STATUS, false);
		}
	});

	// const userInfoDom = document.querySelector(userInfoSelector);
	// if (userInfoDom) {
	// 	userInfoDom.addEventListener('blur', () => {
	// 		userInfoDom.removeClass('on');
	// 	});
	// }

	const phoneDom = headerDom.querySelector(phoneSelector);
	if (phoneDom) {
		phoneDom.addEventListener('focus', () => {
			resetInputError('phone');
		});
	}

	const psdDom = headerDom.querySelector(psdSelector);
	if (psdDom) {
		psdDom.addEventListener('focus', () => {
			resetInputError('password');
		});
	}

	// 点击任意位置，不再显示错误信息
	document.addEventListener('click', e => {
		const wrapperDom = closest(e.target, loginWrapperSelector);
		if (!wrapperDom) {
			resetInputError('phone');
			resetInputError('password');
		}
	});
}

function shouldInit() {
	const headerDom = document.querySelector('#j_page_header');

	if (headerDom) {
		originLogoBarHeight = headerDom.querySelector('.m-logo-bar').getBoundingClientRect().height || 0;
		return true;
	}
}

function resetInputError(type) {
	const headerDom = document.querySelector('#j_page_header'),
		inputWrapperDom = type === 'phone' ?
		headerDom.querySelector('.m-phone-wrapper') :
		headerDom.querySelector('.m-psd-wrapper');

	if (inputWrapperDom && inputWrapperDom.hasClass('on')) {
		inputWrapperDom.removeClass('on');

		const errorDom = inputWrapperDom.querySelector('.m-error-wrapper');

		errorDom && (errorDom.innerHTML = '');
	}
}

function showError(msg = '') {
	if (msg) {
		dialog();

		popDialog = dialog({
			title: null,
			contentData: { msg },
			content: CommonPop,
			button: []
		}).onBtnClick(btnType => {
			popDialog && popDialog.close();
			popDialog = null;
			return false;
		});
	}
}
