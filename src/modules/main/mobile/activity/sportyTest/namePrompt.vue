<template>
	<div class="sporty-name-prompt">
		<div class="prompt-title">Your Name</div>
		<input class="prompt-input" v-model="value" type="text" maxlength="15" />
		<div class="prompt-submit-btn" @click="onClick">DISCOVER NOW</div>
	</div>
</template>
<script>
import dialog from 'components/dialog';

export default {
	data() {
		return {
			value: ''
		};
	},
	methods: {
		onClick() {
			if (!this.value) {
				dialog.toast('Please input your name!');
				return;
			}
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
.dialog-sporty-test.es-dialog{
	background: #d21011;
	.es-dialog-head{
		display: none;
	}
	 .es-dialog-body .es-dialog-main{
		background: #d21011;
	}
}
.sporty-name-prompt{
	.prompt-title{
		font-size: 20/@rem;
		color: #FFF;
		font-weight: bold;
		text-align: center;
		margin-bottom: 10/@rem;
		font-family: 'MyriadPro';
	}
	.prompt-input{
		display: block;
		width: 100%;
		height: 55/@rem;
		padding: 10/@rem;
		box-sizing: border-box;
		border-radius: 4/@rem;
		background-color: #FFF;
		font-size: 24/@rem;
		font-weight: bold;
		color: #1b1e25;
		outline: none;
		border: none;
		font-family: 'MyriadPro';
	}
	.prompt-submit-btn{
		display: block;
		width: 100%;
		border-radius: 4px;
		background-color: #c6ff00;
		box-shadow: 0 6px 0 0 rgba(0, 0, 0, 0.5);
		color: #1b1e25;
		font-size: 22/@rem;
		font-weight: bold;
		text-align: center;
		line-height: 55/@rem;
		height: 55/@rem;
		margin: 13/@rem 0 30/@rem;
		font-family: 'MyriadPro';
	}
}
</style>
