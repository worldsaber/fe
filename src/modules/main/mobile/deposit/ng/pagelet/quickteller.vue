<template>
	<div class="quickteller-wrap">
		<div class="quick-teller-logo"></div>
		<div class="quick-teller-title">Online Deposit</div>

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
		
		<div class="qt-tab qt-tab-atm" @click="goStep('atm')">
			<div class="qt-title">ATM Deposit</div>
			<div class="qt-code">Code</div>
			<div class="qt-code-num">04347201</div>
			<div class="qt-guide">Guide <span class="arrow-right"></span></div>
		</div>
		<div class="qt-tab" @click="goStep('ussd')">
			<div class="qt-title">USSD Deposit</div>
			<div class="qt-code">Code</div>
			<div class="qt-code-num">*322*1*04347201*Amount#</div>
			<div class="qt-guide">Guide <span class="arrow-right"></span></div>
		</div>
		
		
		<a href="//www.sportybet.com/ng/m/my_accounts/transactions?source=me" class="quick-teller-transaction">Check transaction result after depositing <span class="qucik-teller-arrow"></span></a>
			
	</div>
</template>
<script>
import cookie from 'storage/cookie';

export default {
	data() {
		return {
			phoneNumber: cookie('phone'),
		};
	},
	methods: {
		goStep(name) {
			this.$emit('goStep', name);
		}
	}
};
</script>
<style lang="less">
@import 'base/styles/variable.less';
@import 'base/styles/icon.less';

.quick-teller-logo{
	background: url('../img/quickteller.png');
	width: 104/@rem;
	height: 26/@rem;
	background-size: 100% 100%;
	margin: 20/@rem 16/@rem 10/@rem;
}
.quick-teller-steps-wrap{
	padding: 0/@rem 16/@rem 20/@rem;
}
.quick-teller-step{
	display: flex;
	width: 100%;
	margin: 10/@rem 0;
}
.quick-teller-step-link{
	color: #3656a3;
}
.quick-teller-step-no{
	flex-basis: 60/@rem;
	flex-shrink: 0;
	font-size: 12/@rem;
	color: #9da1ac;
}
.quick-teller-step-content{
	flex-grow: 1;
	font-size: 12/@rem;
	color: #353a45;
}
.quick-teller-visit-btn{
	display: block;
	margin: 0 16/@rem;
	height: 48/@rem;
	line-height: 48/@rem;
	font-size: 14/@rem;
	border-radius: 2/@rem;
	color: #FFF;
	background-color: #0d9737;
	text-align: center;
}
.quick-teller-transaction{
	display: block;
	font-size: 14/@rem;
	margin: 30/@rem 16/@rem;
	height: 48/@rem;
	line-height: 48/@rem;
	border-radius: 2/@rem;
	border: 1px solid #0d9737 ;
	color: #0d9737;
	text-align: center;
	.qucik-teller-arrow{
		margin-left: 10/@rem;
		.m-icon-arrow--right();
		&:before{
			font-size: 13/@rem;
		}
	}
}
.quick-teller-tip{
	display: flex;
	color: #9ca0ab;
	font-size: 12/@rem;
	margin: 10/@rem 16/@rem;
}
.quick-teller-tip-no{
	flex-shrink: 0;
	flex-basis: 20/@rem;
}
.quick-teller-tip-content{
	flex-grow: 1;
}
.quick-teller-title{
	margin-left: 16/@rem;
	font-size: 14/@rem;
	font-weight: bold;
	color: #1b1e25;
	line-height: 24/@rem;
}
.qt-tab{
	position: relative;
	margin-left: 16/@rem;
	padding: 10/@rem 0;
	border-bottom: 1px solid @lightGray;
	.qt-title{
		font-size: 14/@rem;
		font-weight: bold;
		color: #1b1e25;
		line-height: 24/@rem;
	}
	.qt-code{
		color: #9ca0ab;
		font-size: 12/@rem;
	}
	.qt-code-num{
		font-size: 18/@rem;
		color: #1b1e25;
		line-height: 24/@rem;
	}
	.qt-guide{
		position: absolute;
		top: 15/@rem;
		right: 10/@rem;
		font-size: 12/@rem;
		color: #9ca0ab;
		.arrow-right{
			padding-left: 10/@rem;
			.m-icon-arrow--right();
			&:before{
				font-size: 12/@rem;
			}
		}
	}
}

.qt-tab-atm{
	border-top: 1px solid @lightGray;
	margin-top: 24/@rem;
}
</style>

