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
import { userCenterUrl } from 'config/mycenter/dataConfig';
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
			location.href = userCenterUrl.gift;
		},
		goBet() {
			location.href = pagePath.sports;
		}
	}
};
</script>

<style lang="less">
@import 'base/styles/variable.less';

.m-deposit-con-dialog{
	&.es-dialog{
		border: none;
		background: url(./images/top-bg.svg) no-repeat;
		background-size: 110%;
		border-radius: 10/@rem;
		overflow: inherit;
		.es-dialog-head{
			position: absolute;
			z-index: 5;
			padding: 0;
			top: 105%;
    		left: 60%;
			.es-dialog-close{
				display: block;
				line-height: 1;
				top: -12/@rem;
				right: -2/@rem;
				cursor: pointer;
				&:hover{
					text-decoration: none;
				}
				em{
					color: @white;
					width: 40/@rem;
					height: 40/@rem;
					border-radius: 50%;
					text-align: center;
					line-height: 40/@rem;
					background: @dark;
					display: block;
					&:before{
						font-size: 14/@rem;
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
			padding: 0 15/@rem;
			overflow: inherit;
			border-radius: 10/@rem;
		}
	}
}
.congratulation-dialog{
	position: relative;
	width: 250/@rem;
	font-family: AvenirNext;
	
	.con-content-wrap{
		position: relative;
		z-index: 6;
		width: 250/@rem;
		
	}
	.con-desc{
		font-size: 20/@rem;
		font-weight: bold;
		text-align: center;
		color: #f2f3f5;
		line-height: 0.9;
	}
	.con-tip{
		font-size: 16/@rem;
		font-weight: bold;
		line-height: 1.13;
		text-align: center;
		color: @darker;
		margin-top: 5/@rem;
		padding-bottom: 18/@rem;
	}
	.con-cash-card{
		position: relative;
		display: flex;
		flex-direction: column;
		text-align: right;
		padding-right: 20/@rem;
		justify-content: center;
		color: @white;
		
		width: 230/@rem;
		height: 122/@rem;
		background: url(./images/lucky-bg.svg) no-repeat;
		background-size: 125%;
		background-position: bottom;
		border-radius: 6/@rem;
	}
	.cash-condition {
		padding-bottom: 20/@rem;
	}
	.cash-currency{
		display: inline-block;
		vertical-align: top;
		font-size: 12/@rem;
		font-weight: 500;
		text-align: right;
		
		line-height: 1;
		margin-top: 4/@rem;
	}
	.cash-number{
		font-size: 36/@rem;
		font-weight: bold;
		text-align: right;
		line-height: 1;
		margin-left: 5/@rem;
	}
	.cash-type{
		opacity: 0.6;
		text-align: right;
	}
	.cash-corner{
		position: absolute;
		top: 52/@rem;

		width: 12/@rem;
		height: 12/@rem;
		border-radius: 6/@rem;
		background-color: #1b1e25;
	}
	.cash-left-corner{
		left: -6/@rem;
	}
	.cash-right-corner{
		right: -6/@rem;
		left: auto;
	}
	.m-gifts-desc-wrapper {
		width: 275/@rem;
		margin-left: -15/@rem;
		position: relative;
		margin-top: -1/@rem;
		border-bottom-left-radius: 10/@rem;
		border-bottom-right-radius: 10/@rem;
		background-image: linear-gradient(337deg, #ff9d00, #fff801);
		box-shadow: 0 -3px 12px 0 rgba(9, 107, 39, 0.3);
		color: @darker;
		line-height: 1.5;
		.m-gifts-desc{
			padding: 20/@rem;
			.title {
				font-size: 16/@rem;
				font-weight: bold;
				line-height: 1;
				text-align: center;
				margin-bottom: 14/@rem;
			}
		}
		.m-btn-wrapper {
			text-align: center;
			padding-bottom: 18/@rem;
			.af-button{
				font-size: 16/@rem;
				font-weight: bold;
				height: 42/@rem;
				border-radius: 2/@rem;
				border: solid 1/@rem @darker;
				text-align: center;
			}
			.m-btn-gift{
				width: 90/@rem;
				margin-right: 14/@rem;
				color: @darker;
			}
			.m-btn-bet{
				width: 120/@rem;
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
		padding: 15/@rem;
		margin: 10/@rem;
		border: 1/@rem solid #DDD;
	}
}
</style>

