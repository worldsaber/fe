<template>
	<div class="deposit-registered-wrap">
		<i class="icon-close" data-action="close" data-ret="closeBtn" ></i>
		<div class="deposit-registered-content">The number has been registered.</div>
		<div class="m-btn-wrapper">
			<!-- <a :href="forgetUrl" class="deposit-registered-btn" data-action="btn" data-ret="forget">Forget Password</a> -->
			<a :href="loginUrl" class="deposit-registered-btn deposit-registered-btn-login" data-action="btn" data-ret="login">Go to Website</a>
		</div>
	</div>
</template>
<script>
import { pagePath } from 'config/pageConfig';

export default {
	data() {
		return {
			forgetUrl: pagePath.resetPassword,
			loginUrl: pagePath.home
		};
	}
};
</script>
<style lang="less">
@import 'base/styles/variable.less';
@import 'base/styles/icon.less';

.deposit-registered-wrap{
	padding: 16/@rem 0 20/@rem 0;

	.icon-close {
		position: absolute;
		top: 10/@rem;
		right: 10/@rem;
		line-height: 16/@rem;
		.m-icon-close();
		&::before {
			font-size: 16/@rem;
		}
	}
}
.deposit-registered-content{
	font-size: 14/@rem;
	padding-bottom: 32/@rem;
}
.m-btn-wrapper{
	text-align: right;
}
.deposit-registered-btn{
	display: inline-block;
	height: 36/@rem;
	width: 100/@rem;
	line-height: 36/@rem;

	border: 1px solid #0d9737;
	color: #0d9737;
	border-radius: 2/@rem;
	text-align: center;
}
.deposit-registered-btn-login{
	background: #0d9737;
	border-color: #0d9737;
	color: #FFF;
	margin-left: 10/@rem;
}
</style>
