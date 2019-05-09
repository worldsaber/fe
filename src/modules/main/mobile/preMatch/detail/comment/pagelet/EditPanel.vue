<template>
	<div class="m-comment-edit-wrap">
		<Editor
			v-show="showEditor"
			:visible="showEditor"
			class="m-editor-wrap"
			v-model="value"
			placeholder="Write a comment...">
			<div class="m-eidtor-header" slot="header">
				<div class="m-cancel-btn" @click="handleCancel">Cancel</div>

				<div class="m-title-wrap">
					<h2 class="m-title">Comment</h2>
					<div class="m-small-title">{{teamInfo}}</div>
				</div>

				<AfButton class="m-send-btn"
					:class="{
						disabled: isDisabled
					}"
					@click="handleSubmit(value)">
					<i class="m-icon-loading" v-show="loading"></i>
					<span v-show="!loading">Send</span>
				</AfButton>
			</div>
		</Editor>

		<NormalEditor
			:visible="showNormalEditor"
			class="m-comment-edit"
			:placeholder="normalPlaceholder"
			:maxLength="280"
			:showLimit="260"
			:loading="loading"
			@submit="handleSubmit"
			@close="toggleNormalEditor(false)">
		</NormalEditor>

		<BetLoading v-show="loading" @click.stop="() => {}"></BetLoading>
	</div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import { TOGGLE_EDITOR, TOGGLE_NORMAL_EDITOR } from 'store/comment/mutationTypes';
import { RESET_SCROLL } from 'store/layout/mutationTypes';
import { DELETE_IMG_DATA_LIST, UPDATE_BOOKING_CODE } from 'store/shareBet/mutationTypes';
import loginMixin from 'base/js/loginMixin';
import { EventBus } from 'kernel/js/eventBus';
import AfButton from 'packages/button/button';
import NormalEditor from 'components/editor';
import BetLoading from 'components/betLoading';
import Editor from './Editor';

export default {
	name: 'Edit',
	mixins: [loginMixin],
	components: {
		AfButton,
		Editor,
		NormalEditor,
		BetLoading
	},
	props: {
		topicId: {
			type: [Number, String],
			'default': ''
		},
		// 比赛信息，格式如 `${homeTeamName} v ${awayTeamName}`
		teamInfo: {
			type: String,
			'default': ''
		}
	},
	data() {
		return {
			loading: false,
			scrollElement: null,
			value: '',
		};
	},
	computed: {
		...mapState('layout', ['scrollPayload']),
		...mapState('comment', ['showEditor', 'showNormalEditor', 'recentComments', 'toNickname']),
		...mapState('shareBet', ['imgDataList', 'bookingCode']),
		isDisabled() {
			return (!this.value && !this.imgDataList.length) || this.loading;
		},
		normalPlaceholder() {
			const { toNickname } = this;
			return toNickname ? `Reply to ${toNickname}` : 'Write a comment...';
		}
	},
	watch: {
		showEditor(val) {
			const { scrollElement } = this;
			if (val) {
				scrollElement && scrollElement.addClass('no-scroll');
			} else {
				scrollElement && scrollElement.removeClass('no-scroll');
			}
		}
	},
	methods: {
		...mapMutations('layout', {
			resetScroll: RESET_SCROLL
		}),
		...mapMutations('comment', {
			toggleEditor: TOGGLE_EDITOR,
			toggleNormalEditor: TOGGLE_NORMAL_EDITOR
		}),
		...mapActions('comment', ['getCommentList', 'getTopCommentList', 'comment', 'uploadCommentPics']),
		...mapMutations('shareBet', {
			deleteImgDataList: DELETE_IMG_DATA_LIST,
			updateBookingCode: UPDATE_BOOKING_CODE
		}),
		scrollToLocate() {
			// 滚动到评论列表顶部
			const tabNavs = document.querySelector('.m-prematch-detail .m-tab-navs');
			const target = document.querySelector('.m-recent-comments');
			let top = this.scrollPayload.scrollTop;
			if (tabNavs) {
				top -= tabNavs.offsetHeight;
			}
			if (target) {
				top += target.getBoundingClientRect().top;
			}
			this.resetScroll({ top });
		},
		async handleSubmit(value) {
			// 评论内容
			let text = this.showEditor ? this.value : value;

			// 发图/发文，至少二选一
			if (!text && !this.imgDataList.length) {
				return this.$toast('Please write a comment');
			}

			// 如果有分享订单, 且有 bookingCode, 则追加以下文案
			if (this.bookingCode) {
				text = `${text} Booking Code: ${this.bookingCode}`;
			}

			const postId = this.topicId;

			this.loading = true;

			const body = {
				postId,
				text,
				product: 3
			};

			try {
				// 如果有图片上传
				if (this.imgDataList.length) {
					const file = this.imgDataList[0];
					const picRes = await this.uploadCommentPics(file);
					body.url = picRes.join(',');
				}

				const res = await this.comment(body);

				this.loading = false;

				// success
				if (res.result === 100) {
					this.$toast('Sent successfully');
					const input = document.querySelector('.m-comment-editor .m-input');
					input && input.blur();

					// 清空内容
					this.clear();
					// 关闭编辑器
					this.close();

					await Promise.all([
						this.getCommentList({ postId, product: 3 }),
						this.getTopCommentList({ postId })
					]);

					// 滚动到指定位置
					this.scrollToLocate();

					// 通知评论列表submit完成
					EventBus.$emit('afterSubmit');
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
			this.toggleEditor(false);
			this.toggleNormalEditor(false);
		},
		clear() {
			this.value = '';
			// 清空订单图
			this.deleteImgDataList();
			// 清空订单booking code
			this.updateBookingCode();
		},
		handleCancel() {
			if (!this.value && !this.imgDataList.length) {
				this.close();
			} else {
				this.$dialog({
					title: null,
					content: 'Are you sure you want to quit editing?',
					button: ['No', 'Yes']
				})
				.onBtnClick(type => {
					if (type === 1) {
						// Yes
						this.close();
						this.clear();
					}
				});
			}
		},
	},
	mounted() {
		this.scrollElement = document.querySelector('.m-main-mid') || document.body;
	}
};
</script>


<style lang="less">
@import '~base/styles/variable.less';
@import 'base/styles/icon.less';
@import 'base/styles/animate.less';

.no-scroll {
	overflow: hidden!important;
}

.m-comment-edit-wrap {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
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

		&.disabled {
			background: @midGray;
			color: @white;
		}
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

	.m-icon-loading {
		display: inline-block;
		animation: circles 0.8s linear infinite;
		.m-icon-loading();

		&:before {
			vertical-align: top;
		}
	}

	.m-bet-loading {
		z-index: 10000;
	}
}
</style>
