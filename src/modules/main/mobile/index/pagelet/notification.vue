<template lang="html">
  <div class="m-notification" v-if="showInfos">
	  <p>
		  <i class="m-icon-tips"></i>
		  <span class="t-main">{{infos.text}}<a :href="infos.url" v-if="infos.url && infos.url.length" class="m-more">{{infos.desc || "View more>"}}</a></span>
	  </p>
  </div>
</template>

<script>
export default {
	props: {
		infos: {
			type: Object,
			required: true
		}
	},
	computed: {
		showInfos() {
			const infos = this.infos || {};

			return infos.text && !!infos.text.length;
		}
	}
};
</script>

<style lang="less">
@import 'base/styles/variable.less';
@import 'base/styles/icon.less';

.m-notification {
	background: @grayRed;
	position: relative;

	> p {
		position: relative;
		max-width: 100%;
		margin: 0 auto;

		font-size: 0;
		padding: 10/@rem 10/@rem 10/@rem 50/@rem;
		box-sizing: border-box;
	}

	.m-icon-tips {
		.m-icon--error();
		display: inline-block;
		position: absolute;
		top: 50%;
		left: 14/@rem;
		transform: translate3d(0, -50%, 0);

		&:before {
			color: @midYellow;
			font-size: 22/@rem;
		}
	}

	.t-main {
		display: inline-block;
		vertical-align: middle;
		line-height: 15/@rem;
		font-size: 13/@rem;
		font-weight: 500;
		color: @white;
	}

	.m-more {
		margin-left: 6/@rem;
		color: @midYellow;
		font-size: 12/@rem;
		line-height: 14/@rem;
		vertical-align: middle;
	}
}
</style>
