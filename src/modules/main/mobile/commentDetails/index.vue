<template>
	<Layout :isHaveBottomNav="false" :isHaveLoading="false" :isHasFooter="false" :isNeedScroll="true" :isHaveRightPagelet="true">
		<BackBar slot="afterNav"></BackBar>

		<div class="m-comment-details-wrap" slot="mid" v-loading:fetchData="loading">
			<template v-if="postComment">
				<Thread :item="postComment" :topicId="postId"></Thread>

				<template v-if="recentComments.length">
					<ul class="m-comment-list">
						<template v-for="(item, index) in recentComments">
							<CommentItem
								:item="item"
								:topicId="postId"
								:mainCommentId="postComment.commentId"
								:key="index">
							</CommentItem>
						</template>
					</ul>

					<div class="m-no-more" v-if="noMoreData && recentComments.length >= 20" v-show="!loading">No more info</div>
				</template>

				<!-- 空回复 -->
				<NoDataTips v-else-if="!loading">No replies available</NoDataTips>

				<CommentBar
					:placeholder="`Reply to ${postComment.replyerNickName}`"
					:isShowShareBet="false"
					@click="openEdit">
				</CommentBar>
			</template>

			<!-- 空状态 -->
			<NoDataTips v-else-if="!loading">No comments available</NoDataTips>
		</div>

		<EditPanel
			v-if="postComment"
			slot="afterMid"
			:postNickname="postComment.replyerNickName"
			:postId="postId"
			:commentId="postComment.commentId"
			@afterSubmit="afterSubmit">
		</EditPanel>
	</Layout>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import { TOGGLE_NORMAL_EDITOR, UPDATE_REPLY_PARAMS } from 'store/comment/mutationTypes';
import { EventBus } from 'kernel/js/eventBus';
import commonEvent from 'config/eventConfig/commonEvent';
import loginMixin from 'base/js/loginMixin';
import Layout from 'components/layout/main';
import BackBar from 'components/navbar';
import CommentBar from 'components/comment/CommentBar';
import NoDataTips from 'components/NoDataTips';
import Thread from './pagelet/Thread';
import CommentItem from './pagelet/CommentItem';
import EditPanel from './pagelet/EditPanel';

export default {
	name: 'Post',
	mixins: [loginMixin],
	components: {
		Layout,
		BackBar,
		CommentBar,
		NoDataTips,
		EditPanel,
		Thread,
		CommentItem
	},
	data() {
		return {
			postId: '',
			lastId: '',
			postComment: null,
			loading: true,
			noMoreData: false // 记录当前页是否存在下一页
		};
	},
	computed: {
		...mapState('comment', ['recentComments', 'showNormalEditor']),
		...mapState('me', ['nickname']),
		...mapState('layout', ['scrollPayload'])
	},
	watch: {
		// 滚动加载更多
		scrollPayload({ clientHeight, scrollHeight, scrollTop }) {
			if (this.loading || this.noMoreData) {
				return;
			}

			if (clientHeight + scrollTop >= scrollHeight) {
				// 加载下一页
				this.fetchData();
			}
		}
	},
	methods: {
		...mapMutations('comment', {
			toggleNormalEditor: TOGGLE_NORMAL_EDITOR,
			updateReplyParams: UPDATE_REPLY_PARAMS
		}),
		...mapActions('comment', ['getCommentList']),
		...mapActions('me', ['fetchAccountBaseInfo']),
		resolveParams() {
			this.postId = URL.getPara('postId');
			this.commentId = URL.getPara('commentId');
			this.lastId = URL.getPara('lastId');
		},
		afterSubmit() {
			this.noMoreData = false;
		},
		async fetchData(options = {}) {
			const { postId, commentId, lastId } = this;
			this.loading = true;
			try {
				const body = Object.assign({
					postId,
					commentId,
					product: 3
				}, options);

				if (lastId) {
					body.lastId = lastId;
				}

				const res = await this.getCommentList(body);
				this.postComment = res.comment;
				// 没有更多数据了
				if (!res.post.comments.length) {
					this.noMoreData = true;
				}
				const lastComment = this.recentComments[this.recentComments.length - 1];
				if (lastComment) {
					this.lastId = lastComment.commentId;
				}
				this.loading = false;
			} catch (err) {
				console.log(err); // eslint-disable-line

				this.loading = -1;

				if (err.login === false) {
					return this.login();
				}
			}
		},
		openEdit() {
			// 更新主评论id
			this.updateReplyParams({
				commentId: this.postComment.commentId
			});
			this.toggleNormalEditor(true);
		},
		async fetchNickname() {
			if (window.loginStatus && !this.nickname) {
				// 获取 nickname 等基本信息
				return this.fetchAccountBaseInfo();
			}
		},
		async initFetch() {
			this.loading = true;
			if (this.commentId) {
				// 初始化时，如果有 lastId, 则需加上 includeLast 参数，用来在分页加载时包含该评论
				try {
					await Promise.all([
						this.fetchData({ includeLast: true }),
						this.fetchNickname()
					]);
					this.loading = false;
				} catch (err) {
					console.log(err); // eslint-disable-line
					this.loading = -1;
				}
			}
		}
	},
	created() {
		this.resolveParams();

		this.initFetch();

		EventBus.$on(commonEvent.UPDATE_LOGIN_STATUS, this.initFetch);
	}
};
</script>


<style lang="less">
@import '~base/styles/variable.less';

.m-comment-details-wrap {
	padding-bottom: 50/@rem;

	.m-comment-list {
		margin-bottom: 20/@rem;
	}

	.m-loading-wrap {
		position: relative;
	}

	.m-no-more {
		margin: 14/@rem auto;
		font-size: 12/@rem;
		color: @darkGray;
		text-align: center;
	}
}
</style>
