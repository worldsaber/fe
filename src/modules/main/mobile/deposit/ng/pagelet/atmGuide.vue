<template>
	<div class="ussd-guide-wrap">
		<Navbar :backClick="backClick"><img slot="right" src="../img/help.svg" @click="depositHelp"></Navbar>
		<div class="quickteller-logo" />
		<div class="guide-title">ATM Deposit Guide</div>
		<ul class="step-wrap">
			<li class="step-item" v-for="(step, index) in steps" :key="index">
				<div class="step-no">Step {{index + 1}}</div>
				<div class="step-content">
					<div class="step-label">{{step.label}}</div>
					<img class="step-image" :src="step.img" v-if="step.img"/>
				</div>
			</li>
		</ul>
	</div>
</template>
<script>
import Navbar from 'components/navbar';
import cookie from 'storage/cookie';
import Step1 from '../img/Step1@2x.png';
import Step2 from '../img/Step2@2x.png';
import Step3 from '../img/Step3@2x.png';
import Step4 from '../img/Step4@2x.png';
import Step5 from '../img/Step5@2x.png';
import Step6 from '../img/Step6@2x.png';
import Step7 from '../img/Step7@2x.png';
import Step8 from '../img/Step8@2x.png';
import Step9 from '../img/Step9@2x.png';

export default {
	components: {
		Navbar,
	},
	data() {
		return {
			phoneNumber: cookie('phone'),
		};
	},
	computed: {
		steps() {
			return [{
				label: 'Insert your card and enter your PIN.',
				img: Step1,
			}, {
				label: 'Select "Pay Bills" or "Quickteller" depending on the ATM',
				img: Step2,
			}, {
				label: 'Select your account type.',
				img: Step3,
			}, {
				label: 'You will be directed to choose a payment option - select either "Pay Merchant" or "Others" depending on the ATM.',
				img: Step4,
			}, {
				label: 'You will be prompted for a Merchant Code, which is 04347201 for SportyBet.',
				img: Step5,
			}, {
				label: `Input your SportyBet account number ${this.phoneNumber}.`,
				img: Step6,
			}, {
				label: 'Input the amount that you would like to deposit.',
				img: Step7,
			}, {
				label: 'Input your phone number and select "Proceed”.',
				img: Step8,
			}, {
				label: 'You will then receive confirmation that the payment has been completed successfully.',
				img: Step9,
			}];
		}
	},
	methods: {
		depositHelp() {
			location.href = pagePath.help + '#/how-to-play/others/how-to-deposit';
		},
		backClick() {
			this.$emit('goStep', 'pay');
		}
	}
};
</script>

<style lang="less">
@import 'base/styles/variable.less';
.ussd-guide-wrap{
	.guide-title{
		font-size: 20/@rem;
		color: #1b1e25;
		font-weight: bold;
		margin: 0 16/@rem 20/@rem;
	}
	.step-wrap{
		margin: 0 16/@rem;
	}
	.step-item{
		display: flex;
		margin: 6/@rem 0;
		&:first-child{
			.step-image{
				width: 37/@rem;
			}
		}
		.step-no{
			flex-basis: 56/@rem;
			color: #9da1ac;
			font-size: 12/@rem;
		}
		.step-content{
			flex: 1;
			font-size: 12/@rem;
			color: #353a45;
		}
		.step-image {
			width: 150/@rem;
			margin: 5/@rem 0 10/@rem;
		}
	}
}
.quickteller-logo{
	background: url('../img/quickteller.png') center right no-repeat;
	height: 26/@rem;
	background-size: 104/@rem 100%;
	margin: 10/@rem 16/@rem;
}
</style>

