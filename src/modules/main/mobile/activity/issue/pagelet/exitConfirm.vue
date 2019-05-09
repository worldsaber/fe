<template>
	<div class="m-issue-auth-dialog">
		<p class="m-auth-desc">If you tap to return, we will consider this as exiting the activity. Do you really wish to exit?</p>
		<div class="m-auth-footer">
			<span class="m-auth-exit" @click="exit">Exit</span>
			<div class="m-auth-spectator" @click="continuePlay">Continue Answering</div>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {

		};
	},
	methods: {
		exit() {
			this.$emit('exit');
		},
		continuePlay() {
			this.$dialog();
		}
	},
	created() {
		console.log(this);
		console.log(this.contentData);
	}
};
</script>

<style lang="less">
@import '~base/styles/variable.less';

.m-issue-auth-dialog {
	padding-bottom: 20/@rem;
	
	.m-auth-title {
		margin-bottom: 16/@rem;
		font-size: 24/@rem;
		line-height: 28/@rem;
		font-weight: bold;
	}
	.m-auth-desc {
		margin-bottom: 20/@rem;
		font-size: 16/@rem;
		font-weight: 500;
		color: @dark;
	}
	
	.m-auth-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 14/@rem;
		line-height: 40/@rem;
		
		.m-auth-exit, .m-auth-leave {
			flex: 0 0 auto;
			margin-left: 5/@rem;
			color: #692bff;
		}
		.m-auth-spectator {
			flex: 0 0 auto;
			padding: 0 10/@rem;
			border-radius: 25/@rem;
			color: @white;
			background-color: #692bff;
		}
	}
}
</style>
