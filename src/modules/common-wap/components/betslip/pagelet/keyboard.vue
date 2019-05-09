<template>
    <div class="m-keyboard" v-show="showKeyboard" tabindex="0" @focus="show" @blur="hide" @keydown="handleKeydown">
		  <div class="m-keyboard-row">
			<span class="m-keyboard-key" v-for="n in 6" :data-key="n" :key="n" @click.stop="change">{{n}}</span>
			<span class="m-keyboard-key m-keyboard-delete" data-key="delete" @click.stop="change">
				<!-- svg关闭按钮直接内嵌 -->
				<svg width="24px" height="18px" viewBox="0 0 24 18" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
					<g id="UI" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
						<g id="Betslip-Basic-input" transform="translate(-301.000000, -457.000000)">
							<g id="Icon/backspace_24px" transform="translate(301.000000, 454.000000)">
								<g id="ic_backspace_black_24px">
									<polygon id="Shape" points="0 0 24 0 24 24 0 24"></polygon>
									<path d="M22,3 L7,3 C6.31,3 5.77,3.35 5.41,3.88 L0,12 L5.41,20.11 C5.77,20.64 6.31,21 7,21 L22,21 C23.1,21 24,20.1 24,19 L24,5 C24,3.9 23.1,3 22,3 Z M19,15.59 L17.59,17 L14,13.41 L10.41,17 L9,15.59 L12.59,12 L9,8.41 L10.41,7 L14,10.59 L17.59,7 L19,8.41 L15.41,12 L19,15.59 Z" id="Shape" fill="#FFFFFF" fill-rule="nonzero"></path>
								</g>
							</g>
						</g>
					</g>
				</svg>
			</span>
			<!-- <span class="m-keyboard-key m-keyboard-clear" data-key="clear" @click.stop="change">Clear</span> -->
		  </div>
		  <div class="m-keyboard-row">
			<span class="m-keyboard-key" v-for="n in [7, 8, 9, 0, '.']" :data-key="n" :key="n" @click.stop="change">{{n}}</span>
		  	<span class="m-keyboard-key m-keyboard-done" data-key="done" @click.stop="change">Done</span>
		  </div>
	  </div>
</template>
<script>
	const isNum = /^\d+$/;
	export default {
		props: {
			disableBlur: {
				type: Boolean,
				'default': false
			}
		},
		data () {
			return {
				showKeyboard: false
			};
		},
		methods: {
			// 方便电脑使用添加电脑键盘选择数字
			handleKeydown (e) {
				const key = e.key;
				if (isNum.test(key)) {
					this.$emit('key', key);
				} else if (e.keyCode === 13) {
					this.$emit('key', 'done');
				} else if (e.keyCode === 8) {
					this.$emit('key', 'clear');
				}
			},
			change (e) {
				this.$emit('key', e.currentTarget.getAttribute('data-key'));
			},
			show () {
				this.$emit('focus');
				this.showKeyboard = true;
			},
			hide () {
				this.$emit('blur');
				if (!this.disableBlur) {
					this.showKeyboard = false;
				}
				// 禁blur后暂不做任何处理
			}
		}
	};
</script>

<style lang="less" scoped>
	@import '~base/styles/variable.less';
	.m-keyboard{
			user-select: none;
			outline: none;
			position: relative;
			width: 100%;
			margin-top: 5/@rem;
			.m-keyboard-row{
				display: flex;
				.m-keyboard-key{
					background-color: @dark;
					color: @white;
					text-align: center;
					padding: 10/@rem 0;
					box-shadow: inset -1px -1px 0 0 fade(@lightGray, 15%);
					// box-shadow: -1px -1px 0 0 fade(@lightGray, 15%);
					flex: 1;

					&:active{
						background-color: @whiteGray;
					}
				}

				.m-keyboard-delete {
					svg {
						vertical-align: top;
					}
				}

				.m-keyboard-clear {
					font-size: 12/@rem;
				}

				.m-keyboard-done{
					flex:2;
					background-color: @green;
					&:active{
						background-color: @midGreen;
					}
				}
			}
		}
</style>
