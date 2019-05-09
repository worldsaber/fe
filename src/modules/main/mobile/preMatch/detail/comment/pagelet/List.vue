<template>
	<div class="m-comment-list-wrap">
		<div class="m-title" v-if="title">{{title}}</div>
		<ul class="m-comment-list">
			<template v-for="(item, index) in list">
				<CommentItem
					:key="index"
					:item="item"
					:topicId="topicId"
					:currentUserId="currentUserId"
					:isShowLikeBtn="isShowLikeBtn"
					:isShowReplyBtn="isShowReplyBtn">
				</CommentItem>
			</template>
		</ul>
	</div>
</template>

<script>
import CommentItem from './Item.vue';

export default {
	name: 'CommentList',
	components: {
		CommentItem
	},
	props: {
		list: {
			type: Array,
			required: true
		},
		topicId: {
			type: [Number, String],
			'default': ''
		},
		currentUserId: {
			type: [Number, String],
			'default': ''
		},
		title: {
			type: String,
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
	}
};
</script>

<style lang="less">
@import '~base/styles/variable.less';

.m-comment-list-wrap {
	.m-title {
		font-size: 12/@rem;
		line-height: 14/@rem;
		padding: 10/@rem 16/@rem 0;
	}
}
</style>
