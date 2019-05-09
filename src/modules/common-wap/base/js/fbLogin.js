import { cookie } from 'storage';

export function fbLogin() {
	return new Promise((resolve, reject) => {
		if (window.FB) {
			window.FB.login(response => {
				// 存储facebook登录信息在cookies
				const authResponse = response && response.authResponse || {},
					token = authResponse.accessToken || '';
				if (token) {
					cookie('fbToken', token, {
						path: '/',
						expires: 1
					});

					resolve({
						fbToken: token
					});
				}
			}, {
				scope: 'public_profile, user_friends, email'
			});
		} else {
			reject({
				fbLogin: false
			});
		}
	});
}

export function fbLogout() {
	if (window.FB) {
		window.FB.logout(response => {
			const statue = response.status;

			// 退出了facebook账号
			if (statue === 'unknown') {
				window.fbLoginStatus = false;
			}
		});
	}
}

export function checkFbLogin() {
	if (window.FB) {
		window.FB.getLoginStatus(response => {
			const status = response.status;

			if (status === 'connected') {
				// 用户登录了 Facebook 和您的应用
				window.fbLoginStatus = true;
			} else {
				//  not_authorized | unknown
				window.fbLoginStatus = false;
			}
		});
	}
}
