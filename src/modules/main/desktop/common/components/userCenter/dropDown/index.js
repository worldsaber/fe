/*
options:
	hasBalance： 是否显示账号余额
	current: 当前active的项
	balance： 用户账号余额
	hasLogout: 是否显示退出，
	amountDom: 插入dom中那个节点（默认是）
 */

import Vue from 'vue';
import { isEmptyObject } from 'utils';

import store from 'store/usercenter';

import App from '../pagelet/userCenter.vue';

export function showUserInfo(options) {
	if (isEmptyObject(options)) {
		return;
	}

	let amountSelector = options.amountDom;
	if (!amountSelector) {
		amountSelector = '#j_userInfo .dropDown-wraper';
	}

	const amountDom = document.querySelector(amountSelector);
	if (!amountDom) {
		console.log('if amountDom is not #j_userInfo, amountDom is required');
		return;
	}

	new Vue({
		el: amountSelector,
		render: h => h(App, {
			props: {
				hasBalance: options.hasBalance || false,
				currentTab: options.current || '',
				hasLogout: options.hasLogout || false
			}
		}),
		store
	});
}

export default showUserInfo;

window.showUserInfo = showUserInfo;
