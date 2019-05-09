<template>
	<div class="sporty-welcome-wrap">
		<div class="sporty-label">
			Do you want to know <br />
			which EPL football star <br />
			shares a similar personality <br />
			and soul with you?<br />
		</div>
		<div class="sporty-label">Come and explore yourself!!</div>
		<div class="sporty-welcome-btn" @click="onClick">
			Click to start
		</div>
		<div class="sporty-welcome-tip">*This test is only for fun.</div>
	</div>
</template>
<script>
export default {
	methods: {
		onClick() {
			this.$emit('next');
		}
	}
};
</script>
<style lang="less">
@import 'base/styles/variable.less';
@import './font/font.less';

.sporty-welcome-wrap{
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: center;
	background-image: url('./image/question-back.png');
	background-size: contain;
	background-position: bottom center;
	background-repeat: no-repeat;
	width: 100%;
	font-family: 'MyriadProBold';
}
.sporty-welcome-content-wrap{
	width: 100%;
}

.sporty-label{
	font-size: 24/@rem;
	color: #FFF;
	font-weight: bold;
	text-align: center;
	margin: 20/@rem 0;
	letter-spacing: 0;
	line-height: 1;
	font-family: 'MyriadPro';
}
.sporty-welcome-btn{
	width: 270/@rem;
	height: 55/@rem;
	border-radius: 4/@rem;
	background-color: #c6ff00;
	box-shadow: 0 6/@rem 0 0 rgba(0, 0, 0, 0.5);
	font-weight: bold;
	color: #1b1e25;
	text-align: center;
	line-height: 55/@rem;
	font-size: 24/@rem;
	margin: 36/@rem auto 20/@rem;
	cursor: pointer;
	font-family: 'MyriadPro';
}
.sporty-welcome-tip{
	color: #FFF;
	font-size: 20/@rem;
	text-align: center;
	font-family: 'MyriadPro';
}
</style>
