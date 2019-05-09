// 依赖polyfill，但是打包是打在base-lib中的
import 'kernel/js/polyfill';
// core 中应该放一些项目的公共配置
import 'core/js/setHeaderParams';
import { EventBus } from 'kernel/js/eventBus.js';
import 'utils/class';

import commonEvent from 'config/eventConfig/commonEvent';

import './js/header';
import { updateBalance, initUserCenter } from './js/domCommonHandle';

EventBus.$on(commonEvent.UPDATE_LOGIN_STATUS, () => {
	if (window.loginStatus) {
		const headerDom = document.querySelector('#j_page_header');

		headerDom && headerDom.addClass('s-header-on');

		const loginBar = headerDom && headerDom.querySelector('.m-login-bar') || null;
		loginBar && loginBar.addClass('m-login-bar-fix');
		updateBalance(true);
		initUserCenter();
	}
});

EventBus.$on(commonEvent.UPDATE_ACCOUNT_BALANCE, () => {
	const showBalanceSelector = '#j_toggleBalance',
		showBalanceDom = document.querySelector(showBalanceSelector);

	const showBalance = !!showBalanceDom.hasClass('on');

	updateBalance(showBalance);
});

// EventBus.$on(commonEvent.UPDATE_ACCOUNT, val => {
// 	const headerDom = document.querySelector('#j_page_header');
//
// 	if (!headerDom) {
// 		return;
// 	}
//
// 	const phoneDom = headerDom.querySelector('[name="phone"]');
//
// 	if (phoneDom) {
// 		phoneDom.value = val;
// 	}
// });

EventBus.$on(commonEvent.SYNC_ACCOUNT_BALANCE, opt => {
	if (opt.updateLet === 'userInfo') {
		return;
	}

	const showBalanceSelector = '#j_toggleBalance',
		showBalanceDom = document.querySelector(showBalanceSelector);

	if (showBalanceDom.hasClass('on')) {
		updateBalance(true, opt.balance, opt.coins);
	} else {
		updateBalance(false, opt.balance, opt.coins);
	}
});

// 测试通用加密
// fetch('/base/testParam', {
// 	method: 'POST',
// 	body: {
// 		test: 'cjx'
// 	}
// });
