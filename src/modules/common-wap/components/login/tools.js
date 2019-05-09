
export function isInApp() {
	const AppCore = window.AppCore;
	return AppCore.getAppName() === 'sportybet';
}
export function getAppVersion(isMainVersion) {
	if (isInApp()) {
		const AppCore = window.AppCore;
		const sportybet = AppCore.sportybet;
		if (sportybet && sportybet.version) {
			return sportybet.version(isMainVersion);
		}
	}
	return '0';
}
// 开启wap 调用android的登录功能
// 不能直接调用APPCore, 异步设置的
export const isAppLogin = () => getAppVersion() >= '85';  // 大于 84 版本的android启用

/**
 * 封装登录的状态，简化登录和业务的融合
 * @param {*} url okUrl 采用页面登录成功时刷新的页面url
 * @return promise
 */
export function loginPromise(url) {
	return new Promise((resolve, reject) => {
		if (window.loginStatus) {
			resolve();
		} else {
			const AppCore = window.AppCore;
			AppCore.login(url, () => {
				resolve();
			}, () => {
				reject();
			});
		}
	});
}

export default {
	isInApp,
	loginPromise,
};

