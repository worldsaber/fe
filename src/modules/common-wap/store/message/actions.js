import cookie from 'storage/cookie';
import * as mutationTypes from './mutationTypes';

export default {
	async getMessages({ commit }, lastId) {
		try {
			const body = {
				productId: window.country.toUpperCase(),
				userToken: cookie('accessToken'),
				accountId: cookie('phone')
			};
			if (lastId) {
				body.lastId = lastId;
			}
			const res = await fetch('#/quanzi/lottery/circle_getMessages.html', {
				body
			}).then(response => response.json());

			if (res.result === 100) {
				commit(mutationTypes.UPDATE_MESSAGES, { data: res.messages, lastId });
				return res;
			} else if (res.result === 204) {
				// login session timeout
				return Promise.reject({
					login: false
				});
			}
			return Promise.reject(new Error(res.resultDesc));
		} catch (error) {
			return Promise.reject(error);
		}
	},

	/**
	* 获取用户未读消息数量
	*/
	async getMessagesUnreadCount({ commit }) {
		try {
			const res = await fetch('#/quanzi/lottery/user/message/noticecount', {
				body: {
					userToken: cookie('accessToken'),
					accountId: cookie('phone'),
					productId: window.country.toUpperCase()
				}
			}).then(response => response.json());
			if (res.result === 100) {
				commit(mutationTypes.UPDATE_MESSAGES_UNREAD_COUNT, res.msgCount);
			} else if (res.result === 204) {
				// login session timeout
				return Promise.reject({
					login: false
				});
			}
			return res;
		} catch (err) {
			return Promise.reject(err);
		}
	},

	/**
	 * 获取系统消息列表
	 * @param {String} lastId 	以后一条消息的 id
	 */
	async getSystemMessages({ commit }, lastId) {
		try {
			const body = {};
			if (lastId) {
				body.lastId = lastId;
			}
			const res = await fetch('/msg/site/info/list', {
				body
			}).then(response => response.json());

			const { bizCode, data, message, login } = res;

			if (login === false) {
				return Promise.reject({ login: false });
			}

			if (bizCode === 10000) {
				commit(mutationTypes.UPDATE_SYSTEM_MESSAGES, { data, lastId });
				if (data.length) {
					localStorage.setItem('wap_last_system_msg_time', data[0].createTime);
				}
				return res;
			}
			return Promise.reject(new Error(message));
		} catch (error) {
			return Promise.reject(error);
		}
	},

	/**
	 * 获取系统消息未读数量
	 */
	async getSystemMessagesUnreadCount({ commit }) {
		try {
			const body = {};
			const time = localStorage.getItem('wap_last_system_msg_time');
			if (time) {
				body.time = time;
			}
			const res = await fetch('/msg/site/info/count', {
				body
			}).then(response => response.json());

			const { bizCode, data, message } = res;

			if (bizCode === 10000) {
				commit(mutationTypes.UPDATE_SYSTEM_MESSAGES_UNREAD_COUNT, data);
				return res;
			}
			return Promise.reject(new Error(message));
		} catch (error) {
			return Promise.reject(error);
		}
	}
};
