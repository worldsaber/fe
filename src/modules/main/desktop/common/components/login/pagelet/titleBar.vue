<template lang="html">
	<header :class="cssList" class="m-header-bar">
		<a v-if="backIcon" href="javascript:;" class="m-icon m-icon-back" @click="handleBack" data-action="btn" data-ret="back"></a>
		<span :class="getTitleStyle">{{title}}</span>
		<span v-if="closeIcon" class="m-icon m-icon-close" @click="handleClose" data-action="close" data-ret="close"></span>
	</header>
</template>

<script>
export default {
	name: 'AfHeader',
	props: {
		cssList: {
			type: [String, Array]
		},
		backIcon: {
			type: Boolean,
			'default': true
		},
		closeIcon: {
			type: Boolean,
			'default': true
		},
		title: {
			type: String,
			'default': ''
		},
		backUrl: {
			type: String,
			'default': ''
		},
		icon: {
			type: String,
			'default': ''
		}
	},
	computed: {
		getTitleStyle() {
			return [
				'm-header-bar-title',
				`${this.icon ? 'm-icon-' + this.icon : ''}`
			];
		}
	},
	methods: {
		handleBack(event) {
			event.preventDefault();

			if (this.backUrl) {
				location.href = this.backUrl;
			} else {
				this.$emit('back', this);
			}
		},
		handleClose() {
			this.$emit('close', this);
		}
	}
};
</script>

<style lang="less">
@import 'base/style/icon.less';
@import 'base/style/variable.less';

.m-header-bar{
	height: 110px;
	position: relative;

	.m-icon{
		position: absolute;
		top: 16px;
		padding: 0 15px;
		box-sizing: border-box;
		z-index: 999;
	}

	.m-icon-back{
		text-decoration: none;
		.m-icon-back();
		color: @darkGray;
		left: 0;
	}

	.m-icon-close{
		right: 0;
		.m-icon-close();
		color: @darkGray;
		cursor: pointer;
	}

	.m-header-bar-title{
		position: absolute;
		top: 50%;
		width: 100%;
		font-size: 24px;
		line-height: 33px;
		transform: translate3d(0,-50%,0);
		text-align: center;
		color: @black;
	}

	.m-icon-success{
		.m-icon-success-bg();

		&:before {
			display: inline-block;
			color: @green;
			width: 34px;
			height: 34px;
			font-size: 32px;
			line-height: 34px;
			font-weight: bold;
			border-radius: 50%;
			margin-right: 10px;
			vertical-align: top;
		}
	}
}
</style>
