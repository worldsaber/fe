<template>
	<div class="pagination">
		<span class="pageNum icon-prev" :class="{'icon-disabled':this.selected<=0}" @click="prevPage()" @keyup.enter="prevPage()"></span>
		<template v-for="page in pages" >
			<span class="pageNum" :key="page.content" :class="{selected:page.selected}" @click="handlePageSelected(page.index)" @keyup.enter="handlePageSelected(page.index)">{{page.content}}</span>
		</template>
		<span class="pageNum icon-next" :class="{'icon-disabled':this.selected>=this.pageCount-1}"  @click="nextPage()" @keyup.enter="nextPage()"></span>
	</div>
</template>

<script>
export default {
	name: 'pagination',

	data() {
		return {
			// 选中的页面的index，比页码小1
			selected: this.initialPage - 1
		};
	},

	props: {
		// Total count of pages. required
		pageCount: {
			type: Number,
			required: true
		},
		// The index of overridden selected page. page start from 1.
		forcePage: {
			type: Number
		},
		// The index of initial page which selected. default: 1
		initialPage: {
			type: Number,
			'default': 1
		},
		clickHandler: {
			type: Function,
			'default': () => { }
		},
		// Range of pages which displayed. default: 10
		pageRange: {
			type: Number,
			'default': 10
		}
	},
	// 页面内tab切换的时候选中页面的值需要重置为第一页（也就是selected=0）， 故而增加此watch，这样initialPage有点类似当前选中的页面了
	// 如果initialPge不，如果需要修改当前选中页面可以给组件定义一个ref，通过this.$refs.paginate._data.selected = pagenum;来修改
	watch: {
		initialPage (val) {
			this.selected = val - 1;
		}
	},
	computed: {
		pages () {
			const items = {};
			if (this.pageCount <= this.pageRange) {
				for (let index = 0; index < this.pageCount; index++) {
					const page = {
						index,
						content: index + 1,
						selected: index === this.selected
					};
					items[index] = page;
				}
			} else {
				const leftPart = Math.floor(this.pageRange / 2);
				const rightPart = this.pageRange - leftPart;
				let start;
				let end;
				if (this.selected - leftPart < 0) {
					start = 0;
					end = this.pageRange;
				} else if (this.selected + rightPart > this.pageCount) {
					end = this.pageCount;
					start = end - this.pageRange;
				} else {
					start = this.selected - leftPart;
					end = this.selected + rightPart;
				}
				for (let index = start; index < end; index++) {
					const page = {
						index,
						content: index + 1,
						selected: index === this.selected
					};
					items[index] = page;
				}
			}
			return items;
		}
	},
	beforeUpdate() {
		if (this.forcePage === undefined) return;
		if (this.forcePage !== this.selected) {
			this.selected = this.forcePage - 1;
		}
	},
	methods: {
		handlePageSelected(selected) {
			if (this.selected === selected) return;
			this.selected = selected;
			this.clickHandler(this.selected + 1);
		},
		prevPage() {
			if (this.selected <= 0) return;
			this.selected--;
			this.clickHandler(this.selected + 1);
		},
		nextPage() {
			if (this.selected >= this.pageCount - 1) return;
			this.selected++;
			this.clickHandler(this.selected + 1);
		},
		// firstPageSelected() {
		// 	return this.selected === 0;
		// },
		// lastPageSelected() {
		// 	return (this.selected === this.pageCount - 1) || (this.pageCount === 0);
		// }
	}
};
</script>

<style lang="less">
@import './pagination.less';
</style>
