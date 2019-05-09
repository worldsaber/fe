<template>
	<li :class="['m-comment-item', {
		'm-comment-item--highlight': item.replyerUserId === currentUserId,
	}]">
		<div class="m-item-main" @click="reply">
			<div class="m-avatar">
				<img :src="avatarUrl" alt="">
			</div>

			<div class="m-main-info-wrap">
				<div class="m-meta">
					<div class="m-nickname">
						<span>{{item.replyerNickName}}</span>
						<!-- 管理员徽章 -->
						<Badge type="primary" v-if="isAdmin">Official</Badge>
					</div>
				</div>

				<div class="m-item-info">
					<!-- showTexts -->
					<div class="m-item-content" v-if="showTexts.length">
						<template v-for="(text, i) in showTexts">
							<span :key="i" v-if="!bookingCodes.includes(text)">{{text}}</span>
							<!-- booking code -->
							<template v-else>
								<span :key="i" class="booking-code" @click.stop="goToBetslip(text)">{{text}}</span>
							</template>
						</template>
					</div>

					<div class="m-item-content" v-else>{{item.text}}</div>
				</div>
			</div>
		</div>

		<!-- 用户分享的图片 -->
		<div class="m-pic-views-wrap" v-if="shareImgs.length">
			<PicViews :imgs="shareImgs"></PicViews>
		</div>

		<!-- 回复内容 -->
		<a class="m-item-reply" v-if="item.replies" :href="commentDetailsUrl">
			<template v-for="(reply, index) in item.replies">
				<CommentReply :reply="reply" :key="index"></CommentReply>
			</template>
			<!-- 超过 2 条显示 -->
			<div class="m-replies-count" v-if="item.replyCnt > 2">View replies ({{showReplyCount}})</div>
		</a>

		<div class="m-item-footer">
			<div class="m-time">{{showDate}}</div>

			<div class="m-flex-right" v-if="!isAdmin">
				<BtnReply v-if="isShowReplyBtn"
					class="m-btn"
					:commentId="item.commentId"
					@click="reply">
				</BtnReply>

				<BtnLike v-if="isShowLikeBtn"
					class="m-btn"
					:postId="topicId"
					:commentId="item.commentId"
					:like="item.like"
					:likeCount="item.likeCount">
				</BtnLike>
			</div>
		</div>
	</li>
</template>

<script>
import { mapMutations } from 'vuex';
import { TOGGLE_NORMAL_EDITOR, UPDATE_REPLY_PARAMS } from 'store/comment/mutationTypes';
import loginMixin from 'base/js/loginMixin';
import bookingCodeMixin from 'components/comment/bookingCodeMixin.js';
import { formatCommentDate } from 'utils/comment';
import { pagePath } from 'config/pageConfig';
import defaultAvatar from 'base/images/default_avatar@2x.png';
import BtnReply from 'components/comment/BtnReply';
import BtnLike from 'components/comment/BtnLike';
import Badge from 'components/comment/Badge';
import PicViews from 'components/comment/PicViews';
import CommentReply from './Reply';

export default {
	name: 'CommentItem',
	mixins: [
		loginMixin,
		bookingCodeMixin
	],
	props: {
		item: {
			required: true,
			type: Object
		},
		topicId: {
			type: [Number, String],
			'default': ''
		},
		currentUserId: {
			type: [Number, String],
			'default': ''
		},
		isShowReplyBtn: {
			type: Boolean,
			'default': true
		},
		isShowLikeBtn: {
			type: Boolean,
			'default': true
		}
	},
	components: {
		BtnReply,
		BtnLike,
		Badge,
		PicViews,
		CommentReply
	},
	computed: {
		avatarUrl() {
			const avatar = this.item.replyerAvatarUrl;
			return avatar ? `${__cdnOrigin__}/${avatar}` : defaultAvatar;
		},
		showDate() {
			return formatCommentDate(this.item.createTimestamp);
		},
		showReplyCount() {
			const count = this.item.replyCnt;
			return count < 1000 ? count : '999+';
		},
		isAdmin() {
			// role == 1 为管理员账号
			return this.item.role === 1;
		},
		commentDetailsUrl() {
			const { postId, commentId } = this.item;
			return `${pagePath.commentDetails}?postId=${postId}&commentId=${commentId}`;
		},
		// 解析booking code后的 text 数组
		showTexts() {
			return this.resolveBookingCode(this.item.text);
		},
		// 用户分享的图片
		shareImgs() {
			return this.item.url || [];
		}
	},
	methods: {
		...mapMutations('comment', {
			toggleNormalEditor: TOGGLE_NORMAL_EDITOR,
			updateReplyParams: UPDATE_REPLY_PARAMS
		}),
		reply() {
			// 不能回复官方账号
			if (this.isAdmin) {
				return;
			}

			this.updateReplyParams({
				commentId: this.item.commentId,
				toNickname: this.item.replyerNickName
			});
			this.toggleNormalEditor(true);
		}
	}
};
</script>

<style lang="less">
@import '~base/styles/variable.less';
@import 'base/styles/icon.less';

.m-comment-item {
	list-style: 0;
	padding: 16/@rem 16/@rem 13/@rem;
	border-bottom: 1px solid @fogGrayBorder;

	&.m-comment-item--highlight {
		position: relative;

		&:before {
			content: '';
			width: 2/@rem;
			height: 100%;
			position: absolute;
			top: 0;
			left: 0;
			background: @green;
		}
	}

	.m-item-main {
		padding-left: 51/@rem;
		position: relative;

		.m-avatar {
			border-radius: 50%;
			overflow: hidden;
			background: @lightGray;
			width: 36/@rem;
			height: 36/@rem;
			position: absolute;
			top: 0;
			left: 0;

			img {
				vertical-align: top;
				width: 100%;
				height: 100%;
			}
		}
	}

	.m-nickname {
		font-size: 12/@rem;
		line-height: 16/@rem;
	}

	.m-item-content {
		margin-top: 4/@rem;
		font-size: 14/@rem;
		line-height: 18/@rem;
		word-wrap: break-word;
		color: @darker;
	}

	.m-pic-views-wrap {
		padding-left: 51/@rem;
	}

	.m-item-footer {
		margin-top: 11/@rem;
		padding-left: 51/@rem;
		font-size: 12/@rem;
		line-height: 16/@rem;
		color: @darkGray;
		display: flex;
		align-items: center;
		justify-content: space-between;

		.m-flex-right {
			display: flex;
			align-items: center;
			justify-content: flex-end;

			.m-btn {
				margin-left: 20/@rem;
			}
		}
	}
}
.booking-code {
	font-size: 14/@rem;
	color: @green;
	text-decoration-line: underline;
}

.m-item-reply {
	display: block;
	color: @darker;
	margin-top: 10/@rem;
	margin-left: 51/@rem;

	.m-replies-count {
		margin-left: 28/@rem;
		font-size: 12px;
		font-weight: 500;
		line-height: 16/@rem;
		color: #3656a3;
	}

	&:active, &:visited, &:hover {
		text-decoration: none;
	}
}
</style>
