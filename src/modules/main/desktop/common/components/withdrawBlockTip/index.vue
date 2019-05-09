<template>
	<div class="m-withdraw-tip" v-if="auditStatus && currentTip">
		<div class="left">
			<div class="m-title-wrap"><i class="m-icon-tip"/>{{currentTip.title}}</div>
			<p class="m-text">{{currentTip.text}}</p>
		</div>
		<div class="right" v-if="currentTip.button" @click="jmpTo(`${currentTip.button.href}?from=${from}`)">{{currentTip.button.label}}</div>
	</div>
</template>

<script>
import { mapState } from 'vuex';
import config from './config';

export default {
	props: {
		from: {
			type: String,
			'default': ''
		}
	},
	computed: {
		...mapState('userCenter', ['auditStatus']),
		currentTip() {
			return config[this.auditStatus];
		}
	},
	methods: {
		jmpTo(href) {
			window.location.href = href;
		}
	}
};
</script>

<style lang="less">
@import 'base/styles/variable.less';
@import 'base/styles/icon.less';

.m-withdraw-tip {
	margin-left: 21px;
	margin-bottom: 10px;
	padding: 12px 40px;
	display: flex;
	align-items: center;
	justify-content: center;
	background: @darkerRed;
	.left {
		flex: 1 1 auto;
		.m-title-wrap {
			position: relative;
			padding-left: 28px;
			line-height: 20px;
			font-size: 12px;
			font-weight: 500;
			color: @white;
			.m-icon-tip {
				position: absolute;
				top: -3px;
				left: 0;
				transform: rotate(180deg);
				.m-icon-tips();
				&::before {
					font-size: 20px;
					color: @white;
				}
			}
		}
		.m-text {
			padding-left: 28px;
			color: @white;
			font-size: 12px;
			line-height: 14px;
		}
	}
	.right {
		cursor: pointer;
		padding: 0 8px;
		flex: 0 0 auto;
		margin-left: 6px;
		line-height: 20px;
		border: 1px solid @white;
		border-radius: 2px;
		font-size: 12px;
		font-weight: 500;
		color: @white;
		&:active {
			color: @darkerRed;
			background: @white;
		}
	}
}
</style>
