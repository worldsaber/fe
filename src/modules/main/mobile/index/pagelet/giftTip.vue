<template>
  	<div :class="['m-gift-bubble']" @click="goUrl" v-if="data">
		<img class="m-gift-icon-image" :src="imgUrl" v-if="imgUrl" @load="onLoad" :style="imgStyle"/>
		<div v-else class="m-gift-icon-default">
			<i class="m-icon--gift"></i>
		</div>
	</div>
</template>
<script>
export default {
	props: {
		data: {
			type: Object
		}
	},
	data() {
		return {
			width: 0,
		};
	},
	computed: {
		imgUrl() {
			return this.data && this.data.imgUrl;
		},
		imgStyle() {
			if (this.width) {
				return {
					width: `${this.width / 24}rem`  // 2x 图显示 1x 大小
				};
			}
			return {};
		}
	},
	methods: {
		goUrl () {
			window.location.href = this.data.linkUrl;
		},
		onLoad(evt) {
			const target = evt.currentTarget;
			const width = target.width;
			this.width = width;
		}
	}
};
</script>
<style lang="less">
@import 'base/styles/variable.less';
@import 'base/styles/icon.less';
.m-gift-bubble{
	position: fixed;
	display: flex;
	justify-content: center;
	align-items: center;
	bottom: 60/@rem;
	right: 7/@rem;
	z-index: 222;
	.m-gift-icon-default{
		display: flex;
		justify-content: center;
		align-items: center;
		width: 48/@rem;
		height: 48/@rem;
		border-radius: 48/@rem;
		background: @red;
	}
	.m-icon--gift{
		.m-icon-gift();
		&:before{
			color: @white;
			font-size: 20/@rem;
		}
	}
}
</style>


