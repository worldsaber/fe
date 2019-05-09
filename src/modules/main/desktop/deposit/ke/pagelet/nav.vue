<!-- 此nav交易记录也引用到了 -->
<template>
	<ul class="m-nav">
		<li @click="clickHandler(index)" class="m-nav-item" v-for="(item,index) in tabList" :class="{'m-nav-item--active':currentTab == index}" :key="index">{{item}}</li>
	</ul>
</template>

<script>
export default {
	props: {
		tabList: {
			type: Array,
			'default': []
		},
		// 当前选中的tab
		active: {
			type: Number,
			'default': 0
		}
	},
	data () {
		return {
			currentTab: this.active || 0
		};
	},
	methods: {
		clickHandler (index) {
			if (this.currentTab !== index) {
				this.currentTab = index;
				this.$emit('click', index);
			}
		}
	}
};
</script>

<style lang="less">
@import 'base/style/variable.less';

.m-nav {
	border-bottom: 1px solid @fogGrayBorder;
	margin-bottom: -3px;
}
.m-nav-item {
	display: inline-block;
	padding: 10px;
	min-width: 100px;
	text-align: center;
	box-sizing: border-box;
	text-transform: capitalize;
	font-size: 20px;
	margin-right: 30px;
	cursor: pointer;
}
.m-nav-item--active {
	font-weight: bold;
	border-bottom: 3px solid @green;
	cursor: default;
	color: #353a45
}
</style>

