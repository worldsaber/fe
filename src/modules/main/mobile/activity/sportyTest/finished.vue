<template>
	<div class="sporty-test-finished">
		<div class="prompt-title">Finished</div>
		<div class="prompt-submit-btn" @click="onClick">Go To Bet</div>
	</div>
</template>
<script>
export default {
	data() {
		return {
			value: ''
		};
	},
	methods: {
		onClick() {
			const data = this.contentData;
			const callback = data.callback;
			if (callback) {
				callback(this.value);
			}
		}
	}
};
</script>
<style lang="less">
@import 'base/styles/variable.less';
.dialog-sporty-test-finished.es-dialog{
	background: #d21011; // rgba(0, 0, 0, 0.5);
	.es-dialog-head{
		// display: none;
		padding: 0;
		h1{
			display: none;
		}
	}
	 .es-dialog-body {
		 background-color: transparent;
		.es-dialog-main{
			background: transparent;
		}
	}
	.es-dialog-close{
		display: none;
		top: 0/@rem;
		right: -3/@rem;
		em{
			color: #FFF;
		}
	}
}
.sporty-test-finished{
	.prompt-title{
		font-size: 24/@rem;
		color: #FFF;
		font-weight: bold;
		text-align: center;
		margin: 12/@rem 0;
		font-family: 'MyriadPro';
	}
	
	.prompt-submit-btn{
		display: block;
		width: 80%;
		border-radius: 4px;
		background-color: #c6ff00;
		box-shadow: 0 6px 0 0 rgba(0, 0, 0, 0.5);
		color: #1b1e25;
		font-size: 22/@rem;
		font-weight: bold;
		text-align: center;
		line-height: 48/@rem;
		height: 48/@rem;
		margin: 36/@rem auto 24/@rem;
		font-family: 'MyriadPro';
	}
}
</style>
