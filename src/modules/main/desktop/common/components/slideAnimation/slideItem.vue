<template lang="html">
	<li class="m-list__item" :style="getStyle">
		<slot></slot>
	</li>
</template>

<script>
export default {
	name: 'PageItem',

	componentName: 'PageItem',

	props: {
		pageIndex: {
			type: Number,
			required: true
		}
	},
	computed: {
		getStyle() {
			return {
				transform: `translate3d(${this.pageIndex * 100}%,0,0)`
			};
		}
	}
};
</script>

<style lang="less">
.m-list__item{
	height: 100%;
	width: 100%;
	position: absolute;
	top:0;
	left:0;
	display: inline-block;
	display:flex;
	flex-direction: column;
}
</style>
