<template>
<div class="m-loading-wrap" v-if="isLoading !== 0 && isLoading !== false">
	<div :class="['m-loading', theme === 'light' ? 'light' : 'dark']">
		<div class="loading" v-if="isLoading !== -1"></div>
		<div class="loading-fail" v-if="isLoading === -1">
			<p class="fail-text">Data failed loading. Please reload.</p>
			<div class="fail-btn" @click="fail">Reload</div>
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
@import '~base/styles/variable.less';
@import 'base/styles/icon.less';
@keyframes circles
{
	to {
		transform: rotate(360deg);
	}
	from {
		transform: rotate(0deg);
	}
}

.m-loading-wrap{
	min-height: 180/@rem;
}
.m-loading {
	text-align: center;
	font-size: 12/@rem;
	.loading{
		top: 50%;
		left: 50%;
		position: absolute;
		margin-left: -15/@rem;
		margin-top: -15/@rem;
		.m-icon-loading-circle();
		animation: circles 1s infinite;
		animation-timing-function: linear;
		&:before{
			height: 30/@rem;
			width: 30/@rem;
			line-height: 1;
			font-size: 30/@rem;
		}
	}
	.loading-fail{
		text-align: center;
		margin: 10/@rem 0;
		.m-icon-exclamation();
		&:before{
			display: block;
			font-size: 36/@rem;
		}
		.fail-text{
			margin-top: 10/@rem;
			white-space: nowrap;
			word-break: keep-all;
			margin-bottom: 24/@rem;
		}
		.fail-btn{
			color: @green;
			height: 36/@rem;
			line-height: 36/@rem;
			padding: 0 28/@rem;
			display: inline-block;
			border: 1px solid @green;
			border-radius: 3/@rem;
		}
	}
	&.light {
		background: @white;
		.loading {
			&::before{
				color: @midGray;
			}
		}
		.loading-fail{
			&::before{
				color: @midGray;
			}
			.fail-text{
				color: @darkGray;
			}
		}
	}
	&.dark {
		background: @dark;
		.loading {
			&::before{
				color: @midGray
			}
		}
		.loading-fail{
			&::before{
				color: fade(@lightGray, 15%);
			}
			.fail-text{
				color: @darkGray;
			}
		}
	}
}
</style>
