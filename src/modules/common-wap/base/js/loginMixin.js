import { pagePath } from 'config/pageConfig';

export default {
	methods: {
		login() {
			if (this.$popupLogin) {
				this.$popupLogin.show();
			} else {
				location.href = `${pagePath.login}?okUrl=${encodeURIComponent(location.href)}`;
			}
		},
		checkLogin() {
			// 未登录
			if (!window.loginStatus) {
				this.login();
				return false;
			}
			return true;
		}
	}
};
