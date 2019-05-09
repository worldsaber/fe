<template lang="html">
	<div class="m-order-list">
		<div class="m-order-header">
			<span class="m-order-timestamp">{{orderInfo.showTime}}</span>
			<span class="m-order-id">Ticket ID  {{orderInfo.shortId}}</span>
			<i v-if="false" class="m-order-icon share"/>
			<span v-if="false" class="m-order-share">Share</span>
		</div>
		<div :class="'m-order-bar ' + barColor" @click="showDetail">
			<span class="m-order-type">{{orderInfo.showOrderType}}</span>
			<i class="m-order-icon win" v-if="orderInfo.winningStatus === 20"/>
			<span class="m-order-icon pending" v-if="orderInfo.winningStatus === 90"/>
			<span class="m-order-status" v-if="orderInfo.winningStatus === 30">{{orderInfo.showStatus}} ({{orderInfo.correctEvents}} out of {{orderInfo.betType}})</span>
			<span class="m-order-status" v-else>{{orderInfo.showStatus}}</span>
			<i class="m-order-detail"/>
		</div>
		<div class="m-order-selection">
			<div class="m-order-vs-wrap">
				<div class="round-num label">Round No.</div>
				<div class="stake label">{{orderInfo.periodNumber}}</div>
			</div>
			<div class="m-order-total-stake">
				<div class="total-stake label">Total Stake</div>
				<div class="stake label">{{orderInfo.totalStake}}</div>
			</div>
			<div class="m-order-total-return">
				<div class="total-return label">Total Return</div>
				<div class="stake label" v-if="orderInfo.winningStatus===0||orderInfo.winningStatus===90">--</div>
				<div :class="(orderInfo.winningStatus===5||orderInfo.winningStatus===20 ? 'green' : '') + ' stake label'" v-else>{{orderInfo.totalWinnings}}</div>
			</div>
		</div>
		<div class="m-order-tips" v-if="orderInfo.winningStatus === 90">The ticket is being reviewed by our staff. Contact us if you need any help.</div>
		<div class="triangle left"/>
		<div class="triangle right"/>
	</div>
</template>

<script>
import { getShowCurrency } from 'config/currencyConfig';
import { colorMap } from './config.js';

export default {
	props: {
		orderInfo: {
			type: Object,
			default() {
				return {};
			}
		},
	},
	data () {
		return {
			showCurrency: getShowCurrency(),
		};
	},
	computed: {
		barColor() {
			return colorMap[this.orderInfo.winningStatus];
		}
	},
	methods: {
		showDetail() {
			this.$root.pageDate = {
				createTime: this.orderInfo.createTime,
				shortId: this.orderInfo.shortId
			};
			this.$router.push('/jackpot/detail/' + this.orderInfo.orderId);
		}
	},
};
</script>

<style lang="less">
@import 'base/style/icon.less';
@import 'base/style/mixin.less';
@import 'base/style/variable.less';

.m-order-list {
	.m-bet-bluetxt{
		color:@linkBlue;
		cursor: pointer;
	}

		padding: 0 20px 15px 20px;
		position: relative;
		background-color: @white;
		margin-top: 3px;

		.m-order-header{
			display: flex;
			align-items: center;
			justify-content: center;
			line-height: 32px;
			font-size: 12px;
  			font-weight: 500;
			color: @dark;
			.m-order-timestamp {
				flex: 0 0 auto;
				text-align: left;
			}
			.m-order-id {
				margin-left: 20px;
				flex: 1 1 auto;
				text-align: left;
			}
			.m-order-icon.share {
				margin-right: 7px;
				cursor: pointer;
				.m-icon-share();
				&::before {
					font-size: 12px;
				}
			}
			.m-order-share {
				flex: 0 0 auto;
			}
		}

		.m-order-bar {
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 14px;
			line-height: 24px;
			font-weight: bold;
			color: @white;
			cursor: pointer;
			padding: 0 6px;
			margin-bottom: 10px;
			background-color: @dark;
			&.green {
				background-color: @green;
			}
			&.gray {
				background-color: @darkGray;
			}
			.m-order-type {
				flex: 1 1 auto;
				text-align: left;
			}
			.m-order-icon {
				flex: 0 0 auto;
				margin: 0 4px;
				&.win {
					.m-icon-wincup();
					color: @white;
				}
				&.pending {
					height: 16px;
					width: 16px;
					background-color: @red;
				}
			}
			.m-order-status {
				flex: 0 0 auto;
				margin-right: 13px;
			}
			.m-order-detail {
				flex: 0 0 auto;
				height: 24px;
				.m-icon-arrow--right();
				color: @white;
			}
		}
		.m-order-selection {
			display: flex;
			align-items: flex-start;
			justify-content: center;
			padding-left: 2px;

			.label {
				font-size: 12px;
				line-height: 14px;
				color: @dark;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				text-align: left;
			}

			.m-order-vs-wrap {
				flex: 0 0 auto;
				width: 265px;
				.round-num.label {
					color: @darkGray;
					text-align: left;
				}
				.stake.label {
					font-size: 14px;
					line-height: 19px;
					font-weight: bold;
					color: @dark;
					text-align: left;
				}
			}

			.m-order-total-stake {
				flex: 1 1 auto;
				margin-left: 40px;
				width: 94px;

				.total-stake.label {
					color: @darkGray;
					text-align: right;
				}
				.stake.label {
					font-size: 14px;
					line-height: 19px;
					font-weight: bold;
					color: @dark;
					text-align: right;
				}
			}

			.m-order-total-return {
				flex: 0 0 auto;
				margin-left: 40px;
				width: 94px;

				.total-return.label {
					color: @darkGray;
					text-align: right;
				}

				.stake.label {
					font-size: 14px;
					line-height: 19px;
					font-weight: bold;
					color: @dark;
					text-align: right;
					&.green {
						color: @green;
					}
				}
			}
		}
		.m-order-tips {
			margin-top: 12px;
			font-size: 12px;
			line-height: 14px;
			color: @darkGray;
		}
		.triangle {
			width: 15px;
			height: 15px;
			transform: rotate(45deg);
			position: absolute;
			bottom: -9px;
			background-color: @lightGray;
			z-index: 1;
			&.left {
				left: -10px;
			}
			&.right {
				right: -10px;
			}
		}

}
</style>
