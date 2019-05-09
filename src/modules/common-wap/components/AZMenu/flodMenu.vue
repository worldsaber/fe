<template>
	<div class="m-menu">
		<div :class="[
			'm-menu-title',
			{
				hide: !isShow
			}
		]" @click="changeDisplay">
			<span class="text">{{name}}</span>
			<span class="icon-triangle"></span>
		</div>

		<div class="m-menu-conent" v-show="isShow">
			<slot></slot>
		</div>
	</div>
</template>

<script>
	export default {
		props: {
			isShowContent: {
				'default': true,
				type: Boolean
			},
			name: {
				type: String,
				required: true
			}
		},
		data () {
			return {
				isShow: true,
			};
		},
		watch: {
			isShowContent (val) {
				this.isShow = val;
			}
		},
		created () {
			this.isShow = this.isShowContent;
		},
		methods: {
			changeDisplay () {
				this.isShow = !this.isShow;
				this.$emit('change', this.isShow);
			}
		}
	};
</script>

<style lang="less">
	@import 'base/styles/variable.less';
	@import 'base/styles/icon.less';
	.m-menu {
		.m-menu-title{
			color: @dark;
			font-size: 16/@rem;
			height: 48/@rem;
			line-height: 48/@rem;
			padding: 0 16/@rem;
			display: flex;

			&:before {
				font-size: 18/@rem!important;
				margin-right: 11/@rem;
				color: @darker;
			}

			&>span{
				flex: 1;
				display: block;
				justify-content: space-between;
			}
			.icon-triangle{
				.m-icon-arrow--up();
				text-align: right;

				&:before{
					font-size: 12/@rem;
				}
			}
			&.hide{
				.icon-triangle{
					transform: rotateX(180deg);
				}
			}
		}
	}
</style>
