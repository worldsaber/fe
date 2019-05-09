<template>
	<div class="deposit-reg-footer">
		<router-link :to="link">
			<span class="deposit-reg-footer-terms">Terms & Conditions</span>
		</router-link>
		<span class="deposit-reg-footer-copyright">© 2018 SportyBet.</span>
	</div>
</template>
<script>
export default {
	props: {
		link: Object
	}
};
</script>

<style lang="less">
@import 'base/styles/icon.less';
@import 'base/styles/variable.less';

.deposit-reg-footer{
	.m-icon-sportbet();
	height: 48/@rem;
	line-height: 48/@rem;
	padding: 0 10/@rem 0 5/@rem;
	color: #FFF;
	background-color: #353a45;
	text-align: right;
	&::before{
		position: absolute;
		left: 5/@rem;
		opacity: 0.5;
	}
}
.deposit-reg-footer-terms{
	font-size: 12/@rem;
	color: #32ce62;
	margin-right: 5/@rem;
}
.deposit-reg-footer-copyright{
	color: #FFF;
	opacity: 0.5;
	font-size: 12/@rem;
}
</style>

