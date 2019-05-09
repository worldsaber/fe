<template>
  	<div class="congratulation-dialog">
		<div class="con-content-wrap">
			<div class="con-tip">Received a Cash Gift !</div>
			<div class="con-cash-card">
				<div class="cash-amount">
					<p class="cash-condition">On Any Stake</p>
					<span class="cash-currency">{{currency}}</span>
					<span class="cash-number">{{amount}}</span>
					<p class="cash-type">Use it in your Betslip</p>
				</div>
			</div>
			<div class="m-gifts-desc-wrapper">
				<div class="m-gifts-desc">
					<p class="title">{{title}}</p>
					<p class="description">{{srcCtt}}</p>
				</div>
				<div class="m-btn-wrapper">
					<af-Button
						class="m-btn-gift"
						extraType="text"
						data-action="close"
						data-ret="gift"
						@click="goGifts" 
						>View</af-Button>
					<af-Button
						class="m-btn-bet"
						extraType="text"
						data-action="close"
						data-ret="bet"
						@click="goBet"  
						>Bet Now</af-Button>
				</div>
			</div>
		</div>
		
	</div>
</template>
<script>
import { userCenterConfig } from 'config/order/userCenterConfig';
import { pagePath } from 'config/pageConfig';

export default {
	data () {
		return {
			view: ''
		};
	},

	computed: {
		numbers() {
			const amount = '' + this.amount;
			return amount.split('');
		},
		currency() {
			const data = this.contentData;
			return data.currency;
		},
		amount() {
			const data = this.contentData;
			return data.amount;
		},
		title() {
			const data = this.contentData;
			return data.title;
		},
		srcCtt() {
			const data = this.contentData;
			return data.srcCtt;
		},
	},
	methods: {
		goGifts() {
			location.href = userCenterConfig.Gifts;
		},
		goBet() {
			location.href = pagePath.home;
		}
	}
};
</script>

<style lang="less">
@import 'base/style/variable.less';

.m-deposit-con-dialog{
	&.es-dialog{
		border: none;
		background: url(./images/top-bg.svg) no-repeat;
		background-size: 98.5%;
		border-radius: 10px;
		overflow: inherit;
		.es-dialog-head{
			position: absolute;
			z-index: 5;
			padding: 0;
			top: 110%;
    		left: 55%;
			.es-dialog-close{
				display: block;
				line-height: 1;
				top: -12px;
				right: -2px;
				cursor: pointer;
				&:hover{
					text-decoration: none;
				}
				em{
					color: @white;
					width: 40px;
					height: 40px;
					border-radius: 50%;
					text-align: center;
					line-height: 40px;
					background: @dark;
					display: block;
					&:before{
						font-size: 14px;
					}
				}
			}
			h1{
				height: 1rem;
				line-height: 1rem;
			}
		}
		.es-dialog-body{
			background-color: transparent;
		}
		.es-dialog-main{
			background-color: transparent;
			padding: 0 15px;
			overflow: inherit;
			border-radius: 10px;
		}
	}
}
.congratulation-dialog{
	position: relative;
	width: 250px;
	font-family: AvenirNext;
	
	.con-content-wrap{
		position: relative;
		z-index: 6;
		width: 250px;
		
	}
	.con-desc{
		font-size: 20px;
		font-weight: bold;
		text-align: center;
		color: #f2f3f5;
		line-height: 0.9;
	}
	.con-tip{
		font-size: 16px;
		font-weight: bold;
		line-height: 1.13;
		text-align: center;
		color: @darker;
		margin-top: 10px;
		padding-bottom: 18px;
	}
	.con-cash-card{
		position: relative;
		display: flex;
		flex-direction: column;
		text-align: right;
		padding-right: 20px;
		justify-content: center;
		color: @white;
		
		width: 230px;
		height: 122px;
		background: url(./images/lucky-bg.svg) no-repeat;
		background-size: 125%;
		background-position: bottom;
		border-radius: 6px;
	}
	.cash-condition {
		padding-bottom: 20px;
	}
	.cash-currency{
		display: inline-block;
		vertical-align: top;
		font-size: 12px;
		font-weight: 500;
		text-align: right;
		
		line-height: 1;
		margin-top: 4px;
	}
	.cash-number{
		font-size: 36px;
		font-weight: bold;
		text-align: right;
		line-height: 1;
		margin-left: 5px;
	}
	.cash-type{
		opacity: 0.6;
		text-align: right;
	}
	.cash-corner{
		position: absolute;
		top: 52px;

		width: 12px;
		height: 12px;
		border-radius: 6px;
		background-color: #1b1e25;
	}
	.cash-left-corner{
		left: -6px;
	}
	.cash-right-corner{
		right: -6px;
		left: auto;
	}
	.m-gifts-desc-wrapper {
		width: 275px;
		margin-left: -15px;
		position: relative;
		margin-top: -1px;
		border-bottom-left-radius: 10px;
		border-bottom-right-radius: 10px;
		background-image: linear-gradient(337deg, #ff9d00, #fff801);
		box-shadow: 0 -3px 12px 0 rgba(9, 107, 39, 0.3);
		color: @darker;
		.m-gifts-desc{
			padding: 20px;
			.title {
				font-size: 16px;
				font-weight: bold;
				line-height: 1;
				text-align: center;
				margin-bottom: 14px;
			}
		}
		.m-btn-wrapper {
			text-align: center;
			padding-bottom: 25px;
			.af-button{
				font-size: 16px;
				font-weight: bold;
				height: 42px;
				border-radius: 2px;
				border: solid 1px @darker;
				text-align: center;
			}
			.m-btn-gift{
				width: 90px;
				margin-right: 14px;
				color: @darker;
			}
			.m-btn-bet{
				width: 120px;
				background-color: @darker;
				color: @white;
			}
		}
	}
}
.con-amount-list{
	display: flex;
	justify-content: center;
	.con-amount-item{
		padding: 15px;
		margin: 10px;
		border: 1px solid #DDD;
	}
}
</style>

