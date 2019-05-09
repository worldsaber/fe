<template>
	<div class="ussd-guide-wrap">
		<Navbar :backClick="backClick"><img slot="right" src="../img/help.svg" @click="depositHelp"></Navbar>
		<div class="quickteller-logo" />
		<div class="guide-title">USSD Deposit Guide</div>
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
import Ussd2 from '../img/Ussd-2@2x.png';
import Ussd3 from '../img/Ussd-3@2x.png';
import Ussd4 from '../img/Ussd-4@2x.png';

export default {
	components: {
		Navbar,
	},
	computed: {
		steps() {
			return [{
				label: 'Dail *322*1*04347201*Amount#'
			}, {
				label: 'Enter your Phone Number',
				img: Ussd2,
			}, {
				label: 'Select the payment method',
				img: Ussd3
			}, {
				label: 'Enter the PIN',
				img: Ussd4
			}, {
				label: 'Payment successful'
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
			width: 180/@rem;
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

