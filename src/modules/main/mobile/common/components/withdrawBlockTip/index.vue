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
		...mapState('assetsInfo', ['auditStatus']),
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
	padding: 12/@rem;
	display: flex;
	align-items: center;
	justify-content: center;
	background: @darkerRed;
	.left {
		flex: 1 1 auto;
		.m-title-wrap {
			position: relative;
			padding-left: 28/@rem;
			line-height: 20/@rem;
			font-size: 12/@rem;
			font-weight: 500;
			color: @white;
			.m-icon-tip {
				position: absolute;
				top: -3/@rem;
				left: 0;
				transform: rotate(180deg);
				.m-icon-tips();
				&::before {
					font-size: 20/@rem;
					color: @white;
				}
			}
		}
		.m-text {
			padding-left: 28/@rem;
			color: @white;
			font-size: 12/@rem;
			line-height: 14/@rem;
		}
	}
	.right {
		padding: 0 8/@rem;
		flex: 0 0 auto;
		margin-left: 6/@rem;
		line-height: 20/@rem;
		border: 1px solid @white;
		border-radius: 2/@rem;
		font-size: 12/@rem;
		font-weight: 500;
		color: @white;
		&:active {
			color: @darkerRed;
			background: @white;
		}
	}
}
</style>
