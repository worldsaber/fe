<template>
	<div class="m-message-item" @click="handleClick">
		<div class="m-avatar">
			<img :src="avatarUrl" alt="">
		</div>

		<div class="m-comment-item-main">
			<div class="m-meta">
				<div class="m-nickname">
					<span>{{item.detail.info.name}}</span>
					<!-- 管理员徽章 -->
					<Badge type="primary" v-if="isAdmin">Official</Badge>
				</div>

				<div class="m-time">{{showDate}}</div>
			</div>

			<div class="m-item-desc m-item-content">{{messageDesc}}</div>

			<!-- 引用回复 -->
			<div class="m-item-reply">
				<MessageReferrer
					:content="referrerContent"
					:shareImgs="referrerImgs">
				</MessageReferrer>
			</div>

			<!-- 消息内容 -->
			<div class="m-item-info">
				<!-- showReplyTexts -->
				<div class="m-item-content" v-if="showReplyTexts.length">
					<template v-for="(text, i) in showReplyTexts">
						<span :key="i" v-if="!bookingCodes.includes(text)">{{text}}</span>
						<!-- booking code -->
						<template v-else>
							<span :key="i" class="booking-code" @click.stop="goToBetslip(text)">{{text}}</span>
						</template>
					</template>
				</div>

				<div class="m-item-content" v-else>{{item.detail.info.reply}}</div>
			</div>
		</div>
	</div>
</template>

<script>
import { formatCommentDate } from 'utils/comment';
import defaultAvatar from 'base/images/default_avatar@2x.png';
import { pagePath } from 'config/pageConfig';
import bookingCodeMixin from 'components/comment/bookingCodeMixin.js';
import Badge from 'components/comment/Badge';
import MessageReferrer from './Referrer';

export default {
	name: 'MessageItem',
	mixins: [
		bookingCodeMixin
	],
	props: {
		item: {
			required: true,
			type: Object
		},
	},
	components: {
		Badge,
		MessageReferrer
	},
	data() {
		return {
			bookingCodes: [],
		};
	},
	computed: {
		avatarUrl() {
			const avatar = this.item.detail.info.avatar;
			return avatar ? `${__cdnOrigin__}/${avatar}` : defaultAvatar;
		},
		showDate() {
			return formatCommentDate(this.item.detail.info.displayTime);
		},
		// Reply to your comment 之类的描述
		messageDesc() {
			return this.item.detail.info.inter;
		},
		referrerContent() {
			return `Me: ${this.item.detail.info.ctt || ''}`;
		},
		referrerImgs() {
			return this.item.detail.info.url || [];
		},
		replyContent() {
			return this.item.detail.info.reply || '';
		},
		// 解析booking code后的 text 数组
		showReplyTexts() {
			return this.resolveBookingCode(this.replyContent);
		},
		isAdmin() {
			// role == 1 为管理员账号
			return this.item.role === 1;
		},
	},
	methods: {
		handleClick() {
			const { type } = this.item;
			const { postId, firstCommentId, replyCommentId, likeCommentId } = this.item.detail;
			let lastId;
			// type: 评论回复1； 评论点赞4； 系统消息5；
			if (type === 1) {
				lastId = replyCommentId;
			} else if (type === 4) {
				lastId = likeCommentId;
			}
			let url = `${pagePath.commentDetails}?postId=${postId}&commentId=${firstCommentId}`;
			if (lastId) {
				url = `${url}&lastId=${lastId}`;
			}
			window.location.href = url;
		}
	}
};
</script>

<style lang="less">
@import '~base/styles/variable.less';
@import 'base/styles/icon.less';

.m-message-item {
	list-style: 0;
	position: relative;
	padding: 15/@rem 16/@rem 15/@rem 66/@rem;
	border-bottom: 1px solid @fogGrayBorder;
	color: @darker;

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
		font-size: 14/@rem;
		line-height: 18/@rem;
		word-wrap: break-word;
	}

	.m-meta {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.m-time {
		font-size: 12/@rem;
		color: @darkGray;
	}
}

.m-item-desc {
	margin-top: 6/@rem;

	&:first-letter {
		text-transform: capitalize;
	}
}

.booking-code {
	font-size: 14/@rem;
	color: @green;
	text-decoration-line: underline;
}

.m-item-reply {
	margin-top: 10/@rem;

	.m-replies-count {
		margin-left: 28/@rem;
		font-size: 12px;
		font-weight: 500;
		line-height: 16/@rem;
		color: #3656a3;
	}
}
</style>
