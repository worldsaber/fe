<template>
	<div class="m-comment-edit-wrap">
		<CommentEditor
			:visible="showNormalEditor"
			class="m-comment-edit"
			:placeholder="placeholder"
			:maxLength="280"
			:showLimit="260"
			:loading="loading"
			@submit="handleSubmit"
			@close="toggleNormalEditor(false)">
		</CommentEditor>
	</div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import { TOGGLE_NORMAL_EDITOR } from 'store/comment/mutationTypes';
import { RESET_SCROLL } from 'store/layout/mutationTypes';
import loginMixin from 'base/js/loginMixin';
import AfButton from 'packages/button/button';
import CommentEditor from 'components/editor';

export default {
	name: 'EditPanel',
	mixins: [loginMixin],
	components: {
		AfButton,
		CommentEditor
	},
	props: {
		postId: {
			type: [Number, String],
			'default': ''
		},
		commentId: {
			type: [Number, String],
			'default': ''
		},
		// 主评论的 nickname
		postNickname: {
			type: String,
			'default': ''
		}
	},
	data() {
		return {
			loading: false,
			value: '',
		};
	},
	computed: {
		...mapState('comment', ['showNormalEditor', 'toNickname']),
		placeholder() {
			const { toNickname, postNickname } = this;
			return `Reply to ${toNickname || postNickname}`;
		}
	},
	methods: {
		...mapMutations('layout', {
			resetScroll: RESET_SCROLL
		}),
		...mapMutations('comment', {
			toggleNormalEditor: TOGGLE_NORMAL_EDITOR
		}),
		...mapActions('comment', ['comment', 'getCommentList']),
		async handleSubmit(value) {
			if (!value) {
				return this.$toast('Please write a comment');
			}

			const { postId, commentId } = this;

			this.loading = true;

			const body = {
				postId,
				text: value,
				commentId,
				product: 3
			};

			try {
				const res = await this.comment(body);

				this.loading = false;

				// success
				if (res.result === 100) {
					this.$toast('Sent successfully');
					const input = document.querySelector('.m-comment-editor .m-input');
					input && input.blur();

					this.getCommentList({ postId, commentId, product: 3 });

					this.toggleNormalEditor(false);

					// 滚动到顶部
					this.resetScroll({ top: 0 });

					this.$emit('afterSubmit');
				} else {
					this.$toast(res.resultDesc || 'Failed to send, please try again');
				}
			} catch (err) {
				console.log(err); // eslint-disable-line
				this.loading = false;

				if (err.login === false) {
					return this.login();
				}

				this.$toast(err.message || 'Failed to send, please try again');
			}
		},
		close() {
			this.toggleNormalEditor(false);
		}
	}
};
</script>


<style lang="less">
@import '~base/styles/variable.less';
@import 'base/styles/icon.less';

.no-scroll {
	overflow: hidden!important;
}

.m-comment-edit-wrap {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;

	.m-img-container {
		width: 100/@rem;
		height: 100/@rem;
		overflow: hidden;
		border: 1px solid #dcdee5;

		img {
			display: block;
			width: 100%;
		}
	}
}

.m-eidtor-wrap {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 99;
	background: @white;
}

.m-eidtor-header {
	height: 48/@rem;
	padding: 0 12/@rem;
	border-bottom: 1px solid @fogGrayBorder;
	display: flex;
	align-items: center;
	justify-content: space-between;

	.m-cancel-btn {
		color: #3656a3;
		font-size: 14/@rem;
		line-height: 28/@rem;
	}

	.m-send-btn {
		font-size: 14/@rem;
		color: @white;
		background: @green;
		height: 28/@rem;
		line-height: 28/@rem;
		min-width: 60/@rem;
		text-align: center;
		padding: 0 12/@rem;
		box-sizing: border-box;
		border-radius: 2/@rem;
		border: 0;
	}

	.m-title-wrap {
		flex: 1;
		text-align: center;
		width: 60%;
	}

	.m-title {
		font-size: 18/@rem;
		color: @dark;
		line-height: 20/@rem;
	}

	.m-small-title {
		font-size: 12/@rem;
		color: @darkGray;
		line-height: 1;
		width: 80%;
		margin: 0 auto;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
}
</style>
