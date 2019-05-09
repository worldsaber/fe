<template>
	<div class="sporyt-test-players-wrap">
		<div class="sporty-test-footer">
			<img src="./image/players.png" class="sporty-players"/>
			<div class="sporty-begin-btn" @click="onClick">TEST NOW</div>
		</div>
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

.sporyt-test-players-wrap{
	position: absolute;
	top: -4%;
	bottom: 0;
	width: 100%;
	// flex: 1;
	background-image: url('./image/home-back.png');
	background-size: contain;
	background-position: center -20%;
	background-repeat: no-repeat;
}
.sporty-players{
	width: 100%;
}

.sporty-test-footer{
	position: absolute;
	bottom: 20/@rem;
	width: 100%;
}
.sporty-begin-btn{
	position: absolute;
	bottom: 10/@rem;
	left: 50%;
	transform: translate(-50%);
	width: 200/@rem;
	height: 50/@rem;
	border-radius: 4/@rem;
	line-height: 50/@rem;
	font-size: 24/@rem;
	font-family: 'MyriadPro';
	font-weight: bold;
	text-align: center;
	background-color: #c6ff00;
	box-shadow: 0 6/@rem 0 0 rgba(0, 0, 0, 0.5);
}
</style>
