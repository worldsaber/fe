import item from './item.vue';
import itemTitle from './itemTitle';
import './itemList.less';

const isSupportMouseEnter = 'onmouseenter' in document.documentElement;
const isSupportMouseOver = 'onmouseover' in document.documentElement;
export default {
	functional: true,
	name: 'ListItem',
	props: {
		// 渲染每个item的模版
		itemTemplate: {
			type: Object,
			default () {
				return item;
			}
		},
		// 分组title的模版
		itemGroupTitle: {
			type: Object,
			default () {
				return itemTitle;
			}
		},
		// 无结果的模版
		noResultTemplate: {
			type: Object,
			default () {
				return null;
			}
		},
		data: {
			type: Array,
			default () {
				return [];
			}
		},
		width: {
			type: [Number, String],
			'default': null
		},
		value: {
			'default': ''
		},
		isGroup: {
			type: Boolean,
			'default': false
		},
		closeOnSelect: {
			type: Boolean,
			'default': true
		},
		cls: {
			type: [Object, Array],
		}
	},
	data () {
		return {
			show: false,
			css: {
				'af-select-list': true,
				'animate-core': true,
				'animate-bounce-down': false,
				'af-select-list-open': false
			}
		};
	},
	render (h) {
		let c = [this.css];
		if (this.cls) {
			if (this.cls.length) {
				c = c.concat(this.cls);
			} else {
				c.push(this.cls);
			}
		}
		return h('div', {
			style: {
				display: this.show ? '' : 'none'
			},
			on: {
				click (e) { e.stopPropagation(); }
			},
			'class': c
		}, this.renderList(h));
	},
	watch: {
		width: {
			handler (w) {
				if (w !== null) {
					if (typeof w === 'number') {
						this.$el.style.width = w + 'px';
					} else if (typeof w === 'string') {
						this.$el.style.width = w;
					}
				}
			},
			immediate: true
		}
	},
	computed: {
		mapData () {
			return this.data.reduce((map, current, index) => {
				const id = current.group || 'other';
				map[id] = map[id] || [];
				// 复制一遍数据保证唯一性
				if (typeof current === 'string') {
					map[id].push({ name: current, id: index });
				} else {
					map[id].push({ ...current, id: index });
				}
				return map;
			}, {});
		}
	},
	methods: {
		// 鼠标悬浮
		mouseover (e) {
			e.target.addClass('hover');
		},
		// 鼠标移除
		mouseout (e) {
			e.target.removeClass('hover');
		},
		// 选择一项
		select (e) {
			e.preventDefault();
			const id = e.currentTarget.getAttribute('data-id');
			const val = this.data[+id];
			if (val !== undefined) {
				this.$emit('change', val);
			}
		},
		// 下拉列表
		renderItem (currentData, h, id) {
			const cls = {
				active: (this.value.name || this.value) === (currentData.name || currentData),
				'af-select-item': true
			};
			const nativeOn = {
				click: this.select
			};
			if (isSupportMouseEnter) {
				nativeOn.mouseenter = this.mouseover;
				nativeOn.mouseleave = this.mouseout;
			} else if (isSupportMouseOver) {
				nativeOn.mouseover = this.mouseover;
				nativeOn.mouseout = this.mouseout;
			}
			return h(this.itemTemplate, {
				'class': cls,
				props: {
					data: currentData,
					key: currentData.name || currentData
				},
				attrs: {
					'data-id': id
				},
				key: id,
				nativeOn
			});
		},
		renderList (h) {
			const res = [];
			if (!this.data.length) {
				if (this.noResultTemplate) {
					res.push(h(this.noResultTemplate));
				} else {
					res.push(h('div', {
						name: 'itemGroup',
						'class': 'af-select-list-no-result'
					}, ['noResult']));
				}
			} else if (this.isGroup) {
				for (const key in this.mapData) {
					if (Object.prototype.hasOwnProperty.call(this.mapData, key)) {
						const items = [];
						items.push(h(this.itemGroupTitle, {
							props: {
								data: key
							}
						}));
						for (const item of this.mapData[key]) {
							items.push(this.renderItem(item, h, item.id));
						}
						res.push(h('div', {
							'class': 'af-select-group'
						}, items));
					}
				}
			} else {
				for (let i = 0, l = this.data.length; i < l; i++) {
					res.push(this.renderItem(this.data[i], h, i));
				}
			}
			return res;
		}
	}
};
