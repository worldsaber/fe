import * as types from './mutationTypes';

export default {
	// 更新消息列表
	[types.UPDATE_MESSAGES](state, { data, lastId }) {
		if (!data || !data.length) return;
		if (lastId) {
			state.messages = state.messages.concat(data);
		} else {
			state.messages = data;
		}
	},

	// 更新未读消息数量
	[types.UPDATE_MESSAGES_UNREAD_COUNT](state, count = 0) {
		state.messagesUnreadCount = count;
	},

	// 更新系统消息列表
	[types.UPDATE_SYSTEM_MESSAGES](state, { data, lastId }) {
		if (data) {
			if (lastId) {
				state.systemMessages = state.systemMessages.concat(data);
			} else {
				state.systemMessages = data;
			}
		}
	},

	// 更新未读系统消息数量
	[types.UPDATE_SYSTEM_MESSAGES_UNREAD_COUNT](state, count = 0) {
		state.systemMessagesUnreadCount = count;
	}
};
