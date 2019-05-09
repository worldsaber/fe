import cookie from 'storage/cookie';
import upload, { dataURItoBlob } from 'utils/upload';
import { getComplexAdConfig } from 'utils/getAdConfig';
import * as mutationTypes from './mutationTypes.js';

export default {
	/**
	 * 赛事评论列表
	 * options 参数如下：
	 * @param {String} postId 		帖子id
	 * @param {Number} product 		当前在帖子进行评论为3；当前在聊天室聊天为1，默认为空
	 * @param {String} commentId 	主评论的id
	 * @param {String} lastId 		分页时，上一页的 commentId
	 * @param {String} includeLast  是否包含 lastId 对应的
	 * @return {Object}    后台返回值 + 加料
	 */
	async getCommentList({ commit }, options = {}) {
		const body = Object.assign({
			productId: window.country.toUpperCase(),
			apiLevel: 1
		}, options);

		// 登录状态参数
		if (window.loginStatus) {
			body.userToken = cookie('accessToken');
			body.accountId = cookie('phone');
		}

		try {
			const res = await fetch('#/quanzi/lottery/circle_matchPostInfo.html', {
				method: 'GET',
				body
			}).then(response => response.json());

			// success
			if (res.result === 100 && res.post) {
				const postComments = res.post.comments;

				commit(mutationTypes.UPDATE_COMMENT_COUNT, res.post.commentCount);
				commit(mutationTypes.UPDATE_VOTE_STATS, res.matchStatistics);
				commit(mutationTypes.UPDATE_SELECTED_TYPE, res.selectType);

				if (postComments) {
					commit(mutationTypes.UPDATE_COMMENT_LIST, {
						list: postComments,
						reset: !body.lastId
					});
					commit(mutationTypes.UPDATE_CURRENT_USER_ID, res.currentUserId);

					if (!postComments.length && body.lastId) {
						commit(mutationTypes.UPDATE_NO_MORE_COMMENTS, true);
					} else {
						commit(mutationTypes.UPDATE_NO_MORE_COMMENTS, false);
					}
				}
				return res;
			} else if (res.result === 204) {
				// login session timeout
				return Promise.reject({
					login: false
				});
			}

			res.message = res.resultDesc;
			return Promise.reject(res);
		} catch (err) {
			console.log(err); // eslint-disable-line
			return Promise.reject(err);
		}
	},
	/**
	 * 赛事top评论列表
	 * @param  {String} options.postId 		主题id
	 * @return {Object}    后台返回值
	 */
	async getTopCommentList({ commit }, options = {}) {
		if (window.loginStatus) {
			options.userToken = cookie('accessToken');
			options.accountId = cookie('phone');
		}

		const body = Object.assign({
			productId: window.country.toUpperCase()
		}, options);

		try {
			const res = await fetch('#/quanzi/lottery/circle_getTopComments.html', {
				method: 'GET',
				body
			}).then(response => response.json());

			// success
			if (res.result === 100) {
				// top comments
				if (res.data) {
					commit(mutationTypes.UPDATE_TOP_COMMENTS, res.data || []);
				}

				// official comments
				if (res.admComs) {
					commit(mutationTypes.UPDATE_OFFICIAL_COMMENTS, res.admComs || []);
				}
				return res;
			} else if (res.result === 204) {
				// login session timeout
				return Promise.reject({
					login: false
				});
			}
			res.message = res.resultDesc;
			return Promise.reject(res);
		} catch (err) {
			console.log(err); // eslint-disable-line
			return Promise.reject(err);
		}
	},
	/**
	 * 赛事投票
	 * @param  {String} options.postId 		主题id
	 * @param  {String} options.selectType  投票选项：3-主胜，1-平，0-客胜
	 * @return {Object}    后台返回值
	 */
	async vote({ commit }, options = {}) {
		const body = Object.assign({
			userToken: cookie('accessToken'),
			accountId: cookie('phone'),
			productId: window.country.toUpperCase()
		}, options);

		try {
			const res = await fetch('#/quanzi/lottery/circle_voteMatchPost.html', {
				method: 'GET',
				body
			}).then(response => response.json());

			if (res.result === 100) {
				commit(mutationTypes.UPDATE_VOTE_STATS, res.data);
				commit(mutationTypes.UPDATE_SELECTED_TYPE, res.data.selectType);
				return res;
			} else if (res.result === 204) {
				// login session timeout
				return Promise.reject({
					login: false
				});
			}
			res.message = res.resultDesc;
			return Promise.reject(res);
		} catch (err) {
			console.log(err); // eslint-disable-line
			return Promise.reject(err);
		}
	},

	/**
	 * 评论点赞
	 * @param  {String} options.postId 		主题id
	 * @param  {String} options.commentId   评论id
	 * @param  {Number} options.like        是否喜欢：1-喜欢；0-不喜欢
	 */
	async commentLike({ commit }, options = {}) {
		const body = Object.assign({
			userToken: cookie('accessToken'),
			accountId: cookie('phone'),
			productId: window.country.toUpperCase()
		}, options);

		try {
			const res = await fetch('#/quanzi/lottery/circle_like.html', {
				method: 'GET',
				body
			}).then(response => response.json());

			// success
			if (res.result === 100) {
				commit(mutationTypes.UPDATE_COMMENT_LIKE, {
					commentId: options.commentId,
					like: options.like
				});
			} else if (res.result === 204) {
				// login session timeout
				return Promise.reject({
					login: false
				});
			}
		} catch (err) {
			console.log(err); // eslint-disable-line
		}
	},

	/**
	 * 回复评论，具体说明可看 README.md
	 * options 参数如下：
		* @param {String} postId 		帖子id
		* @param {String} text 		回复的内容
		* @param {Number} product 		当前在帖子进行评论为3；当前在聊天室聊天为1
	 */
	async comment({ commit, state }, options = {}) {
		const { commentId, toUserId, toCommentId } = state;

		const body = Object.assign({
			userToken: cookie('accessToken'),
			accountId: cookie('phone'),
			productId: window.country.toUpperCase()
		}, options);

		// 主评论的id
		if (commentId) {
			body.commentId = commentId;
		}
		// 二级评论用户的 userId
		if (toUserId) {
			body.toUserId = toUserId;
		}
		// 二级评论用户的 commentId
		if (toCommentId) {
			body.toCommentId = toCommentId;
		}

		try {
			const res = await fetch('#/quanzi/lottery/circle_replyMatchPosts.html', {
				method: 'POST',
				body
			}).then(response => response.json());

			// success
			if (res.result === 100) {
				// 清除 reply 参数
				commit(mutationTypes.UPDATE_REPLY_PARAMS);
			} else if (res.result === 204) {
				// login session timeout
				return Promise.reject({
					login: false
				});
			}
			return res;
		} catch (error) {
			return Promise.reject(error);
		}
	},
	/**
	 * 上传图片
	 * @param {Object} file 		上传的文件对象
	 */
	async uploadCommentPics({ commit }, file) {
		try {
			const fileData = dataURItoBlob(file);
			const res = await upload('/quanzi/lottery/upload/commentPics', {
				files: fileData,
				userToken: cookie('accessToken'),
				accountId: cookie('phone'),
				productId: window.country.toUpperCase()
			});
			if (res.result === 100) {
				return res.data;
			} else if (res.result === 204) {
				// login session timeout
				return Promise.reject({
					login: false
				});
			}
			return Promise.reject(false);
		} catch (err) {
			return Promise.reject(err);
		}
	},

	// 获取广告位配置信息
	async fetchCommentAds({ commit }) {
		// 异常处理统一由入口home处理
		try {
			const adData = await getComplexAdConfig([
				// comment 广告
				{ spotId: 'commentInner' }
			]);

			if (adData) {
				const data = adData.reduce((res, cur) => {
					if (cur.spotId && cur.ads) {
						res[cur.spotId] = cur.ads;
					}
					return res;
				}, {});
				commit(mutationTypes.FETCH_COMMENT_ADS, data);
				return data;
			}
			return Promise.reject();
		} catch (err) {
			return Promise.reject(err);
		}
	},
};
