<template>
	<div class="m-eidtor">
		<slot name="header"></slot>

		<div class="m-editor-main">
			<textarea
				class="m-content"
				autofocus
				:placeholder="placeholder"
				:maxLength="maxLength"
				v-model.trim="innerText"
				@input="handleInput"
				ref="textarea">
			</textarea>

			<template v-if="imgDataList.length">
				<div class="m-img-views" v-viewer>
					<div class="m-img-wrap" v-for="(item, index) in imgDataList" :key="index">
						<div class="m-img-container">
							<img :src="item" alt="">
						</div>
						<div class="m-icon-close m-close-btn" @click="handleCloseImg(index)"></div>
					</div>
				</div>
			</template>

			<div class="m-words-count" v-show="wordsCount >= showLimit">{{wordsCount}}/{{maxLength}}</div>
		</div>

		<div class="m-editor-footer">
			<div class="m-btn-group">
				<div class="m-emoji-btn" @click="handleEmoji">
					<i class="m-icon m-icon-emoji" v-if="!isShowEmoji"></i>
					<i class="m-icon m-icon-keyboard" v-else></i>
				</div>

				<div class="m-share-btn" @click="showChooseBet">Share my bet</div>
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
import { mapState, mapMutations } from 'vuex';
import { TOGGLE_EDITOR, TOGGLE_SHOW_ORDER } from 'store/comment/mutationTypes';
import { DELETE_IMG_DATA_LIST, TOOGLE_BET_VISIBLE, UPDATE_BOOKING_CODE } from 'store/shareBet/mutationTypes';
import AfButton from 'packages/button/button';
import Emoji from 'components/editor/emoji';
import 'packages/imageBrowser';

export default {
	name: 'Editor',
	components: {
		AfButton,
		Emoji
	},
	props: {
		visible: {
			type: Boolean,
			'default': true
		},
		value: {
			type: String,
			'default': ''
		},
		placeholder: {
			type: String,
			'default': ''
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
	},
	data() {
		return {
			isShowEmoji: false,
			innerText: '',
		};
	},
	computed: {
		...mapState('shareBet', ['imgDataList']),
		wordsCount() {
			// emoji 当做一个字符处理
			return this.innerText.length;
		},
	},
	watch: {
		value(val) {
			if (!val) {
				this.innerText = '';
			}
		},
		visible (val) {
			if (val) {
				this.$nextTick(() => {
					this.focus();
				});
			}
		},
	},
	methods: {
		...mapMutations('comment', {
			toggleEditor: TOGGLE_EDITOR,
			toggleShowOrder: TOGGLE_SHOW_ORDER
		}),
		...mapMutations('shareBet', {
			deleteImgDataList: DELETE_IMG_DATA_LIST,
			toogleBetVisible: TOOGLE_BET_VISIBLE,
			updateBookingCode: UPDATE_BOOKING_CODE
		}),
		// 自适应 textarea height
		adaptTextareaHeight() {
			const { clientHeight, scrollHeight } = this.$refs.textarea;
			if (scrollHeight > clientHeight) {
				this.$refs.textarea.style.height = `${scrollHeight}px`;
			}
		},
		handleInput() {
			this.$emit('input', this.innerText);
			this.adaptTextareaHeight();
		},
		handleEmoji() {
			this.isShowEmoji = !this.isShowEmoji;
		},

		addEmoji(emoji) {
			const result = this.innerText + emoji;
			if (result.length >= this.maxLength) return;
			this.innerText = result;
			this.$emit('input', this.innerText);
		},
		handleDelete() {
			if (!this.innerText) return;
			// 注意emoji字符长度
			const valueArr = Array.from(this.innerText);
			valueArr.pop();
			this.innerText = valueArr.join('');
			this.$emit('input', this.innerText);
		},
		// close img
		handleCloseImg(index) {
			this.deleteImgDataList(index);
			// 清空订单booking code
			this.updateBookingCode();
		},
		showChooseBet() {
			this.toggleEditor(false);
			this.toggleShowOrder({ status: true, whereToShare: 1 });
			this.toogleBetVisible(true);
		},
		focus() {
			this.$refs.textarea.focus();
		}
	},
	mounted() {
		this.focus();
	},
};
</script>

<style lang="less" scoped>
@import '~base/styles/variable.less';
@import 'base/styles/icon.less';

.m-eidtor {
	width: 100%;
	height: 100%;
	z-index: 99;
	background: @white;
	position: relative;
}

.m-editor-main {
	padding: 10/@rem 12/@rem;
	min-height: 170/@rem;
	position: relative;

	.m-content {
		display: block;
		width: 100%;
		min-height: 72/@rem;
		max-height: 170/@rem;
		font-size: 14/@rem;
		line-height: 20/@rem;
		color: @dark;
		outline: none;
		border: 0;
	}

	.m-words-count {
		font-size: 12/@rem;
		line-height: 14/@rem;
		text-align: right;
		color: @darkGray;
		margin-right: 12/@rem;
		position: absolute;
		right: 0;
		bottom: 10/@rem;
	}
}

.m-editor-footer {
	background: #fff;
	box-shadow: 0 0 6px 0 rgba(53, 58, 69, 0.2);
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;

	.m-share-btn {
		margin-left: 12/@rem;
		min-width: 88/@rem;
		height: 26/@rem;
		line-height: 26/@rem;
		padding: 0 8/@rem;
		box-sizing: border-box;
		border-radius: 13/@rem;
		border: 1px solid @green;
		font-size: 12/@rem;
		color: @green;
	}
}

.m-btn-group {
	height: 44/@rem;
	padding: 0 12/@rem;
	display: flex;
	align-items: center;
	justify-content: flex-start;
}

.m-icon-emoji {
	.m-icon-emoji();

	&:before {
		color: @green;
		font-size: 24/@rem;
		line-height: 26/@rem;
	}
}

.m-icon-keyboard {
	.m-icon-keyboard();

	&:before {
		color: #9ca0ab;
		font-size: 24/@rem;
		line-height: 26/@rem;
	}
}
</style>

<style lang="less">
@import '~base/styles/variable.less';
@import 'base/styles/icon.less';

.m-editor-main {
	.m-img-wrap {
		width: 100/@rem;
		height: 100/@rem;
		border: 1px solid #dcdee5;
		position: relative;
	}
	.m-img-container {
		width: 100%;
		height: 100%;
		overflow: hidden;

		img {
			display: block;
			width: 100%;
		}
	}

	.m-icon-close {
		.m-icon-close();

		&:before {
			color: #fff;
			line-height: 18/@rem;
			font-size: 13/@rem;
			vertical-align: middle;
		}
	}

	.m-close-btn {
		position: absolute;
		right: -10/@rem;
		top: -10/@rem;
		width: 18/@rem;
		height: 18/@rem;
		text-align: center;
		background: #9ca0ab;
		border: 2/@rem solid #fff;
		border-radius: 50%;
		box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.5);
	}
}
</style>
