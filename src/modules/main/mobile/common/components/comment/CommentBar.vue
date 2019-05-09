<template>
	<div class="m-comment-bar">
		<div class="m-share-btn" @click="shareBet" v-if="isShowShareBet">Share my bet</div>

		<div class="m-write-btn" @click="startWrite">
			<i class="m-icon-edit"></i>
			<span class="m-text">{{placeholder}}</span>
		</div>
	</div>
</template>

<script>
import { checkNickname } from 'components/nickName';
import loginMixin from 'base/js/loginMixin';

export default {
	name: 'CommentBar',
	mixins: [loginMixin],
	props: {
		placeholder: {
			type: String,
			'default': 'Write a comment...'
		},
		// 是否显示 share my bet 按钮
		isShowShareBet: {
			type: Boolean,
			'default': true
		}
	},
	methods: {
		shareBet() {
			// 校验及登录
			if (!this.checkLogin()) return false;
			this.$emit('share');
		},
		startWrite() {
			// 校验及登录
			if (!this.checkLogin()) return false;
			if (!checkNickname()) {
				return;
			}
			this.$emit('click');
		},
	}
};
</script>

<style lang="less">
@import '~base/styles/variable.less';
@import 'base/styles/icon.less';

.m-comment-bar {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	z-index: 98;
	padding: 0 12/@rem;
	height: 50/@rem;
	background: @white;
	box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;

	.m-share-btn {
		min-width: 88/@rem;
		height: 30/@rem;
		line-height: 30/@rem;
		padding: 0 8/@rem;
		box-sizing: border-box;
		border-radius: 15/@rem;
		border: 1px solid @green;
		font-size: 12/@rem;
		color: @green;
	}

	.m-write-btn {
		flex: 1;
		margin-left: 8/@rem;
		height: 30/@rem;
		line-height: 30/@rem;
		border-radius: 15/@rem;
		text-align: center;
		font-size: 12/@rem;
		color: @dark;
		background: @fogGray;

		.m-icon-edit {
			margin-left: 9/@rem;
			.m-icon-edit();

			&:before {
				font-size: 16/@rem;
			}
		}

		.m-text {
			vertical-align: top;
		}
	}
}
</style>
