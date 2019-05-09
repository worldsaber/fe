<template lang="html">
  	<div :class="['m-notification', `m-notification--${type}`]" v-if="isShow">
		<template v-if="type">
			<i :class="['m-icon-notification', `m-icon-notification--${type}`]"></i>
			<div class="m-text">{{text}}</div>
		</template>

		<!-- 自定义类型 -->
		<template v-else>
		  	<slot></slot>
		</template>
  </div>
</template>

<script>
export default {
	props: {
		// 通知类型: info, error, success, warning, custom,
		// 目前仅有info类型，其他待实现
		type: {
			type: String,
			'default': ''
		},
		text: {
			type: String,
			'default': ''
		}
	},
	computed: {
		isShow() {
			return this.text || this.$slots.default;
		}
	}
};
</script>

<style lang="less">
@import 'base/styles/variable.less';
@import 'base/styles/icon.less';

.m-notification {
	padding: 10/@rem;
	position: relative;

	&--info {
		background: fade(@yellow, 10%);
		padding-left: 42/@rem;
	}

	&--tip {
		background: @white !important;
		padding-left: 42/@rem;
	}

	.m-text {
		color: @dark;
		font-size: 12/@rem;
		line-height: 1.17;
	}
}

.m-icon-notification {
	position: absolute;
	left: 10/@rem;
	top: 50%;
	transform:  translateY(-50%);

	&--info {
		transform:  translateY(-50%) rotate(180deg);
		.m-icon-tips();

		&:before {
			color: @midYellow;
			font-size: 20/@rem;
		}
	}

	&--tip {
		.m-icon-light2();
		&:before {
			color: @green;
			font-size: 20/@rem;
		}
	}
}
</style>
