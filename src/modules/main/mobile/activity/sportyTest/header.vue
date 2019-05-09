<template>
	<div class="sporty-test-header">
		<img src="./image/logo.png" class="sporty-logo"/>
		<img src="./image/test-logo.png" class="sporty-test-logo"/>
	</div>
</template>
<style lang="less">
@import 'base/styles/variable.less';

.sporty-test-header{
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 10/@rem 18/@rem;
	box-sizing: border-box;
}
.sporty-logo{
	width: 105/@rem;
	height: 20/@rem;
}
.sporty-test-logo{
	width: 62/@rem;
	height: 30/@rem;
}
</style>
