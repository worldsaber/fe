<template>
		<ul class="m-uc-nav">
			<li @click="clickHandler(index)" class="m-nav-item" v-for="(item,index) in tabList" :class="{'m-nav-item--active':active == index}" :key="index">{{item}}</li>
			<slot name="sub"></slot>
		</ul>
</template>

<script>
export default {
	props: {
		tabList: {
			type: Array,
			default () {
				return [];
			}
		},
		active: [String, Number]
	},
	methods: {
		clickHandler (index) {
			if (this.active !== index) {
				this.$emit('click', index);
			}
		}
	}
};
</script>

<style lang="less">
@import 'base/styles/variable.less';
.m-uc-nav{
	box-shadow: 0 2px 4px rgba(0, 0, 0, 5%);
	height: 48/@rem;
	background: @white;
	display: flex;
	justify-content: center;
	position: relative;
	z-index: 1;
	.m-nav-item{
		font-size: 14/@rem;
		line-height: 48/@rem;
		width: 33.4%;
		text-align: center;
		text-transform: capitalize;
		&--active{
			font-weight: bold;
			border-bottom: 3/@rem solid @green;
		}
		box-sizing:border-box;
	}
}
</style>
