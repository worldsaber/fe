<template>
<div :class="['simple-select-wrap', showList? 'simple-select-wrap-expand' : '']">
	<div class="select-title" @click.stop="onOpenList">{{selectedValue}}
		<span :class="['arrow-icon', showList ? 'arrow-icon-up': 'arrow-icon-down']"></span>
	</div>
	<div class="select-list" v-show="showList">
		<div :class="['select-item', index === selectedIndex ? 'select-item-active': '']" v-for="(item, index) in data" :key="index" :data-index="index" @click="onSelectItem">
			{{item.label}}
		</div>
	</div>
</div>
</template>
<script>
export default {
	props: {
		placeholder: String,
		data: {
			type: Array,
			'default': []
		},
		defaultIndex: {
			type: Number,
			'default': -1
		},
	},
	data() {
		return {
			selectedIndex: -1,
			showList: false,
		};
	},
	watch: {
		defaultIndex(index) {
			if (this.selectedIndex === -1) {
				this.selectedIndex = index;
			}
		}
	},
	created() {
		this.selectedIndex = this.defaultIndex;
		this.onClose = this.close.bind(this);
	},
	computed: {
		selectedItem() {
			return this.data[this.selectedIndex];
		},
		selectedValue() {
			const item = this.selectedItem;
			if (item) {
				return item.label;
			}
			return this.placeholder;
		},
	},
	methods: {
		onSelectItem(evt) {
			const target = evt.target;
			const index = parseInt(target.dataset.index, 10);
			this.selectedIndex = index;

			this.$emit('selected', {
				index,
				item: this.data[index],
			});
		},
		onOpenList() {
			this.showList = !this.showList; // true;
		},
		close() {
			this.showList = false;
		},
		clear() {
			this.selectedIndex = -1;
		},
		setActiveIndex(index) {
			this.selectedIndex = index;
		}
	},
	mounted() {
		document.addEventListener('click', this.onClose);
	},
	beforeDestroy() {
		document.removeEventListener('click', this.onClose);
	}
};
</script>
<style lang="less">

@import 'base/styles/icon.less';

.simple-select-wrap{
	position: relative;
	height: 48px;
	line-height: 48px;
	color: #FFF;
	font-size: 14px;
	background-color: #353a45;
	cursor: pointer;
	.select-title, .select-list{
		border: solid 1px transparent;
		box-sizing: border-box;
		
	}
	&.simple-select-wrap-expand{
		.select-title, .select-list{
			border: solid 1px rgba(234, 236, 239, 0.15);
			border-radius: 2px;
			
			background-color: #353a45;
		}
		.select-title{
			border-bottom-color: transparent;
		}
		.select-list{
			border-top-color: transparent;
		}
		
		box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.12);
	}
	
	.select-title{
		position: relative;
		padding: 0 10px;
		height: 48px;
		line-height: 46px;
		.arrow-icon{
			position: absolute;
			// left: 
			width: 28px;
			height: 46px;
			right: 1px;
			top: 0;
			z-index: 10;
			text-align: center;
			background-color: #353a45;
			color: #9ca0ab;
		}
		.arrow-icon-up{
			.m-icon-arrow--up();
		}
		.arrow-icon-down{
			.m-icon-arrow--down();
		}
	}
	.select-list{
		position: absolute;
		left: 0;
		right: 0;
		top: 47px;
		z-index: 100;
	}
	.select-item{
		line-height: 48px;
		height: 48px;
		padding: 0 10px;
		cursor: pointer;
		&:hover{
			background-color: #096b27;
		}
		&.select-item-active{
			background-color: #096b27;
		}
	}
}
</style>
