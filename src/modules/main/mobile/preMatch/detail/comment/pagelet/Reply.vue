<template>
	<div class="m-reply-wrap">
		<div class="m-reply-avatar">
			<img :src="avatarUrl" alt="">
		</div>
		<div class="m-reply-content">
			<p class="m-text">{{reply.replyerNickName}}: {{reply.text}}</p>
		</div>
	</div>
</template>

<script>
import defaultAvatar from 'base/images/default_avatar@2x.png';

export default {
	name: 'CommentReply',
	props: {
		reply: {
			type: Object,
			required: true
		}
	},
	computed: {
		avatarUrl() {
			const avatar = this.reply.replyerAvatarUrl;
			return avatar ? `${__cdnOrigin__}/${avatar}` : defaultAvatar;
		}
	}
};
</script>

<style lang="less">
@import '~base/styles/variable.less';
@import 'base/styles/icon.less';

.m-reply-wrap {
	margin: 8/@rem 0;
	padding-left: 28/@rem;
	position: relative;
	box-sizing: border-box;
}

.m-reply-avatar {
	border-radius: 50%;
	overflow: hidden;
	background: @lightGray;
	width: 20/@rem;
	height: 20/@rem;
	position: absolute;
	top: 4/@rem;
	left: 0;

	img {
		vertical-align: top;
		width: 100%;
		height: 100%;
	}
}

.m-reply-content {
	display: inline-block;
	padding: 6/@rem 10/@rem;
	border-radius: 4/@rem;
	background: @fogGray;
	color: @darker;
	max-width: 100%;
	box-sizing: border-box;

	.m-text {
		font-size: 12/@rem;
		line-height: 16/@rem;
		word-wrap: break-word;
		overflow : hidden;
		// 多行省略
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}

}
</style>
