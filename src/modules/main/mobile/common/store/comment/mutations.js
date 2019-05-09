import * as types from './mutationTypes.js';

export default {
	[types.UPDATE_COMMENT_COUNT](state, value) {
		state.commentCount = parseInt(value, 10);
	},
	[types.UPDATE_VOTE_STATS](state, payload = {}) {
		const drawSupp = parseInt(payload.drawSupp || 0, 10);
		const loseSupp = parseInt(payload.loseSupp || 0, 10);
		const winSupp = parseInt(payload.winSupp || 0, 10);

		state.voteStats = Object.assign({}, {
			drawSupp,
			loseSupp,
			winSupp,
			total: drawSupp + loseSupp + winSupp
		});
	},
	[types.UPDATE_SELECTED_TYPE](state, value) {
		state.selectedType = value;
	},
	[types.UPDATE_NO_MORE_COMMENTS](state, status) {
		if (typeof status === 'boolean') {
			state.noMoreComments = status;
		} else {
			state.noMoreComments = !state.noMoreComments;
		}
	},
	[types.UPDATE_COMMENT_LIST](state, { list = {}, reset = false }) {
		if (!reset) {
			state.recentComments = state.recentComments.concat(list);
		} else {
			state.recentComments = list;
		}
	},

	[types.UPDATE_CURRENT_USER_ID](state, id) {
		state.currentUserId = id;
	},

	[types.UPDATE_TOP_COMMENTS](state, list = []) {
		state.topComments = list;
	},

	[types.UPDATE_OFFICIAL_COMMENTS](state, list = []) {
		state.officialComments = list;
	},

	[types.TOGGLE_EDITOR](state, status) {
		if (typeof status === 'boolean') {
			state.showEditor = status;
		} else {
			state.showEditor = !state.showEditor;
		}
	},

	[types.TOGGLE_NORMAL_EDITOR](state, status) {
		if (typeof status === 'boolean') {
			state.showNormalEditor = status;
		} else {
			state.showNormalEditor = !state.showNormalEditor;
		}
	},

	[types.TOGGLE_SHOW_ORDER](state, { status, whereToShare = 0 }) {
		if (typeof status === 'boolean') {
			state.orderVisible = status;
		} else {
			state.orderVisible = !state.orderVisible;
		}

		// 在哪儿打开的share
		state.whereToShare = whereToShare;
	},

	[types.UPDATE_COMMENT_LIKE](state, { commentId, like }) {
		const recent = state.recentComments.find(x => x.commentId === commentId);
		if (recent) {
			const { likeCount } = recent;
			const count = +like ? +likeCount + 1 : +likeCount - 1;
			recent.like = like;
			recent.likeCount = count;
		}

		const top = state.topComments.find(x => `${x.commentId}` === commentId);
		if (top) {
			const { likeCount } = top;
			const count = +like ? +likeCount + 1 : +likeCount - 1;
			top.like = like;
			top.likeCount = count;
		}
	},

	// 更新评论参数, 不传参则清除（主要是给回复评论用）
	[types.UPDATE_REPLY_PARAMS](state, payload = {}) {
		const { commentId = '', toUserId = '', toCommentId = '', toNickname = '' } = payload;
		// 主评论 id（区别于 toCommentId）
		state.commentId = commentId;

		// 回复回复时，二级评论用户的 userId
		state.toUserId = toUserId;

		// 回复回复时，二级评论用户的 commentId
		state.toCommentId = toCommentId;

		// 被回复用户的昵称
		state.toNickname = toNickname;
	},

	// 获取评论广告
	[types.FETCH_COMMENT_ADS](state, data) {
		state.commentAds = data;
	}
};
