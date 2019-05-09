<template>
	<li :class="['m-comment-item', `m-comment-item--${type}`, {
		'm-comment-item--highlight': item.replyerUserId === currentUserId,
	}]" @click="reply">
		<div class="m-avatar">
			<img :src="avatarUrl" alt="">
		</div>

		<div class="m-comment-item-main">
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

				<div class="m-item-content" v-else>
					<span v-if="item.toNickName">reply to {{item.toNickName}}:</span>
					{{item.text}}
				</div>
			</div>

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
		</div>
	</li>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { TOGGLE_NORMAL_EDITOR, UPDATE_REPLY_PARAMS } from 'store/comment/mutationTypes';
import loginMixin from 'base/js/loginMixin';
import { formatCommentDate } from 'utils/comment';
import defaultAvatar from 'base/images/default_avatar@2x.png';
import BtnReply from 'components/comment/BtnReply';
import BtnLike from 'components/comment/BtnLike';
import Badge from 'components/comment/Badge';
import bookingCodeMixin from 'components/comment/bookingCodeMixin.js';

export default {
	name: 'CommentItem',
	mixins: [
		loginMixin,
		bookingCodeMixin
	],
	props: {
		// comment item 类型, 有 recent, top 2种
		type: {
			type: String,
			'default': 'recent'
		},
		item: {
			required: true,
			type: Object
		},
		topicId: {
			type: [Number, String],
			'default': ''
		},
		// 主评论id
		mainCommentId: {
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
		Badge
	},
	computed: {
		...mapState('comment', ['currentUserId']),
		avatarUrl() {
			const avatar = this.item.replyerAvatarUrl;
			return avatar ? `${__cdnOrigin__}/${avatar}` : defaultAvatar;
		},
		showDate() {
			return formatCommentDate(this.item.createTimestamp);
		},
		isAdmin() {
			// role == 1 为管理员账号
			return this.item.role === 1;
		},
		// 解析booking code后的 text 数组
		showTexts() {
			return this.resolveBookingCode(this.item.text);
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
				commentId: this.mainCommentId,
				toUserId: this.item.replyerUserId,
				toCommentId: this.item.commentId,
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
	position: relative;
	padding: 16/@rem 16/@rem 13/@rem 67/@rem;
	border-bottom: 1px solid @fogGrayBorder;

	&.m-comment-item--highlight {
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

	.m-avatar {
		border-radius: 50%;
		overflow: hidden;
		background: @lightGray;
		width: 36/@rem;
		height: 36/@rem;
		position: absolute;
		top: 15/@rem;
		left: 16/@rem;

		img {
			vertical-align: top;
			width: 100%;
			height: 100%;
		}
	}

	.m-nickname {
		font-size: 12/@rem;
		line-height: 16/@rem;
	}

	.m-item-content {
		margin-top: 4/@rem;
		font-size: 12/@rem;
		line-height: 16/@rem;
		word-wrap: break-word;
		color: @darker;
		background: #f2f3f5;
		padding: 8/@rem 12/@rem;
		border-radius: 4/@rem;
	}

	.m-item-footer {
		margin-top: 11/@rem;
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
</style>
