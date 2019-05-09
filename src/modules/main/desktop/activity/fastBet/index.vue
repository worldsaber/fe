<template>
	<div :class="['fast-bet-wrapper',{
		'off': !pageReady
	}]">
		<div :class="['head',{
			'off': !pageDone
		}]">
			<img style="width:140px;height:29px" src="./image/logo.png">
		</div>
		<placeBet v-if="step === 'placeBet'" @goRegister="goRegister" @reqDone="handlePageDone"></placeBet>
  		<accountInfo v-if="step === 'register'" @goPlaceOrder="goPlaceOrder"></accountInfo>
		<betState v-if="step === 'placeOrder'"></betState>
	</div>
	
</template>
<script>
import placeBet from './pagelet/placeBet';
import accountInfo from './pagelet/accountInfo';
import betState from './pagelet/betState';

export default {
	components: {
		placeBet,
		accountInfo,
		betState
	},
	data () {
		return {
			step: 'placeBet',
			pageDone: false,
			pageReady: false
		};
	},
	methods: {
		goRegister () {
			this.step = 'register';
		},
		goPlaceOrder () {
			this.step = 'placeOrder';
		},
		handlePageDone(isError) {
			!isError && (this.pageDone = true);
			this.pageReady = true;
		}
	}
};
</script>
<style lang="less">
.fast-bet-wrapper{
	width:320px;
	height: 350px;
	background: #1c1e26;
	&.off {
		display: none;
	}
}
.s-header,.s-footer{
		display: none;
	}
.insert-invitation-wrapper{
	width:320px;
	height:360px;
	border:1px solid gray
}
.head{
	height:54px;
	background-color:#e41827;
	line-height: 54px;
	text-align: center;

	&.off {
		display: none;
	}
}
.info{
	height: 50px;
	background: #1c1e26;
	font-family: Roboto;
	font-size: 28px;
	font-weight: bold;
	line-height: 50px;
	letter-spacing: -0.4px;
	text-align: center;
	color: #fff;
}

	
</style>
