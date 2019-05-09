<template>
<div class="m-loading-wrap" v-if="isLoading !== 0 && isLoading !== false">
	<div :class="['m-loading', theme === 'light' ? 'light' : 'dark']">
		<div class="loading" v-if="isLoading !== -1">Loading...</div>
		<div class="loading-fail" v-if="isLoading === -1">
			<p class="fail-text">Failed to load game data.Please refresh the page.</p>
			<div class="fail-btn" @click="fail">Refresh</div>
		</div>
	</div>
</div>
</template>

<script>
	export default {
		props: {
			theme: {
				type: String,
				// light 和 dark
				'default': 'light',
			},
			isLoading: {
				type: [Boolean, Number],
				'default': true
			}
		},
		methods: {
			fail () {
				this.$emit('fail');
			}
		}
	};
</script>

<style lang="less">
@import '~base/style/variable.less';
@import 'base/style/icon.less';
@import 'base/style/logoLoading.less';

.m-loading-wrap{
	min-height: 300px;
}
.m-loading {
	position: absolute;
	top: 0px;
	left: 0px;
	height: 100%;
	width: 100%;
	text-align: center;
	.loading{
		.m-icon-logo();
		top: 50%;
		left: 50%;
		position: absolute;
		transform: translate(-50%, -50%);
		&:before{
			height: 60px;
			width: 60px;
			line-height: 60px;
			font-size: 33px;
			display: block;
			border-radius: 60px;
			color: @white;
			margin-bottom: 10px;
			animation: logoLoading 1s infinite cubic-bezier(0.4, 0, 1, 1) alternate;
		}
	}
	.loading-fail{
		text-align: left;
		margin: 0 auto;
		display: block;
		position: absolute;
		transform: translate(-50%, -50%);
		left: 50%;
		top: 50%;
		z-index: 111;
		.fail-text{
			font-size: 14px;
			display: inline-block;
		}
		.fail-btn{
			border-radius: 2px;
			width: 65px;
			height: 32px;
			line-height: 32px;
			text-align: center;
			background-color: @green;
			color:@white;
			cursor: pointer;
			margin-top: 18px;
			font-size: 12px;
			&:active{
				background-color: @lightGreen;
			}
			&:hover{
				background-color: @midGreen;
			}
		}
	}
	&.light {
		background: @white;
		.loading {
			color: @darkGray;
			&:before{
				background-color: @lightGray;
				color: @white;
			}
		}
		.loading-fail{
			.fail-text{
				color: @dark;
			}
		}
	}
	&.dark {
		background: @dark;
		.loading {
			color: @darkGray;
			&:before{
				background-color: fade(@lightGray, 15%);
				color: @dark;
			}
		}
		.loading-fail{
			.fail-text{
				color: @midGray;
			}
		}
	}
}
</style>
