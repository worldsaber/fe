<template>
	<div :class="['event-sort-wrap', wrapClass]">
		<div class="event-sort-head" @click.stop="toggleList">
			<div :class="['event-sort-icon', iconClass]">
				<span class="event-icon-item event-icon-100"></span>
				<span class="event-icon-item event-icon-70"></span>
				<span class="event-icon-item event-icon-40"></span>
			</div>
			<div class="evet-sort-title">Sort <span class="event-sort-dot" v-show="currentIndex!==0"></span></div>
		</div>
		<ul class="event-sort-list" v-show="isExpand" @click.stop="closeExpand">
			<li :class="[itemClass(index)]" v-for="(item,index) in items" :key="index" :data-index="index" @click="onSelectItem">{{item.label}}</li>
		</ul>
		<div class="event-sort-mask"   @click.stop="closeExpand" v-show="isExpand"></div>
	</div>
</template>
<script>
export default {
	props: {
		items: {
			type: Array,
			'default': () => [{
				label: 'Default',
				value: 0
			}, {
				label: 'Time',
				value: 1
			}, {
				label: 'League',
				value: 2
			}]
		},
		activeIndex: {
			type: Number,
			'default': 0
		},
		expand: {
			type: Boolean,
			'default': false
		}
	},
	data() {
		return {
			currentIndex: this.activeIndex,
			isExpand: this.expand
		};
	},
	computed: {
		iconClass() {
			return {
				'event-icon-item-active': this.currentIndex !== 0
			};
		},
		wrapClass() {
			return {
				'event-sort-wrap-active': this.isExpand
			};
		}
	},
	methods: {
		onSelectItem(event) {
			const currentTarget = event.currentTarget;
			let index = currentTarget.dataset.index;
			index = parseInt(index, 10);
			this.currentIndex = index;
		},
		itemClass(index) {
			return {
				'event-sort-item': true,
				'event-sort-item-active': index === this.currentIndex
			};
		},
		toggleExpand(expand) {
			this.isExpand = expand;
		},
		closeExpand() {
			this.toggleExpand(false);
		},
		toggleList(event) {
			this.toggleExpand(!this.isExpand);
		},
		setActiveIndex(index) {
			this.currentIndex = index;
		}
	},
	watch: {
		currentIndex(index) {
			const item = this.items[index];
			this.$emit('selected', item);
		}
	}
};

</script>
<style lang="less">
@import '~base/styles/variable.less';

.event-sort-wrap{
	position: relative;
	height: 65%;
	padding: 0 10/@rem;
	margin-right: -10/@rem;
	background: @green;
	&:active{
		background-color: @darkGreen;
	}
}

.event-sort-head{
	display: flex;
	align-items: center;
	height: 100%;
	line-height: 40/@rem;
	font-size: 14/@rem;
	color: @white;
}
.event-sort-icon{
	display: flex;
	width: 18/@rem;
	height: 12/@rem;
	margin: 6/@rem 3/@rem;
	flex-direction: column;
	justify-content: space-between;
	box-sizing: border-box;
	margin-right: 8/@rem;
	color: @white;
	.event-icon-item{
		height: 2/@rem;
		background-color: @white;
	}
	.event-icon-100{
		width: 100%;
	}
	.event-icon-70{
		width: 70%;
	}
	.event-icon-40{
		width: 40%;
	}
}
// .event-icon-item-active .event-icon-item{
// 	background-color: #0d9737;
// }
.event-sort-dot {
	display: inline-block;
	position: relative;
	left: 3/@rem;
	width: 5/@rem;
	height: 5/@rem;
	background: @red;
	border: 1/@rem solid @white;
	border-radius: 50%;
	vertical-align: text-top;
}
.event-sort-list{
	position: absolute;
	width: 110/@rem;

	top: 5/@rem;
	right: 7/@rem;
	padding: 8/@rem 0;

	background: #FFF;
	box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
	z-index: 100;
	font-size: 14/@rem;
}
.event-sort-item{
	display: block;
	height: 44/@rem;
	padding: 0 16/@rem;
	line-height: 44/@rem;
	&:active{
		background-color: #f2f3f5;
	}
}
.event-sort-item-active{
	color: #0d9737;
	font-weight: bold;
}
.event-sort-mask{
	position: fixed;
	top: 0;
	bottom: 0;
	right: 0;
	left: 0;
	z-index: 90;
	background-color: transparent;
}
</style>
