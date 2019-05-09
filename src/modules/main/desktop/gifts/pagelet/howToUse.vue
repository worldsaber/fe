<template>
	<div class="m-how-to-use-gifts">
		<div class="m-views">
			<div class="m-views-item">
				<div class="m-img-container">
					<img src="../image/ke/use-example-1.png" v-if="country === 'ke'">
					<img src="../image/ng/use-example-1.png" v-else-if="country === 'ng'">
					<img src="../image/gh/use-example-1.png" v-else-if="country === 'gh'">
				</div>
				<div class="m-desc-wrap">
					<div class="m-label">1</div>
					<div class="m-desc">Available Gifts will be displayed in your betslip, select a Gift to continue.</div>
				</div>
			</div>
			<div class="m-views-item">
				<div class="m-img-container">
					<img src="../image/ke/use-example-2.png" v-if="country === 'ke'">
					<img src="../image/ng/use-example-2.png" v-else-if="country === 'ng'">
					<img src="../image/gh/use-example-2.png" v-else-if="country === 'gh'">
				</div>
				<div class="m-desc-wrap">
					<div class="m-label">2</div>
					<div class="m-desc">Gifts can be used for sports and live betting. Gifts can have usage conditions, please ensure your selected Gift meets the usage conditions.</div>
				</div>
			</div>
			<div class="m-views-item">
				<div class="m-img-container">
					<img src="../image/ke/use-example-3.png" v-if="country === 'ke'">
					<img src="../image/ng/use-example-3.png" v-else-if="country === 'ng'">
					<img src="../image/gh/use-example-3.png" v-else-if="country === 'gh'">
				</div>
				<div class="m-desc-wrap">
					<div class="m-label">3</div>
					<div class="m-desc">The amount of your selected Gift will be automatically deducted from the order when you place an order.</div>
				</div>
			</div>
		</div>

		<div class="m-content-info">
			<h3 class="m-content-title">FAQ</h3>
			<ol>
				<li>
					<div class="m-label">1</div>
					<div class="m-item-wrap">
						<div class="m-item-title">How many different types of "Gifts" are there?</div>
						<div class="m-item-desc">
							a) Cash Gift, can be used without any spending condition.<br>
							b) Discount Gift, can offer discounts when spending a given amount of a stake.
						</div>
					</div>
				</li>
				<li>
					<div class="m-label">2</div>
					<div class="m-item-wrap">
						<div class="m-item-title">What constraints/conditions for Gifts are there? Do "Gifts" expire?</div>
						<div class="m-item-desc">Gifts can be exchanged for Balance after a Winning Bet which was placed with a Gift. Gifts may have a period during which they are valid and after which the Gifts will expire. Read through a Gift's information to view all details concerning usage conditions and the valid period.</div>
					</div>
				</li>
				<li>
					<div class="m-label">3</div>
					<div class="m-item-wrap">
						<div class="m-item-title">Can I simultaneously use different "Gifts"?</div>
						<div class="m-item-desc">Only 1 "Gift" can be used per transaction.</div>
					</div>
				</li>
				<li>
					<div class="m-label">4</div>
					<div class="m-item-wrap">
						<div class="m-item-title">Is it possible to cashout a "Gift"?</div>
						<div class="m-item-desc">No, it is not possible.</div>
					</div>
				</li>
				<li>
					<div class="m-label">5</div>
					<div class="m-item-wrap">
						<div class="m-item-title">How can I get gifts?</div>
						<div class="m-item-desc">Players can get gifts from promotions provided by SportyBet. If you are interested in the latest promotions, please go to "Promotions"   page to view more campaigns.</div>
					</div>
				</li>
			</ol>
		</div>

		<a :href="homeLink" class="m-bet-now-btn">BET NOW</a>
	</div>
</template>

<script>
import { pagePath } from 'config/pageConfig';

export default {
	name: 'HowToUseGifts',
	computed: {
		homeLink () {
			return pagePath.home;
		},
		country () {
			return window.country;
		}
	}
};
</script>

<style lang="less">
@import 'base/style/variable.less';

.m-how-to-use-gifts {
	margin: 44px 51px 122px 47px;
	font-family: Roboto;

	.m-views {
		overflow: hidden;

		.m-views-item {
			float: left;
			width: 33.3%;

			.m-img-container {
				margin-left: 49px;
			}

			.m-desc-wrap {
				position: relative;
				padding-top: 25px;
				padding: 25px 0 0 49px;
			}

			.m-label {
				font-size: 40px;
				font-weight: bold;
				color: @green;
				position: absolute;
				left: 18px;
				top: 0;
			}

			.m-desc {
				font-size: 12px;
				line-height: 14px;
				color: @grayBlack;
			}
		}
	}

	.m-img-container {
		img {
			width: 100%;
			vertical-align: top;
		}
	}

	.m-label {
		font-family: AvenirNext;
	}

	.m-content-info {
		margin-top: 42px;

		.m-content-title {
			font-size: 24px;
 			font-weight: 500;
  			color: @dark;
		}

		ol {
			margin-top: 28px;
			li {
				position: relative;
				padding-left: 36px;
				margin-bottom: 20px;

				.m-label {
					position: absolute;
					left: 0;
					top: 0;
					width: 22px;
					height: 22px;
					line-height: 22px;
					text-align: center;
					background: @green;
					color: @white;
					font-size: 16px;
					font-weight: bold;
				}

				.m-item-wrap {
					padding: 2px 0;
					color: @dark;

					.m-item-title {
						font-size: 14px;
						font-weight: bold;
					}

					.m-item-desc {
						font-size: 12px;
					}
				}
			}
		}
	}

	.m-bet-now-btn {
		display: block;
		width: 230px;
		height: 48px;
		line-height: 48px;
		margin: 80px auto;
		text-decoration: none;
		padding: 0;
		background: @green;
		color: @white;
		text-align: center;
		font-size: 16px;
		font-weight: bold;
		border-radius: 2px;

		&:active {
			text-decoration: none;
			background: fade(@green, 80%);
		}
	}
}
</style>
