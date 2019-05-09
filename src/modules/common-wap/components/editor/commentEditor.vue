<template>
	<div class="m-comment-editor-wrap" v-show="visible">
		<div class="m-mask" @click.stop="handleClose"></div>
		<div class="m-comment-editor" ref="editor">
			<div class="m-input-wrap" tabindex="0" @focus="focus" @blur="blur">
				<textarea
					ref="input"
					class="m-input"
					autofocus
					:placeholder="placeholder"
					:maxLength="maxLength"
					v-model.trim="inputValue"
					@focus="inputFocus">
				</textarea>
			</div>

			<div class="m-editor-footer">
				<div class="m-editor-footer-left">
					<div class="m-emoji-btn" @click="handleEmoji">
						<template v-if="!isShowEmoji">
							<svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
							    <defs></defs>
							    <g id="Icon/24_emoji" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
							        <path d="M11.99,2 C6.47,2 2,6.48 2,12 C2,17.52 6.47,22 11.99,22 C17.52,22 22,17.52 22,12 C22,6.48 17.52,2 11.99,2 Z M12,20 C7.58,20 4,16.42 4,12 C4,7.58 7.58,4 12,4 C16.42,4 20,7.58 20,12 C20,16.42 16.42,20 12,20 Z M15.5,11 C16.33,11 17,10.33 17,9.5 C17,8.67 16.33,8 15.5,8 C14.67,8 14,8.67 14,9.5 C14,10.33 14.67,11 15.5,11 Z M8.5,11 C9.33,11 10,10.33 10,9.5 C10,8.67 9.33,8 8.5,8 C7.67,8 7,8.67 7,9.5 C7,10.33 7.67,11 8.5,11 Z M12,17.5 C14.33,17.5 16.31,16.04 17.11,14 L6.89,14 C7.69,16.04 9.67,17.5 12,17.5 Z" id="Shape" fill="#9ca0ab" fill-rule="nonzero"></path>
							    </g>
							</svg>
						</template>
						<i class="m-icon-keyboard" v-else></i>
					</div>
				</div>

				<div class="m-editor-footer-right">
					<div class="m-words-count" v-show="wordsCount >= showLimit">{{wordsCount}}/{{maxLength}}</div>
					<button :class="['m-submit-btn', {
						disabled: isDisabled,
						loading: loading
					}]" @click="handleSubmit">
						<i class="m-icon-loading" v-show="loading"></i>
						<span v-show="!loading">Send</span>
					</button>
				</div>
			</div>

			<Emoji
				v-if="isShowEmoji"
				class="m-emoji"
				@click="addEmoji"
				@delete="handleDelete">
			</Emoji>
		</div>
	</div>
</template>

<script>
import Emoji from './emoji/index.vue';

export default {
	name: 'CommentEditor',
	props: {
		visible: {
			type: Boolean,
			'default': false
		},
		placeholder: {
			type: String,
			'default': 'Write a comment...'
		},
		maxLength: {
			type: [Number, String],
			'default': 280
		},
		// 多少字符时显示计数
		showLimit: {
			type: [Number, String],
			'default': 260
		},
		// submit loading
		loading: {
			type: Boolean,
			'default': false
		},
		scrollIntoViewOption: {
			type: Boolean,
			'default': true
		}
	},
	components: {
		Emoji
	},
	data() {
		return {
			inputValue: '',
			isShowEmoji: false
		};
	},
	computed: {
		wordsCount() {
			// emoji 当做一个字符处理
			// return Array.from(this.inputValue).length;
			// 还是常规处理吧，emoji是几就是几
			return this.inputValue.length;
		},
		isDisabled() {
			return !this.inputValue || this.loading;
		}
	},
	watch: {
		visible: {
			immediate: true,
			handler(val) {
				if (val) {
					this.$nextTick(() => {
						this.focus();
					});
				} else {
					this.reset();
				}
			}
		},
		isShowEmoji(val) {
			if (!val) {
				this.focus();
			}
		}
	},
	methods: {
		reset() {
			this.inputValue = '';
		},
		handleEmoji() {
			this.blur();
			this.isShowEmoji = !this.isShowEmoji;
		},
		addEmoji(emoji) {
			const result = this.inputValue + emoji;
			if (result.length >= this.maxLength) return;
			this.inputValue = result;
		},
		handleDelete() {
			if (!this.inputValue) return;
			// 注意emoji字符长度
			const inputValueArr = Array.from(this.inputValue);
			inputValueArr.pop();
			this.inputValue = inputValueArr.join('');
		},
		focus() {
			this.$refs.input.focus();
		},
		inputFocus() {
			this.isShowEmoji = false;

			const editor = this.$refs.editor;
			if (editor && 'scrollIntoView' in editor) {
				editor.scrollIntoView(this.scrollIntoViewOption);
				editor.scrollIntoViewIfNeeded();
			}
		},
		blur() {
			this.$refs.input.blur();
		},
		handleClose(e) {
			// 清除输入内容
			this.inputValue = '';
			this.isShowEmoji = false;
			this.$emit('close');
		},
		handleSubmit() {
			// 允许空值通过，请在业务处处理
			if (this.loading) return;
			this.$emit('submit', this.inputValue);
		}
	}
};
</script>

<style lang="less" scoped>
@import '~base/styles/variable.less';
@import 'base/styles/icon.less';
@import 'base/styles/animate.less';

.m-comment-editor-wrap {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 99;

	.m-mask {
		width: 100%;
		height: 100%;
	}

	.m-emoji {
		border-top: 1px solid @fogGrayBorder;
	}
}

.m-comment-editor {
	min-height: 94/@rem;
	position: absolute;
	bottom: 0;
	left: 0;
	width: 100%;
	box-sizing: border-box;
	background: @white;
	box-shadow: 0 2/@rem 6/@rem 0 rgba(0, 0, 0, 0.5);
	outline: none;

	.m-input-wrap {
		padding: 11/@rem 12/@rem 0;
	}

	.m-input {
		width: 100%;
		min-height: 50/@rem;
		box-sizing: border-box;
		padding: 4/@rem;
		border: 0;
		outline: none;
		font-size: 12/@rem;
		line-height: 14/@rem;

		::placeholder {
			color: @darkGray;
		}
	}

	.m-editor-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 12/@rem 11/@rem;

		&-right {
			display: flex;
			align-items: center;
			justify-content: flex-end;
		}
	}

	.m-emoji-btn {
		img,
		svg {
			width: 20/@rem;
			height: 20/@rem;
			vertical-align: top;
		}

		.m-icon-keyboard {
			.m-icon-keyboard();

			&:before {
				font-size: 20/@rem;
				line-height: 1;
				color: #9ca0ab;
			}
		}
	}

	.m-words-count {
		font-size: 12/@rem;
		line-height: 14/@rem;
		color: @darkGray;
		margin-right: 12/@rem;
	}

	.m-submit-btn {
		min-width: 60/@rem;
		padding: 0 12/@rem;
		box-sizing: border-box;
		height: 24/@rem;
		line-height: 24/@rem;
		border: 0;
		outline: none;
		border-radius: 2/@rem;
		color: @white;
		background: @green;
		font-size: 12/@rem;
		font-weight: bold;
		text-align: center;

		&.disabled {
			background: @midGray;
			color: @white;
		}

		&.loading {

		}

		.m-icon-loading {
			display: inline-block;
			animation: circles 0.8s linear infinite;
			.m-icon-loading();

			&:before {
				vertical-align: top;
			}
		}
	}
}
</style>
