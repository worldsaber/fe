<template>
	<ul class="m-official-comments">
		<template v-for="(item, index) in officialComments">
			<CommentItem
				:item="item"
				:topicId="topicId"
				:currentUserId="currentUserId"
				:isShowLikeBtn="false"
				:isShowReplyBtn="false"
				:key="index">
			</CommentItem>
		</template>
	</ul>
</template>

<script>
import { mapState } from 'vuex';
import CommentItem from './Item.vue';

export default {
	name: 'OfficialComments',
	components: {
		CommentItem
	},
	props: {
		topicId: {
			type: [Number, String],
			'default': ''
		}
	},
	computed: {
		...mapState('comment', ['currentUserId', 'officialComments'])
	},
};
</script>

<style lang="less">
@import '~base/styles/variable.less';

.m-official-comments {
	border-bottom: 6/@rem solid @fogGray;

	.m-comment-item {
		&:last-child {
			border: 0;
		}

		.m-nickname {
			font-weight: bold;
		}
	}
}
</style>
