<template>
	<div class="m-push-loading-wrapper">
		<div v-if="isLoading" class="m-push-loading"></div>
		<div v-else @click="loading" class="m-push-click-loading">loading more data</div>
	</div>
</template>

<script>
	// 使用原始的loading，而不是touch的方法
	export default {
		props: {
			// 是否加载结束
			loadingEnd: {
				type: Boolean
			}
		},
		watch: {
			loadingEnd (val) {
				if (val) {
					this.isLoading = false;
				}
			}
		},
		data () {
			return {
				isLoading: false
			};
		},
		mounted () {
			const wrapper = document.querySelector('.m-main-mid');
			wrapper.addEventListener('scroll', e => {
				this.scrollTop = wrapper.scrollTop;
				const scroll = wrapper.scrollTop + wrapper.clientHeight;
				if (scroll - wrapper.scrollHeight >= 0) {
					this.loading();
				}
			}, false);
		},
		methods: {
			loading () {
				if (!this.isLoading) {
					this.isLoading = true;
					this.$emit('loading');
				}
			}
		}
	};
</script>

<style lang="less">
@import 'base/styles/icon.less';
@import 'base/styles/variable.less';

@keyframes loading {
	100% {
		transform: rotate(360deg);
	}
}

.m-loading(@fontSize: 16/@rem) {
	.m-icon-loading-circle();
	&:before {
		display:inline-block;
		font-size: @fontSize;
		text-align: center;
		color: @darkGray;
		vertical-align: middle;
		animation: loading 1.5s infinite linear;
	}
}
// 注意这里必须是绝对定位，否则会撑大scroll的元素导致死循环
// 注意列表外围需要加postition relative
.m-push-loading{
	.m-loading();
	padding: 10/@rem;
	text-align: center;
	vertical-align: middle;
}
.m-push-click-loading{
	padding: 10/@rem;
	text-align: center;
	vertical-align: middle;
	color: @white;
}
</style>
