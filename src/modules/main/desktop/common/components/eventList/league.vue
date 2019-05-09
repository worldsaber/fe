<template>
  <div class="m-league">
	  <div class="m-league-title"><span>{{name}}</span> <span @click="changeDisplay">arrow</span></div>
	  <div class="m-league-conent" v-show="isShow">
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
				isShow: true
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
	.m-league {
		.m-league-title {
			display: flex;
			justify-content: space-around;
			align-content: center;
			align-items: center;
			border: 1px solid gray;
			& >span{
				display: block;
				flex: 1;
				&:last-child {
					text-align: right;
				}
			}
		}
	}
</style>
