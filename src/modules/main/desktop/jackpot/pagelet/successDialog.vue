<template>
	<div class="content">
		<h3 class="title">
			<i class="m-icon-suc"></i>Submission Successful!</h3>
		<ul class="list">
			<!-- <li>
				<span>Ticket ID</span>
				<em>{{contentData.shortId||''}}</em>
			</li> -->
			<!-- <li>
				<span>Time</span>
				<em>{{contentData.time}}</em>
			</li>
			<li>
				<span>Type</span>
				<em>{{contentData.type}}</em>
			</li> -->
			<li>
				<span>Round No.</span>
				<em>{{contentData.periodNumber}}</em>
			</li>
			<li>
				<span>Combination<template v-if="contentData.combinations > 1">s</template></span>
				<em>{{contentData.combinations}}</em>
			</li>
			<li>
				<span>Total Stake</span>
				<em>{{showCurrency}} {{contentData.total}}</em>
			</li>
			<li v-if="showFavorAmount">
				<!-- 直减红包 -->
				<span v-if="contentData.favorType === 1">Cash Gifts</span>
				<span v-else>Discount Gifts</span>
				<em>{{contentData.showCurrency}}{{showFavorAmount}}</em>
			</li>
		</ul>
		<div class="m-btn-wrapper">
			<af-button
				data-action="close"
				data-ret="close"
			>OK</af-Button>
		</div>
		<div class="m-btn-text">
			<a :href="detailUrl">Check Bet History<i class="m-icon-more"></i></a>
		</div>
	</div>
</template>
<script>
import 'packages/button';
import { jackPotBetHistory } from 'config/order/userCenterConfig';
import { formatNumber } from 'utils';

export default {
	name: 'successDialog',
	data () {
		return {
			showCurrency: window.showCurrency
		};
	},
	computed: {
		detailUrl() {
			return jackPotBetHistory + '?isSettled=10';
		},
		showFavorAmount () {
			const amount = +this.contentData.favorAmount;
			// 先把单位去掉，后面看要不要加
			return amount ? `-${formatNumber(amount, 2)}` : '';
		}
	}
};
</script>
<style lang="less">
@import '~base/style/variable.less';
@import '~base/style/mixin.less';
@import '~base/style/icon.less';
@import './msgDialog.less';
.success-dialog {
	.dialog();
	.es-dialog-head {
		line-height: 0;
		height: 12px;
		padding: 14px 14px 4px;
	}
	.es-dialog-body {
		padding-bottom: 0;
		.es-dialog-main {
			padding: 0 116px 34px;
    		box-sizing: border-box;
			.content {
				.title {
					text-align: center;
					line-height: 22px;
					font-size: 18px;
					font-weight: bold;
					padding-bottom: 20px;
					.m-icon-suc {
						display: block;
						box-sizing: border-box;
						padding-bottom: 12px;
						.m-icon-success-bg();
						&:after {
							content: '';
							display: inline-block;
							height: 25px;
							width: 25px;
							background: @green;
							position: relative;
							z-index: 10;
							left: -24px;
							vertical-align: middle;
						}
						&:before {
							font-size: 40px;
							left: 9px;
							line-height: 1;
							color: @midGreen;
							position: relative;
							z-index: 11;
							vertical-align: middle;
						}
					}
				}
				.list {
					padding: 10px 0;
					box-sizing: border-box;
					border-top: 1px solid @fogGrayBorder;
					border-bottom: 1px solid @fogGrayBorder;
					li {
						display: block;
						line-height: 26px;
						height: 26px;
						font-size: 0;
						text-align: right;
						.clearfix();
						span {
							font-size: 14px;
							display: block;
							text-align: left;
							float: left;
						}
						em {
							font-size: 14px;
							font-weight: bold;
							display: inline-block;
						}
					}
				}
			}
		}

		.m-btn-wrapper {
			margin-top: 0;
			padding: 20px 0;
			box-sizing: border-box;
			text-align: center;

			.af-button--primary {
				background: @green !important;
				color: @white !important;
				height: 32px;
				width: 85px;
				font-size: 12px;
				font-weight: bold;
				border: none;

				&:hover {
					background: @midGreen !important;
				}

				&:active {
					background: @lightGreen !important;
				}
			}
		}
		.m-btn-text {
			text-align: center;
			box-sizing: border-box;
			height: 16px;

			> a {
				line-height: 16px;
				font-size: 14px;
				color: @green;
				text-decoration: none;
				display: inline-block;
				cursor: pointer;

				&:hover {
					color: @midGreen;
				}

				&:active {
					color: @lightGreen;
				}
			}

			.m-icon-more {
				margin-left: 10px;
				height: 16px;
			    display: inline-block;
			    vertical-align: middle;

				.m-icon-arrow--right();

				&:before {
					font-size: 12px;
					line-height: 16px;
				}
			}
		}
	}
}
</style>
