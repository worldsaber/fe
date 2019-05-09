<template>
	<div class="m-thread" @click="reply">
		<div class="m-item-header">
			<div class="m-flex-left">
				<div class="m-avatar">
					<img :src="avatarUrl" alt="">
				</div>

				<div class="m-meta">
					<div class="m-nickname">
						<span>{{item.replyerNickName}}</span>
						<!-- 管理员徽章 -->
						<Badge type="primary" v-if="isAdmin">Official</Badge>
					</div>

					<div class="m-time">{{showDate}}</div>
				</div>
			</div>

			<div class="m-flex-right">
				<BtnReply
					class="m-btn"
					:commentId="item.commentId"
					@click="reply">
				</BtnReply>

				<BtnLike
					class="m-btn"
					:postId="topicId"
					:commentId="item.commentId"
					:like="item.like"
					:likeCount="item.likeCount">
				</BtnLike>
			</div>
		</div>

		<div class="m-item-main">
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

			<!-- 用户分享的图片 -->
			<PicViews v-if="shareImgs.length" class="m-bet-images" :imgs="shareImgs"></PicViews>
		</div>
	</div>
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
import PicViews from 'components/comment/PicViews';

export default {
	name: 'Thread',
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
		}
	},
	components: {
		BtnReply,
		BtnLike,
		Badge,
		PicViews
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
			this.updateReplyParams({
				commentId: this.item.commentId
			});
			this.toggleNormalEditor(true);
		}
	}
};
</script>

<style lang="less">
@import '~base/styles/variable.less';
@import 'base/styles/icon.less';

.m-thread {
	position: relative;
	padding: 16/@rem 16/@rem 14/@rem;
	border-bottom: 10/@rem solid #f2f3f5;

	.m-avatar {
		border-radius: 50%;
		overflow: hidden;
		background: @lightGray;
		width: 36/@rem;
		height: 36/@rem;

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

	.m-time,
	.m-btn {
		font-size: 12/@rem;
		line-height: 16/@rem;
		color: @darkGray;
	}

	.m-item-content {
		font-size: 14/@rem;
		line-height: 18/@rem;
		word-wrap: break-word;
		color: @darker;
	}
}
.booking-code {
	font-size: 14/@rem;
	color: @green;
	text-decoration-line: underline;
}

.m-item-header {
	display: flex;
	align-items: center;
	justify-content: space-between;

	.m-flex-left {
		display: flex;
		align-items: center;
		justify-content: flex-start;

		.m-meta {
			margin-left: 14/@rem;
		}
	}

	.m-flex-right {
		text-align: right;

		.m-btn {
			display: inline-block;
			margin-left: 25/@rem;

			&:first-child {
				margin-left: 0;
			}
		}
	}
}

.m-item-main {
	margin-top: 10/@rem;

	.m-bet-images {
		margin-top: 8/@rem;
		text-align: center;
	}
}
</style>
