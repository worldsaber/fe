import { appPath } from 'config/appPagePath';
import { pagePath } from 'config/pageConfig';

function goWebUrl(url) {
	window.location.href = url;
}

export function isInApp() {
	const AppCore = window.AppCore;
	return AppCore.getAppName() === 'sportybet';
}

export function goHome() {
	const AppCore = window.AppCore;
	const isApp = isInApp();

	if (isApp) {
		AppCore.sendCmd(appPath.home);
	} else {
		goWebUrl(`${pagePath.home}`);
	}
}

export function goShop() {
	const AppCore = window.AppCore;
	const isApp = isInApp();

	if (isApp) {
		AppCore.sendCmd(appPath.shop);
	} else {
		goWebUrl(`${pagePath.shop}`);
	}
}
