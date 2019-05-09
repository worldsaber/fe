<template>
	<div class="m-issue-auth-dialog">
		<p class="m-auth-desc">Sign up at SportyBet to get an Extra Life when you get a wrong answer in Football Quiz.</p>
		<p class="m-auth-desc">Win {{country === 'ke' ? '1,000,000' : '3,000,000'}} Together!</p>
		<div class="m-auth-footer">
			<span v-if="contentData.type === 'late'" class="m-auth-exit" @click="exit">Exit</span>
			<span v-else class="m-auth-leave" @click="cancel">Not Now</span>
			<div class="m-auth-spectator" @click="signup">Sign Up</div>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			country: window.country
		};
	},
	methods: {
		cancel() {
			this.$dialog();
		},
		signup() {
			this.$popupLogin && this.$popupLogin.show();
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
