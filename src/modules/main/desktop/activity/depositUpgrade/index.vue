<template>
	<div>
		<div class="act-deposit-header">
			<div class="act-deposit-header-center">
				<div class="act-desposit-gift"></div>
			</div>
		</div>
		<div class="act-deposit-content">
			<div class="options-title">5 Deposit+Bonus Options</div>
			<ul class="options-table">
				<li v-for="(option,index) in options" :key="index" :class="`act-option-item act-option-item-${option.style}`">
					<div class="act-option-item-text" v-for="(text,idx) in option.content" :key="idx">
						<div v-if="text.star" class="act-option-item-star-wrap">
							<template v-for="item in text.whole">
								<img class="act-option-star" src="./image/star.svg"  :key="item" />
							</template>
							<img class="act-option-star" src="./image/semi-star.svg" v-if="text.semi" />
						</div>
						<template v-else>{{text}}</template>
					</div>
				</li>
			</ul>
			<div class="options-table-tip"> The more <img class="act-option-star" src="./image/star.svg" />, the higher the chances of getting a Lucky Bonus (Options 3, 4 and 5)</div>

			<div class="act-deposit-reward-wrap">
				<div class="act-deposit-reward" v-for="(item, index) in gifts" :key="index">
					<div class="act-deposit-reward-title">{{item.title}}</div>
					<div class="act-deposit-reward-content-wrap">
						<div class="act-deposit-reward-content">{{item.content}}</div>
						<div class="act-deposit-reward-eg" v-if="item.eg">
							<div>E.g.</div>
							<div>{{item.eg}}</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<af-button class="act-deposit-btn" extraType="" @click="depositNowHandler">{{depositBtnText}}</af-button>
		<div class="act-terms-title">Terms & Conditions</div>
		<ol class="act-terms-list">
			<li class="act-terms-item" v-for="(item,index) in termsAndConds" :key="index">
				<span class="act-terms-item-order">{{index + 1}}</span>
				<template v-if="item.eg">
					{{item.value}}<span class="act-terms-item-eg">{{item.eg}}</span>
				</template>
				<template v-else>{{item}}</template>
			</li>
		</ol>
		<div class="download-app">
			<a download :href="download"></a>
		</div>
	</div>
</template>
<script>
import 'packages/button';
import { pagePath } from 'config/pageConfig';
import { userCenterConfig } from 'config/order/userCenterConfig';
import { showCurrencyOrigin } from 'config/currencyConfig';

export default {
	data () {
		return {
			activityId: 0,
			depositBtnText: 'DEPOSIT NOW',
			showCurrency: showCurrencyOrigin,
			download: pagePath.download,
			termsAndConds: [
				'Promotion Period: 14/05/2018-30/09/2018.',
				{
					value: 'In what concerns other SportyBet Deposit promotions, we will take the final amount into account.',
					eg: 'E.g. Michael deposited KES 49 for the first time and got the extra Bonus of KES 1, getting a final amount of KES 50. Michael will automatically be taking part in the First Deposit promotion for its Plan A due to the final amount being KES 50.',
				},
				'Every Deposit options and probabilities are independent. Probabilities do not stack up or accumulate. E.g. Michael deposited KES 300 and has a 20% chance of getting Cash Gifts. If Michael deposits another KES 300, the probability will still be 20% and will not raise to 40%.',
				'Promotions and Gifts are created in order to reward our most valued customers. Under suspect of fraud or abuse of this promotion by any customer, we reserve ourselves the right to remove Gifts and associated winnings from a given account or any associated accounts and freeze such accounts. SportyBet reserves itself the rights to amend, cancel, reclaim or refuse any promotion at its own discretion.'
			],
			options: [{
				style: 'header',
				content: ['OPTIONS', 'DEPOSIT AMOUNT', 'BONUSES TYPES', 'BONUSES', 'PROBABILITY'],
			}, {
				style: 'gray',
				content: [1, 'KES 49', 'Real Money', 'KES 1', '100%'],
			}, {
				style: 'white',
				content: [2, 'KES 99', 'Real Money', 'KES 3', '100%'],
			}, {
				style: 'gray',
				content: [3, 'KES 200-499', 'Cash Gifts', 'KES 10-1000', { star: true, whole: 1, semi: 1 }],
				star: true,
			}, {
				style: 'white',
				content: [4, 'KES 500-999', 'Cash Gifts', 'KES 20-2000', { star: true, whole: 2 }],
				star: true,
			}, {
				style: 'gray',
				content: [5, 'KES > 1,000', 'Cash Gifts', 'KES 30-5000', { star: true, whole: 2, semi: 1 }],
			}],
			gifts: [{
				title: 'REAL CASH',
				content: 'Extra Money which will directly be added to your account\'s Balance.',
				eg: 'Michael deposited KES 99, the final Balance amount added to his account will actually be KES 102.'
			}, {
				title: 'CASH GIFTS',
				content: 'Random chance to get an extra Cash Gifts. Cash Gifts are distributed to your account. The larger your Deposit\'s amount, the more likely it is you\'ll get a Cash Gift.',
				eg: 'Michael deposited KES 200, he was lucky and got extra KES 333 in Cash Gift.'
			}]
		};
	},
	created () {
		const currUrl = window.location.href;
		if (/\d*$/.test(currUrl)) {
			this.activityId = currUrl.match(/\d*$/)[0];
		}
	},
	methods: {
		depositNowHandler (event) {
			if (window.loginStatus) {
				window.location.href = userCenterConfig.Deposit;
			} else {
				window.login();
			}
		}
	}
};
</script>
<style lang="less" scoped>
@import "~base/style/variable.less";
.act-deposit-header{
	position: relative;
	width: 100%;
	height: 520px;
	background: url('./image/deposit-back.jpg') center center no-repeat;
	background-size: 100% 100%;
}
.act-deposit-header-center{
	position: relative;
	width: 1000px;
	height: 520px;
	margin: 0 auto;
}
.act-desposit-gift{
	position: absolute;
	top: 30px;
	left: -2px;
	width: 1004px;
	height: 459px;
	background: url('./image/deposit-gift.png') center center no-repeat;
	background-size: 100% 100%;
}
.act-deposit-content{
	width: 900px;
	margin: 80px auto 50px;
	.options-title{
		margin-bottom: 12px;
		font-size: 24px;
		font-weight: bold;
		color: #353a45;
	}
}
.act-option-item{
	display: flex;
	justify-content: center;
	align-items: center;
	color: #353a45;
	font-size: 16px;
	height: 30px;
	line-height: 30px;
}
.act-option-item-header{
	height: 40px;
	line-height: 40px;
	font-weight: bold;
	background-image: linear-gradient(to bottom, #1356e7, #0004c8);
	color: #FFF;
	margin-bottom: 10px;
}
.act-option-item-gray{
	background-color: #d8d8d8;
}
.act-option-item-white{
	background-color: rgba(216, 216, 216, 0.1);
}
.act-option-item-text{
	flex: 1;
	text-align: center;
}
.act-option-item-star-wrap{
	display: flex;
	justify-content: center;
	
}
.act-option-star{
	width: 16px;
	height: 15px;
	margin: 0 2px;
}
.options-table-tip{
	font-size: 14px;
	text-align: center;
	color: #000;
	margin: 16px 0 41px;
	.act-option-star{
		margin-top: -2px;
	}
}
.act-deposit-reward-wrap{
	display: flex;
	justify-content: space-between;

}
.act-deposit-reward{
	width: 420px;
	color: #353a45;
}
.act-deposit-reward-title{
	height: 40px;
	line-height: 40px;
	font-size: 16px;
	background-color: rgba(216, 216, 216, 0.4);
	font-weight: bold;
	text-align: center;
}
.act-deposit-reward-content-wrap{
	padding: 16px 22px;
	background-color: #fbfbfb;
}
.act-deposit-reward-content{
	font-size: 14px;
}
.act-deposit-reward-eg{
	font-size: 14px;
	margin-top: 26px;
	color: #9ca0ab;
}

.act-deposit-btn{
	display: block;
	margin: 60px auto;
	width: 260px;
	height: 60px;
	color: #FFF;
	border: none;
	font-size: 24px;
	background-image: linear-gradient(to bottom, #009aff, #020bcb);
	&:hover{
		color: #FFF;
	}
}
.act-terms-title{
	width: 900px;
	margin: 0 auto;
	font-size: 16px;
	font-weight: bold;
	color: #000;
}
.act-terms-list{
	width: 900px;
	margin: 0 auto;
	font-size: 14px;
	line-height: 1.5;
}
.act-terms-item{
	position: relative;
	margin: 10px 0;
	padding-left: 24px;
}
.act-terms-item-order{
	position: absolute;
	left: 0;
	display: inline-block;
	width: 14px;
	height: 14px;
	font-size: 12px;
	line-height: 14px;
	text-align: center;
	margin-right: 10px;
	background-color: #030ecc;
	color: #FFF;
}
.act-terms-item-eg{
	display: block;
	color: #9ca0ab;
	margin: 10px 0;
}
.download-app {
	position: relative;
	width: 700px;
	height: 130px;
	margin: 40px auto;
	background: url(./image/download_app.jpg);
	background-size: 100% 130px;
	margin-bottom: 41px;
	& > a {
		position: absolute;
		top: 52px;
		left: 450px;
		width: 225px;
		height: 55px;
	}
}
</style>
