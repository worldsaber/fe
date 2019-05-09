<template>
	<div :class="['m-like-btn', { 'active': isLike }]" @click.stop="handleLike">
		<i class="m-icon-vote"></i>
		<span class="m-count">{{showCount}}</span>
	</div>
</template>

<script>
import { mapActions } from 'vuex';
import loginMixin from 'base/js/loginMixin';

export default {
	name: 'BtnLike',
	mixins: [loginMixin],
	props: {
		// 帖子 id
		postId: {
			type: [String, Number],
			required: true
		},
		// 评论 id
		commentId: {
			type: [String, Number],
			required: true
		},
		// 点赞状态，1 - 已点赞,  0 - 未点赞
		like: {
			type: [String, Number],
			required: true
		},
		// 点赞数量
		likeCount: {
			type: [String, Number]
		}
	},
	computed: {
		isLike() {
			return +this.like > 0;
		},
		showCount() {
			const count = this.likeCount || 0;
			return count < 1000 ? count : `${parseInt(count / 100, 10) / 10}k`;
		}
	},
	methods: {
		...mapActions('comment', ['commentLike']),
		// 点赞
		async handleLike() {
			// 校验及登录
			if (!this.checkLogin()) return;

			const { postId, commentId } = this;

			// 不能取消点赞
			if (this.isLike) return;

			try {
				await this.commentLike({
					commentId,
					postId,
					like: 1 // 点赞: 1; 取消点赞: 0
				});
			} catch (err) {
				console.log(err); // eslint-disable-line
				if (err.login === false) {
					return this.login();
				}
			}
		},
	}
};
</script>

<style lang="less">
@import '~base/styles/variable.less';
@import 'base/styles/icon.less';

.m-like-btn {
	font-size: 12/@rem;
	color: @darkGray;

	&.active {
		.m-icon-vote {
			vertical-align: middle;
			.m-icon-voted();

			&:before {
				color: @green;
				font-size: 16/@rem;
			}
		}

		.m-count {
			color: @green;
		}
	}

	.m-icon-vote {
		.m-icon-vote-up();

		&:before {
			font-size: 16/@rem;
			line-height: 1;
			color: @darkGray;
		}
	}

	.m-count {
		margin-left: 2/@rem;
		font-size: 12/@rem;
		line-height: 16/@rem;
		color: @darkGray;
	}
}
</style>
