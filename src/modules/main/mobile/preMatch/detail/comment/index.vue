<template>
	<div class="m-comments-wrap" v-loading:fetchPost="loading">
		<!-- 投票 -->
		<Vote :topicId="topicId" v-show="!loading"></Vote>

		<div class="m-comments-container" :class="{ 'no-more': noMoreData }">
			<template v-if="hasCommentsData">
				<!-- 官方评论 -->
				<CommentList
					v-if="officialComments.length"
					class="m-official-comments"
					:list="officialComments"
					:topicId="topicId"
					:currentUserId="currentUserId"
					:isShowLikeBtn="false"
					:isShowReplyBtn="false">
				</CommentList>

				<!-- Top Comments -->
				<CommentList
					v-if="topComments.length"
					class="m-top-comments"
					title="Top Comments"
					:list="topComments"
					:topicId="topicId"
					:currentUserId="currentUserId">
				</CommentList>

				<!-- 评论广告 -->
				<CommentAd v-if="commentAds && commentAds.commentInner" :ad="commentAds.commentInner"></CommentAd>

				<!-- Recent Comments -->
				<CommentList
					v-if="recentComments.length"
					class="m-recent-comments"
					title="Recent Comments"
					:list="recentComments"
					:topicId="topicId"
					:currentUserId="currentUserId">
				</CommentList>

				<div class="m-no-more" v-if="isShowNoMore">- No more comments -</div>
			</template>

			<!-- 空状态 -->
			<template v-else-if="!loading">
				<NoDataTips>Seems a little quiet here <br>Be the first to comment on this match</NoDataTips>

				<!-- 评论广告 -->
				<CommentAd v-if="commentAds && commentAds.commentInner" :ad="commentAds.commentInner"></CommentAd>
			</template>
		</div>

		<div v-if="isShowRefresh"
			:class="['m-refresh-btn', {
				'loading': refreshLoading
			}]" @click="handleRefresh">
			<i class="m-icon-refresh"/>
		</div>

		<CommentBar @share="showChooseBet" @click="openEdit"></CommentBar>

		<ShareBet
			v-if="orderVisible"
			@cancel="cancelShare"
			@choose="choosed"
			@ready="shareBetReady">
		</ShareBet>
	</div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import { TOGGLE_EDITOR, TOGGLE_SHOW_ORDER, UPDATE_REPLY_PARAMS } from 'store/comment/mutationTypes';
import { TOOGLE_BET_VISIBLE, DELETE_IMG_DATA_LIST } from 'store/shareBet/mutationTypes';
import { RESET_SCROLL } from 'store/layout/mutationTypes';
import { EventBus } from 'kernel/js/eventBus.js';
import loginMixin from 'base/js/loginMixin';
import CommentBar from 'components/comment/CommentBar';
import ShareBet from 'components/shareBet';
import NoDataTips from 'components/NoDataTips';
import Vote from './pagelet/Vote';
import OfficialComments from './pagelet/OfficialComments';
import CommentList from './pagelet/List';
import CommentAd from './pagelet/Ad';

export default {
	name: 'Comment',
	mixins: [loginMixin],
	components: {
		CommentBar,
		ShareBet,
		NoDataTips,
		Vote,
		OfficialComments,
		CommentList,
		CommentAd
	},
	props: {
		currentTab: {
			type: String,
			'default': ''
		},
		topicId: {
			type: [Number, String],
			'default': ''
		}
	},
	data() {
		return {
			refreshLoading: false,
			loading: true,
			noMoreData: false
		};
	},
	computed: {
		...mapState('layout', ['scrollPayload']),
		...mapState('comment', ['recentComments', 'orderVisible', 'officialComments', 'topComments', 'commentAds', 'currentUserId', 'whereToShare']),
		...mapState('me', ['nickname']),
		...mapState('shareBet', ['imgDataList']),
		isShowRefresh() {
			return this.recentComments && this.recentComments.length > 0;
		},
		hasCommentsData() {
			return this.officialComments.length || this.topComments.length || this.recentComments.length;
		},
		isShowNoMore() {
			return !this.loading && this.noMoreData && this.recentComments.length >= 20;
		}
	},
	watch: {
		// 滚动加载更多
		scrollPayload({ clientHeight, scrollHeight, scrollTop }) {
			if (this.loading || this.noMoreData) {
				return;
			}

			if (clientHeight + scrollTop >= scrollHeight) {
				// 加载下一页
				this.getRecentComments();
			}
		}
	},
	methods: {
		...mapMutations('layout', {
			resetScroll: RESET_SCROLL
		}),
		...mapActions('comment', ['getCommentList', 'getTopCommentList', 'fetchCommentAds']),
		...mapActions('me', ['fetchAccountBaseInfo']),
		...mapMutations('comment', {
			toggleEditor: TOGGLE_EDITOR,
			toggleShowOrder: TOGGLE_SHOW_ORDER,
			updateReplyParams: UPDATE_REPLY_PARAMS
		}),
		...mapMutations('shareBet', {
			toogleBetVisible: TOOGLE_BET_VISIBLE,
			deleteImgDataList: DELETE_IMG_DATA_LIST,
		}),
		scrollToLocate() {
			// 滚动到评论列表顶部
			const tabNavs = document.querySelector('.m-prematch-detail .m-tab-navs');
			const target = document.querySelector('.m-recent-comments');
			let top = this.scrollPayload.scrollTop;
			if (tabNavs) {
				top -= tabNavs.offsetHeight;
			}
			if (target) {
				top += target.getBoundingClientRect().top;
			}
			this.resetScroll({ top });
		},
		async handleRefresh() {
			if (this.refreshLoading) return;
			this.refreshLoading = true;
			this.noMoreData = false;
			this.scrollToLocate();

			try {
				await this.fetchPost(true);
				this.refreshLoading = false;
			} catch (err) {
				this.refreshLoading = false;
			}
		},
		async fetchNickname() {
			if (window.loginStatus && !this.nickname) {
				// 获取 nickname 等基本信息
				return this.fetchAccountBaseInfo();
			}
		},
		/**
		 * @param {Boolean} force 	是否强制刷新
		 */
		async getRecentComments(force) {
			this.loading = true;

			const body = {
				postId: this.topicId,
				product: 3
			};

			const lastComment = this.recentComments[this.recentComments.length - 1];

			if (lastComment && !force) {
				body.lastId = lastComment.commentId;
			}

			try {
				const res = await this.getCommentList(body);
				this.loading = false;
				if (!res.post.comments.length) {
					this.noMoreData = true;
				}
				return res;
			} catch (err) {
				console.log(err); // eslint-disable-line
				this.loading = false;

				if (err.login === false) {
					return this.login();
				}

				return Promise.reject(err);
			}
		},
		async fetchPost(force) {
			this.loading = true;
			// 没办法，圈子系统用的postId, 而后台矫正用的topicId, 这里是一个意思
			const postId = this.topicId;

			try {
				await Promise.all([
					this.getRecentComments(force),
					this.getTopCommentList({ postId }),
					this.fetchNickname()
				]);
				this.loading = false;
			} catch (err) {
				this.loading = -1;

				if (err.login === false) {
					return this.login();
				}
			}
		},
		showChooseBet() {
			this.toggleEditor(false);
			this.toggleShowOrder({ status: true });
			this.toogleBetVisible(true);
		},
		openEdit() {
			// 清楚评论参数
			this.updateReplyParams();
			this.toggleEditor(true);
		},
		// cancel share bet
		cancelShare() {
			// 如果是在编辑器中打开的 choose bet, 则需要保持编辑器的开启状态
			if (this.whereToShare === 1) {
				this.toggleEditor(true);
			}
		},
		// 已经选中了订单，在绘制之前
		choosed() {
			// 目前只能选一张图，所以先清空
			if (this.imgDataList.length) {
				this.deleteImgDataList();
			}
		},
		shareBetReady() {
			this.toogleBetVisible(false);
			this.openEdit();
		}
	},
	created() {
		this.fetchPost();
		this.fetchCommentAds();

		EventBus.$once('updateLoginStatus', () => {
			this.fetchPost();
		});

		EventBus.$on('afterSubmit', () => {
			this.noMoreData = false;
		});
	}
};
</script>

<style lang="less">
@import '~base/styles/variable.less';
@import 'base/styles/icon.less';
@import 'base/styles/animate.less';

.m-comments-wrap {
	padding-bottom: (50 + 58)/@rem;

	.m-refresh-btn {
		position: fixed;
		bottom: 60/@rem;
		right: 10/@rem;
		width: 36/@rem;
		height: 36/@rem;
		line-height: 36/@rem;
		border-radius: 50%;
		text-align: center;
		opacity: 0.5;
		background-color: #000000;

		.m-icon-refresh {
			vertical-align: middle;
			.m-icon-refresh();

			&:before {
				color: @white;
				font-size: 18/@rem;
			}
		}
		&:active {
			background-color: @darkGray;
		}
		&.loading {
			animation: circles 0.5s linear infinite;
		}
	}

	.m-loading-wrap {
		// position: relative;
		position: absolute;
		width: 100%;
		min-height: 58/@rem;
		bottom: 50/@rem;
		left: 0;
	}
}

.m-comments-container {
	position: relative;

	.m-top-comments {
		.m-comment-list {
			margin-top: 2/@rem;
		}
	}

	.m-recent-comments {
		.m-comment-list {
			margin-top: 2/@rem;
		}
	}

	.m-no-more {
		position: absolute;
		bottom: -58/@rem;
		left: 0;
		width: 100%;
		padding: 20/@rem 0;
		text-align: center;
		color: @darkGray;
	}
}
</style>
