<template>
<Layout :isHaveLoading="false" :isHasFooter="false" :isHaveBottomNav="false">
	<div class="m-how-to-use-gifts" slot="mid">
		<NavBar />
		<div class="m-views">
			<div class="m-views-item">
				<div class="m-label">STEP <span>1</span></div>

				<div class="m-img-container">
					<img src="./image/ke/use-example-1.png" v-if="country === 'ke'">
					<img src="./image/ng/use-example-1.png" v-else-if="country === 'ng'">
					<img src="./image/gh/use-example-1.png" v-else-if="country === 'gh'">
				</div>
				<div class="m-desc">Available Gifts will be displayed in your betslip, select a Gift to continue.</div>
			</div>
			<div class="m-views-item">
				<div class="m-label">STEP <span>2</span></div>
				<div class="m-img-container">
					<img src="./image/ke/use-example-2.png" v-if="country === 'ke'">
					<img src="./image/ng/use-example-2.png" v-else-if="country === 'ng'">
					<img src="./image/gh/use-example-2.png" v-else-if="country === 'gh'">
				</div>
				<div class="m-desc">Gifts can be used for sports and live betting. Gifts can have usage conditions, please ensure your selected Gift meets the usage conditions.</div>
			</div>
			<div class="m-views-item">
				<div class="m-label">STEP <span>3</span></div>
				<div class="m-img-container">
					<img src="./image/ke/use-example-3.png" v-if="country === 'ke'">
					<img src="./image/ng/use-example-3.png" v-else-if="country === 'ng'">
					<img src="./image/gh/use-example-3.png" v-else-if="country === 'gh'">
				</div>
				<div class="m-desc">The amount of your selected Gift will be automatically deducted from the order when you place an order.</div>
			</div>
		</div>

		<div class="m-content-info">
			<h3 class="m-content-title">FAQ</h3>
			<ol>
				<li>
					<div class="m-label">1.</div>
					<div class="m-item-wrap">
						<div class="m-item-title">How many different types of "Gifts" are there?</div>
						<div class="m-item-desc">
							a) Cash Gift, can be used without any spending condition.<br>
							b) Discount Gift, can offer discounts when spending a given amount of a stake.
						</div>
					</div>
				</li>
				<li>
					<div class="m-label">2.</div>
					<div class="m-item-wrap">
						<div class="m-item-title">What constraints/conditions for Gifts are there? Do "Gifts" expire?</div>
						<div class="m-item-desc">Gifts can be exchanged for Balance after a Winning Bet which was placed with a Gift. Gifts may have a period during which they are valid and after which the Gifts will expire. Read through a Gift's information to view all details concerning usage conditions and the valid period.</div>
					</div>
				</li>
				<li>
					<div class="m-label">3.</div>
					<div class="m-item-wrap">
						<div class="m-item-title">Can I simultaneously use different "Gifts"?</div>
						<div class="m-item-desc">Only 1 "Gift" can be used per transaction.</div>
					</div>
				</li>
				<li>
					<div class="m-label">4.</div>
					<div class="m-item-wrap">
						<div class="m-item-title">Is it possible to cashout a "Gift"?</div>
						<div class="m-item-desc">No, it is not possible.</div>
					</div>
				</li>
				<li>
					<div class="m-label">5.</div>
					<div class="m-item-wrap">
						<div class="m-item-title">How can I get gifts?</div>
						<div class="m-item-desc">Players can get gifts from promotions provided by SportyBet. If you are interested in the latest promotions, please go to "Promotions"   page to view more campaigns.</div>
					</div>
				</li>
			</ol>
		</div>

		<a :href="homeLink" class="m-bet-now-btn">BET NOW</a>
	</div>
</Layout>
</template>

<script>
import Layout from 'components/layout/main.vue';
import NavBar from 'components/navbar';
import { pagePath } from 'config/pageConfig';
import { mapMutations } from 'vuex';
import { CHANGE_LOADING } from 'store/layout/mutationTypes.js';

export default {
	name: 'HowToUseGifts',
	components: {
		Layout,
		NavBar
	},
	computed: {
		homeLink () {
			return pagePath.home;
		},
		country () {
			return window.country;
		}
	},
	methods: {
		...mapMutations('layout', {
			stopLoading: CHANGE_LOADING
		})
	},
	created () {
		this.stopLoading(false);
	}
};
</script>

<style lang="less">
@import 'base/styles/variable.less';
@import 'base/styles/icon.less';

.m-how-to-use-gifts {
	.m-views {
		margin: 55/@rem 54/@rem 0 59/@rem;

		.m-views-item {
			position: relative;
			margin-bottom: 24/@rem;

			&:not(:last-child) {
				padding: 0 0 38/@rem;
				.m-icon-down();
				&:before {
					position: absolute;
					bottom: 0;
					left: 50%;
					transform: translateX(-50%);
					font-size: 30/@rem;
					line-height: 1;
					color: @lightGray;
				}
			}


			.m-label {
				font-size: 20/@rem;
				font-weight: bold;
				color: @green;
				position: absolute;
				right: 20/@rem;
				top: 0;

				& > span {
					display: inline-block;
					width: 26/@rem;
					height: 26/@rem;
					line-height: 26/@rem;
					text-align: center;
					background: @green;
					color: @white;
				}
			}

			.m-desc {
				margin-top: 19/@rem;
				font-size: 12/@rem;
				line-height: 16/@rem;
				color: @black2;
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
		margin-top: 46/@rem;

		.m-content-title {
			font-size: 20/@rem;
 			font-weight: bold;
  			color: @dark;
  			text-align: center;
		}

		ol {
			margin-top: 39/@rem;
			padding: 0 21/@rem;
			li {
				position: relative;
				padding: 0 17/@rem 0 20/@rem;
				margin-bottom: 16/@rem;
				color: @dark;

				.m-label {
					position: absolute;
					left: 0;
					top: 0;
					line-height: 16/@rem;
					font-size: 14/@rem;
					font-weight: bold;
				}

				.m-item-wrap {
					.m-item-title {
						font-size: 14/@rem;
						line-height: 16/@rem;
						font-weight: bold;
					}

					.m-item-desc {
						margin-top: 4/@rem;
						font-size: 12/@rem;
						line-height: 14/@rem;
					}
				}
			}
		}
	}

	.m-bet-now-btn {
		display: block;
		width: 230/@rem;
		height: 48/@rem;
		line-height: 48/@rem;
		margin: 100/@rem auto;
		text-decoration: none;
		background: @green;
		color: @white;
		text-align: center;
		font-size: 16/@rem;
		font-weight: bold;
		border-radius: 2/@rem;

		&:active {
			text-decoration: none;
		}
	}
}
</style>
