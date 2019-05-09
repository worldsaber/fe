<template lang="html">
  <div class="m-error-wrap" :class="cssList" v-show="showError">
	  <div class="m-error">
		  <i v-if="showIcon" :class="['m-icon--'+type]"></i>
  		  <p v-if="msg" class="m-text-info" v-html="msg"></p>
  		  <p v-else class="m-text-info">
  			  <slot></slot>
  		  </p>
	  </div>
  </div>
</template>

<script>
export default {
	name: 'Tips',
	props: {
		type: {
			type: String,
			'default': ''
		},
		msg: {
			type: String,
			'default': ''
		},
		cssList: {
			type: [String, Array]
		}
	},
	data() {
		return {
			showIcon: !!this.type
		};
	},
	computed: {
		showError() {
			return this.msg || Object.keys(this.$slots).length;
		}
	}
};
</script>

<style lang="less">
@import 'base/style/variable.less';
@import 'base/style/icon.less';

.m-error-wrap {
	width: 100%;

	.m-error {
		margin: 0 auto;
		background:	@ligterRed;
		padding: 7px 12px;
		box-sizing: border-box;
		text-align: left;
	}

	@supports(display: flex) {
		display: flex;
	}

	.m-icon--error {
		.m-icon-delete2();
		color: @red;
		&:before {
			font-size: 13px;
		}
	}

	.m-icon--info {
		.m-icon--error();
		color: @yellow;
		&:before {
			font-size: 13px;
		}
	}

	.m-icon--error,
	.m-icon--info {
		margin-right: 5px;
		display: inline-block;
	}
	.m-text-info {
		font-size: 10px;
		line-height: 1;
		color: @red;
		display: inline-block;
	}
}
</style>
