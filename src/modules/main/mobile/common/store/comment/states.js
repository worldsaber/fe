export default {
	commentCount: 0, // 评论数
	voteStats: {}, // 投票结果
	selectedType: '', // 当前用户投票结果，如果未投票的话就是空
	noMoreComments: false, // 是否有更多评论

	recentComments: [], // recent评论列表
	topComments: [], // top评论列表
	officialComments: [], // official comments list

	showEditor: false, // 是否显示编辑器
	showNormalEditor: false, // 是否显示普通编辑器
	orderVisible: false, // 是否显示 choose bet order

	currentUserId: '', // 当前用户id, 目前仅适用于圈子

	// reply params
	commentId: '', // 主评论 id
	toUserId: '', // 回复回复时，二级评论用户的 userId
	toCommentId: '', // 回复回复时，二级评论用户的 commentId
	toNickname: '', // 被回复用户的昵称

	// 评论广告
	commentAds: null,

	// 在哪儿打开（编辑时打开，或常规打开）
	whereToShare: 0 // 1: edit, 0: normal
};
