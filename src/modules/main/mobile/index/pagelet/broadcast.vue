<template lang="html">
  <div class="m-bscast" v-if="showBdcast">
	  <div>
  		  <i class="m-icon-bd"></i>
  		  <Broadcast :list="bdList" />
  		  <div class="m-bd-mask"></div>
  	  </div>

  </div>
</template>

<script>
import 'components/broadcast';

export default {
	props: {
		bdList: {
			type: Array,
			default() {
				return [];
			}
		}
	},
	computed: {
		showBdcast() {
			const bdList = this.bdList || [];

			return !!bdList.length;
		}
	}
};
</script>

<style lang="less">
@import 'base/styles/variable.less';
@import 'base/styles/icon.less';

.m-bscast {

	width: 100%;
	background: @white;

	>div {
		width: 100%;
		margin: 0 auto;
		padding: 7/@rem 0 9/@rem 50/@rem;
		box-sizing: border-box;
		height: 30/@rem;
		overflow: hidden;
		position: relative;
	}

	.m-icon-bd {
		.m-icon-bdcast();
		position: absolute;
		display: block;
		top: 0;
		bottom: 0;
		left: 0;
		width: 50/@rem;
		height: 30/@rem;
		line-height: 30/@rem;
		background: linear-gradient(to right, @white, @white 62%, fadeout(@white, 99.99%));
		color: @green;
		z-index: 2;
		padding: 2/@rem 0 0 12/@rem;
		box-sizing: border-box;

		&:before {
			font-size: 14/@rem;
		}
	}

	.m-bd-mask {
		position: absolute;
		right: 0;
		top: 0;
		bottom: 0;
		width: 40/@rem;
		background: linear-gradient(to left, @white, @white 52%, fadeout(@white, 99.99%));
	}

	.m-bdcast {
		display: inline-block;
		vertical-align: middle;
		width: ~'calc(100% - 32px)';

		.m-item {
			color: fadeout(@dark, 20%);
			margin-right: 60/@rem;

			> a {
				color: fadeout(@dark, 20%);
			}
		}
	}
}
</style>
