<template lang="html">
  <div class="m-user-info">
  	<div class="m-account">
			<div class="m-img-wrapper">
				<img :src="headImgUrl" alt="">
			</div>
  		<div class="m-user-txt" v-if="!!(firstName || lastName)"><em :title="firstName + ' ' + lastName">{{firstName}} {{lastName}}</em>{{phone}}</div>
			<div class="m-user-txt" v-else><em>{{phone}}</em></div>
  	</div>
		<div class="m-user-items">
			<div class="m-user-item m-text-main">
				<span class="m-text-second">Balance<i class="m-icon-infos" v-if="showBalanceTip">
					<div class="m-blance-tips">
						<p>Due to the abnormal match data settlement , the account balance/bonus has been corrected. Sorry for the inconvenience.</p>
					</div>
				</i></span>
				<span>{{currency}}<span>{{fomatBalance}}</span></span>
			</div>
			<!-- <div class="m-user-item m-text-main">
				<span class="m-text-second">Coins</span>
				<span>{{coins}}</span>
			</div> -->
		</div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { getShowCurrency } from 'config/currencyConfig';

export default {
	data() {
		return {
			currency: getShowCurrency()
		};
	},
	computed: {
		...mapState('userCenter', [
			'headImgUrl',
			'phone',
			'firstName',
			'lastName',
			'balance'
		]),
		...mapGetters('userCenter', [
			'fomatBalance'
		]),
		showBalanceTip() {
			if (this.balance < 0) {
				return true;
			}

			return false;
		}
	}
};
</script>

<style lang="less">
@import 'base/style/mixin.less';
@import 'base/style/variable.less';
@lightBorderColor: #e0e0e0;

.m-user-info {
	background: @white;
	box-sizing: border-box;

	.m-account {
		background: @black;
		height: 48px;
		padding:7px 0 0 12px;
		box-sizing: border-box;

		> div {
			display: inline-block;
			vertical-align: middle;
		}
		.m-user-txt{
			width:95px;
			line-height: 1.3;
			font-size: 10px;
			color: @white;
			em{
				.ellipsis();
				font-size: 14px;
				display: block;
			}
		}
	}

	.m-img-wrapper {
		width: 31px;
		height: 31px;
		border-radius: 31px;
		margin-right: 8px;
		overflow: hidden;

		img {
			background: url('../images/default.png') no-repeat center center;
			width: 31px;
			height: 31px;
		}
	}

	.m-user-items{
		border: 1px solid @grayBorder;
		border-top-color: @lightBorderColor;
		padding: 2px 5px 4px;
	}

	.m-icon-infos {
		display: inline-block;
		vertical-align: middle;
		margin-left: 5px;
		height: 100%;
		position: relative;

		&:before {
			content: '';
			width: 10px;
			height: 10px;
			border-radius: 50%;
			background: @red;
			display: inline-block;
			vertical-align: middle;
		}

		.m-blance-tips {
			position: absolute;
			display: none;
			font-size: 12px;
			line-height: 14px;
			padding: 10px;
			box-sizing: border-box;
			width: 376px;
			background: @white;
			box-shadow: 0 1px 4px 0 fadeout(@black, 50%);
			left: 0;
			top: 50%;
			transform: translate3d(20px, -50%, 0);
			border-radius: 2px;

			&:before {
				content: '';
				display: block;
				width: 10px;
				height: 10px;
				position: absolute;
				background: @white;
				box-shadow: 2px 2px 2px -1px fadeout(@black, 80%), 2px 2px 2px -1px fadeout(@black, 80%);
				border-top-color: transparent;
				border-left-color: transparent;
				top: 50%;
				left: -3px;
				transform: translate3d(0,-50%,0) rotate(135deg);
			}
		}

		&:hover {
			.m-blance-tips {
				display: block;
			}
		}
	}

	.m-text-second{
		margin-bottom: 7px;
	}
	.m-user-item {
		&:last-child{
			border-top: 1px solid @fogGrayBorder;
		}
		padding: 8px 0 8px 8px;

		> span {
			display: block;
			box-sizing: border-box;
		}
	}

	.m-text-main{
		.m-text-main();
		font-size: 14px;
	}
}
</style>
