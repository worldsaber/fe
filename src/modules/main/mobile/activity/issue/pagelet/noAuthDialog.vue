<template>
	<div class="m-issue-auth-dialog">
		<h2 class="m-auth-title" v-if="contentData.type==='late'">Sorry , you are late !</h2>
		<p class="m-auth-desc" v-if="contentData.type==='late'">The activity already started, it might be that you were late or did not log in on time. Do you still wish to enter spectator mode?</p>
		<p class="m-auth-desc" v-else-if="contentData.type==='wrong'">We are sorry, you did not answer Question {{contentData.questionNum}} correctly. You can now watch the quiz, or get yourself Extra Lives for future rounds!</p>
		<p class="m-auth-desc" v-else>Unfortunately, you did not answer the question on time...You can now watch the quiz, or get yourself Extra Lives for future rounds!</p>
		<div class="m-auth-footer">
			<template v-if="contentData.type === 'late'">
				<span class="m-auth-exit" @click="exit">Exit</span>
				<div class="m-auth-spectator" @click="goSpectator">Spectator Mode</div>
			</template>
			<template v-else>
				<span class="m-auth-leave" @click="goSpectator">Spectator Mode</span>
				<div class="m-auth-spectator" @click="goExtraLives">Get More Lives</div>
			</template>
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
		goSpectator() {
			this.$emit('goSpectator');
		},
		goExtraLives() {
			this.$emit('goExtraLives');
		}
	},
	created() {

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
