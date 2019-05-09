<template>
	<div class="m-reply-btn" @click.stop="handleReply">
		<i class="m-icon-comment"></i>
		<span>Reply</span>
	</div>
</template>

<script>
import loginMixin from 'base/js/loginMixin';
import { checkNickname } from 'components/nickName';

export default {
	name: 'BtnReply',
	mixins: [loginMixin],
	props: {
		// 评论 id
		commentId: {
			type: [String, Number],
			required: true
		}
	},
	methods: {
		// 打开编辑器，进行回帖
		handleReply() {
			// 校验及登录
			if (!this.checkLogin()) return false;
			if (!checkNickname()) {
				return;
			}
			this.$emit('click');
		}
	}
};
</script>

<style lang="less">
@import '~base/styles/variable.less';
@import 'base/styles/icon.less';

.m-reply-btn {
	font-size: 12/@rem;
	color: @darkGray;

	.m-icon-comment {
		vertical-align: middle;
		.m-icon-comment-message();

		&:before {
			color: @darkGray;
			font-size: 16/@rem;
			line-height: 1;
		}
	}
}
</style>
