<template>
  <div :class="['af-select', {disable: disable}, {'af-select-open': isShowList}]" :tabindex="tabindex" @blur="close">
	  <!-- @touchstart.stop="toggle" -->
	  <div class="af-select-title" @click="toggle">
	  	<input
		  ref='input' v-if="!readonly"
		  type="input" :value="value.name || value"
		  @input="inputChange" class="af-select-input" :placeholder="placeholder"/>
		<span ref="readInput" v-else class="af-select-input">{{value.name || value || ''}}<em class="placeholder" v-if="placeholder!=='' && !(value.name || value) ">{{placeholder}}</em></span>
		<span class="af-select-icon-item"><em class="icon">^</em></span>
	  </div>
  </div>
</template>


<script>
	/**
	 * 下拉列表 组件
	 */
	import Vue from 'vue';
	import ItemList from './itemList';

	let currentOpen = null;
	export default {
		name: 'AfSelect',
		props: {
			placeholder: {
				type: String,
				'default': ''
			},
			// 组件只读
			readonly: {
				type: Boolean,
				'default': true
			},
			// 选择的时候是否关闭
			closeOnSelect: {
				type: Boolean,
				'default': true
			},
			// 渲染每个item的模版
			itemTemplate: {
				type: Object
			},
			// 分组title的模版
			itemGroupTitle: {
				type: Object
			},
			// 无结果的模版
			noResultTemplate: {
				type: Object
			},
			isGroup: {
				type: Boolean,
				'default': false
			},
			// 组件禁止
			disable: {
				type: Boolean,
				'default': false
			},
			// 组件数据
			data: {
				type: Array,
				default () {
					return [];
				}
			},
			// 下拉列表的宽度，当是0的时候表示和input的宽度相同, null 表示不计算宽度
			ListWidth: {
				type: [Number, String],
				'default': 0
			},
			// 组件当前值
			value: {
				type: [String, Object],
				'default': ''
			},
			tabindex: {
				type: Number,
				'default': 0
			},
			// 是否将列表插入body，如果是否则会插入到对应的 下拉列表里面
			// 是否默认插入滑动的元素，默认滑动元素是body
			isInsertScrollEle: {
				type: Boolean,
				'default': false
			},
			scrollEleSelector: {
				type: String,
				defalult: 'body',
			},
			// 是否在外围元素滚动的时候关闭下拉列表
			scrollEleHide: {
				type: Boolean,
				defalult: false
			},
			// 下拉列表的样式
			itemListCls: {
				type: [Object, Array]
			},
			isComputedPos: {
				type: Boolean,
				'default': true
			}
		},
		watch: {
			itemListCls (val) {
				this.__itemList.cls = val;
			},
			ListWidth (w) {
				this.__itemList.width = w;
			},
			isShowList (show) {
				this.__itemList.show = show;
				if (show) {
					if (this.isComputedPos) {
						this.position();
					}
					if (this.scrollEleHide) {
						this.scrollEvt(true);
					}
					this.$emit('show');
					currentOpen = this;
				} else {
					if (this.scrollEleHide) {
						this.scrollEvt(false);
					}
					this.$emit('hide');
				}
			},
			closeOnSelect (val) {
				this.__itemList.closeOnSelect = val;
			},
			value (val) {
				this.__itemList.value = val;
			},
			isGroup (val) {
				this.__itemList.isGroup = val;
			},
			// 渲染每个item的模版
			itemTemplate (res) {
				this.__itemList.itemTemplate = res;
			},
			// 分组title的模版
			itemGroupTitle (res) {
				this.__itemList.itemGroupTitle = res;
			},
			// 无结果的模版
			noResultTemplate (res) {
				this.__itemList.noResultTemplate = res;
			},
			data (res) {
				this.__itemList.data = res;
			}
		},
		computed: {
		},
		data () {
			return {
				isShowList: false,
				width: 0
			};
		},
		methods: {
			inputChange (e) {
				const { input } = this.$refs;
				if (input) {
					input.value = e.target.value;
					// 向上触发 input 事件，并传递数字值
					this.$emit('input', e.target.value);
				}
			},
			// 设置 list的位置
			position () {
				const ele = this.$el;
				const react = ele.getBoundingClientRect();
				if (this.isInsertScrollEle) {
					let scrollTop = 0;
					if (this.insertEl === document.documentElement || this.insertEl === document.body) {
						scrollTop = window.pageYOffset;
					} else {
						scrollTop = this.insertEl.scrollTop;
					}
					Object.assign(this.__itemList.$el.style, {
						top: (react.height + react.top + scrollTop) + 'px',
						left: (pageXOffset + react.left) + 'px'
					});
				} else {
					Object.assign(this.__itemList.$el.style, {
						top: react.height + 'px',
						left: '0px'
					});
				}
			},
			toggle (e) {
				return this.isShowList ? this.close() : this.show();
			},
			show () {
				if (this.isShowList || this.disable) {
					return;
				}
				this.isShowList = true;
				window.setTimeout(() => {
					this.__itemList.css['animate-bounce-down'] = true;
					this.__itemList.css['af-select-list-open'] = true;
				});
				// 每次显示都从新计算宽度
				if (this.ListWidth === 0) {
					this.__itemList.width = this.$el.getBoundingClientRect().width;
				} else {
					this.__itemList.width = this.ListWidth;
				}
				this.$emit('display', this.isShowList);
			},
			blur () {
				console.log('in blur');
				console.log(this.isShowList, this.closeOnSelect);
				this.close();
			},
			close () {
				if (!this.isShowList || !this.closeOnSelect) {
					return;
				}
				this.__itemList.css['animate-bounce-down'] = false;
				this.__itemList.css['af-select-list-open'] = false;
				window.setTimeout(() => {
					this.isShowList = false;
					this.$emit('display', this.isShowList);
				}, 300);
			},
			scrollEvt (isBind) {
				let ele = this.insertEl;
				if (this.insertEl === document.documentElement || this.insertEl === document.body) {
					ele = window;
				}
				if (isBind) {
					ele.addEventListener('scroll', this.__scroll);
				} else {
					ele.removeEventListener('scroll', this.__scroll);
				}
			},
		},
		created () {
			const el = this.$el;
			const self = this;
			// 动态创建list并放入一个div中
			this.__ListDiv = document.createElement('div');
			const List = Vue.extend(ItemList);
			this.__itemList = new List({
				propsData: {
					refEle: el,
					width: null,
					value: this.value,
					data: this.data,
					isGroup: this.isGroup,
					css: {},
					closeOnSelect: this.closeOnSelect,
					itemTemplate: this.itemTemplate,
					itemGroupTitle: this.itemGroupTitle,
					noResultTemplate: this.noResultTemplate
				}
			});
			this.__itemList.$select = this;
			this.__itemList.$on('change', val => {
				self.$emit('input', val);
				self.$emit('change', val);
				if (this.closeOnSelect) {
					this.close();
				}
			});
		},
		mounted () {
			const el = this.$el;
			let width;
			if (this.ListWidth === 0 && this.$el) {
				width = el.getBoundingClientRect().width;
			} else {
				width = this.ListWidth;
			}
			let insertEl = el;
			// 如果是要插入到滚动元素，则查找当前滚动元素并且插入
			if (this.isInsertScrollEle) {
				let e = document.querySelector(this.scrollEleSelector);
				if (!e) {
					e = document.body;
				}
				insertEl = e;
				this.insertEl = insertEl;
			}
			this.__itemList.width = width;
			if (this.itemListCls) {
				this.__itemList.cls = this.itemListCls;
			}
			insertEl.appendChild(this.__ListDiv);
			this.insertEl = insertEl;
			this.__itemList.$mount(this.__ListDiv);
			this.__scroll = () => {
				this.close();
				this.scrollEvt(false);
			};
		},
		beforeDestroy () {
			if (this.__itemList) {
				const ele = this.__itemList.$el;
				this.__itemList.$destroy();
				if (ele && ele.parentNode) {
					ele.parentNode.removeChild(ele);
				}
				this.__ListDiv = null;
			}
		}
	};

	document.documentElement.addEventListener('keydown', e => {
		if (e.keyCode === 27 && currentOpen) {
			currentOpen.close();
		}
	});
</script>

<style lang="less">
.af-select {
	position: relative;
	outline: none;
	-webkit-tap-highlight-color: rgba(0,0,0,0);
	&.disable {
		color: #cccccc;
		background: gray;
	}
	.af-select-title {
		height: 24px;
		line-height: 24px;
		display: inline-table;
		border: 1px solid gray;
		width: 100%;
		.af-select-input {
			height: 100%;
			width: 100%;
			display: table-cell;
			outline: none;
			vertical-align: top;
			&.input {
				border: 0px;
				-webkit-tap-highlight-color: rgba(0,0,0,0);
			}
			.placeholder {
				color: #ccc;
			}
		}
		.af-select-icon-item {
			display: table-cell;
			.icon {
				text-align: center;
				width: 24px;
				height: 100%;
				display: block;
			}
		}
	}
}
</style>
