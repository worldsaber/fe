import 'core/core';
import 'base/base';
import commonEvent from 'config/eventConfig/commonEvent';
import { EventBus } from 'kernel/js/eventBus.js';

// import { userPushInit } from 'base/js/userPush';

import './index.less';

const defaulHash = 'ded7cf4dffd43b4d8fb31f913ad23204';
const defaultScriptUrl = 'https://test-virtual.golden-race.net/web-v2/golden-race-online-loader.js';

// 登录后的url
function getHash() {
	const t = new Headers();
	t.append('OperId', window.operId);
	return fetch('patron/goldenrace-account', {
		headers: t
	})
	.then(res => res.json())
	.then(res => {
		if (res && res.bizCode === 10000 && res.data) {
			return res.data;
		}
		return Promise.reject();
	});
}

function mountSDK(url) {
	console.log('js:' + url);
	return new Promise((resolve, reject) => {
		const scirptEl = document.createElement('script');
		scirptEl.src = url;
		scirptEl.id = 'golden-race-loader';
		document.querySelector('body').appendChild(scirptEl);
		scirptEl.addEventListener('load', () => {
			resolve();
		});
	});
}

function init () {
	document.addEventListener('DOMContentLoaded', () => {
		getHash()
		.then(data => {
			const param = {};
			if (data.onlineHash) {
				param.onlineHash = data.onlineHash;
			} else if (data.anonHash) {
				param.userUid = data.anonHash;
			}
			return mountSDK(data.webUrl || defaultScriptUrl)
			.then(() => param);
		})
		.catch(() => {
			const param = {};
			param.userUid = defaulHash;
			return mountSDK(defaultScriptUrl)
			.then(() => param);
		})
		.then(param => {
			param.showHeader = false;
			param.showFooter = false;
			param.skin = 'sportybet';
			console.log(param);
			const loader = window.grOnlineLoader(param);
			loader.onTicketCreated((eventName, eventArguments) => {
				EventBus.$emit(commonEvent.UPDATE_ACCOUNT_BALANCE);
			});
			return loader;
		});
	});
}
init();

EventBus.$on(commonEvent.UPDATE_LOGIN_STATUS, val => {
	window.location.reload();
});

// 中奖推送
// userPushInit();
