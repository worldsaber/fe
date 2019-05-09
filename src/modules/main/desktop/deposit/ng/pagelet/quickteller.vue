<template>
	<div class="quickteller-wrap">
		<div class="quick-teller-logo"></div>
		<div class="quick-teller-steps-wrap">
			<div class="quick-teller-step">
				<div class="quick-teller-step-no">Step 1</div>
				<div class="quick-teller-step-content">Visit <a class="quick-teller-step-link" href="//www.quickteller.com/sportybet">www.quickteller.com/sportybet</a></div>
			</div>
			<div class="quick-teller-step">
				<div class="quick-teller-step-no">Step 2</div>
				<div class="quick-teller-step-content">Enter your SportyBet Login Mobile Phone Number: {{phoneNumber}}, The amount you wish to deposit, your Email.</div>
			</div><div class="quick-teller-step">
				<div class="quick-teller-step-no">Step 3</div>
				<div class="quick-teller-step-content">Verify payment details and click on PAY</div>
			</div><div class="quick-teller-step">
				<div class="quick-teller-step-no">Step 4</div>
				<div class="quick-teller-step-content">A payment receipt will be generated and you will receive an email notification to the email provided.</div>
			</div>
		</div>
		<a href="https://www.quickteller.com/sportybet " class="quick-teller-visit-btn">Visit Quickteller to Deposit</a>
		<a href="//www.sportybet.com/ng/my_accounts/transactions?source=me" class="quick-teller-transaction">Check transaction result after depositing <span class="qucik-teller-arrow"></span></a>
		<div class="quick-teller-tip-title">Note</div>
		<div class="quick-teller-tip">
			<span class="quick-teller-tip-no">1.</span>
			<span class="quick-teller-tip-content">There is a NGN 100 charge for deposits with this payment method. </span>
		</div>
		<div class="quick-teller-tip">
			<span class="quick-teller-tip-no">2.</span>
			<span class="quick-teller-tip-content">Please note that The SportyBet Login Mobile Phone number filled in Quickteller is the only identifier for SportyBet. If you enter the wrong information, the transfer amount may not be returned.</span>
		</div>
	</div>
</template>
<script>
import cookie from 'storage/cookie';

export default {
	data() {
		const phoneNumber = cookie('phone');
		return {
			phoneNumber,
		};
	}

};
</script>

<style lang="less">
@import 'base/style/icon.less';
@import 'base/style/variable.less';

.quick-teller-logo{
	background: url('../image/quickteller.png');
	width: 104px;
	height: 26px;
	background-size: 100% 100%;
	margin: 20px 0;
}
.quick-teller-steps-wrap{
	padding: 0 0 20px;
}
.quick-teller-step{
	display: flex;
	width: 100%;
	margin: 10px 0;
}
.quick-teller-step-link{
	color: #3656a3;
}
.quick-teller-step-no{
	flex-basis: 60px;
	flex-shrink: 0;
	font-size: 12px;
	color: #9da1ac;
}
.quick-teller-step-content{
	flex-grow: 1;
	font-size: 12px;
	color: #353a45;
}
.quick-teller-visit-btn{
	display: block;
	width: 220px;
	height: 48px;
	line-height: 48px;
	font-size: 14px;
	border-radius: 2px;
	color: #FFF;
	background-color: #0d9737;
	text-align: center;
}
.quick-teller-transaction{
	display: block;
	font-size: 14px;
	margin: 20px 0 30px; 
	color: #0d9737;
	// text-align: center;
	.qucik-teller-arrow{
		margin-left: 10px;
		.m-icon-arrow--right();
		&:before{
			font-size: 13px;
		}
	}
}
.quick-teller-tip{
	display: flex;
	color: #353a45;
	font-size: 12px;
	margin: 10px 0;
}
.quick-teller-tip-no{
	flex-shrink: 0;
	flex-basis: 20px;
}
.quick-teller-tip-content{
	flex-grow: 1;
}
.quick-teller-tip-title {
	line-height: 16px;
	font-size: 14px;
	.m-icon-light2();
	margin-bottom: 10px;
	margin-top: 40px;
	padding-top: 20px;
	border-top: solid 1px #eaecef;
	&:before {
		font-size: 18px;
		line-height: 1;
		color: @green;
		margin-right: 6px;
	}
}

</style>
