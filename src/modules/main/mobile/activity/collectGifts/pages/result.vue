<template>
	<div class="m-catch-gift-result" v-pageLoading="isLoading">
		<HeaderLogo></HeaderLogo>

		<div :class="['m-wrap-status', `m-wrap-status--${status}`]">
			<div class="m-result-title">
				<div class="m-title" v-if="status === 'success'">
					<span class="m-text">Congratulations! <i class="m-icon">+</i></span>
				</div>
				<div class="m-desc">
					<span>{{resultDescText}}</span>
					<i class="m-icon" v-if="status === 'limited'"></i>
				</div>
			</div>

			<div class="m-gift-wrap" v-if="hasGotGift">
				<a :href="homeLink" class="m-gift">
					<div class="m-gift-info">
						<div class="m-title">{{showCurrency}} {{gift.initBal}} OFF</div>
						<div class="m-desc">
							<div class="m-type">Cash Gift</div>
							<div class="m-expire-time">Expires on {{showExpireTime}}</div>
						</div>
					</div>
					<a :href="homeLink" class="m-use-btn">use now</a>
				</a>
			</div>

			<a v-if="status === 'limited'" :href="homeLink" class="m-use-all">Use Them Now</a>
		</div>

		<div class="m-get-more">
			<div class="m-desc">Download App to</div>
			<a :href="downloadAppLink" target="_blank" class="m-download-btn">
				Get {{showCurrency}} 40 More
			</a>
		</div>

		<!-- eg. 20 Gifts collected in 36 seconds -->
		<!-- <div class="m-rank-list" v-if="hasGotGift">
			<div class="m-title">
				<span>{{gift.title}}</span>
			</div>
			<ul>
				<template v-for="item in rankList">
					<li :key="item" :class="['m-list-item', { 'is-top': item.top }]">
						<span>{{item.phone}}</span>
						<span>{{showCurrency}} {{item.giftAmount}}</span>
					</li>
				</template>
			</ul>
		</div> -->

		<FooterDesc></FooterDesc>
	</div>
</template>

<script>
import 'packages/button';
import dateFormat from 'kernel/js/dateFormat';
import { pagePath } from 'config/pageConfig';
import { formatNumber } from 'utils';
import cookie from 'storage/cookie';
import FooterDesc from '../pagelet/footerDesc';
import HeaderLogo from '../pagelet/headerLogo';

export default {
	name: 'CollectGiftsResult',
	components: {
		HeaderLogo,
		FooterDesc
	},
	data () {
		return {
			homeLink: pagePath.home,
			downloadAppLink: `${pagePath.reDownloadApp}?channel=share`,
			showCurrency: window.showCurrency,
			status: '',
			isLoading: true,
			gift: {},
			rankList: []
		};
	},
	computed: {
		hasGotGift () {
			return ((this.status === 'success' || this.status === 'done') &&
			this.rankList && this.rankList.length > 0);
		},
		phoneNumber () {
			return cookie('phone');
		},
		showExpireTime () {
			if (!this.gift.expireTime) {
				return '';
			}
			return dateFormat.format(this.gift.expireTime, 'DD/MM/YYYY');
		},
		resultDescText () {
			const { status, phoneNumber } = this;
			switch (status) {
			// 恭喜领到红包
			case 'success':
				return `The Gift has been distributed to your account: ${phoneNumber}.`;
			// 已经领取过了
			case 'done':
				return `This Gift has already been distributed to your account: ${phoneNumber}.`;
			// 获得红包达到上限
			case 'limited':
				return 'You already collected all 3 daily Cash Gifts.';
			// 红包领完
			case 'over':
				return 'Uh-oh, all Gifts have been collected! Next time, get yours as soon as possible!';
			// 不存在
			case 'none':
				return 'Uh-oh, the Gift does not exist. You may download our App to get other Gifts. ';
			default:
				// no default
			}
		}
	},
	methods: {
		parseStatus (bizCode) {
			switch (bizCode) {
			case 10000:
				this.status = 'success';
				break;
			case 73710:
				this.status = 'done';
				break;
			case 73711:
				this.status = 'limited';
				break;
			case 73712:
				this.status = 'over';
				break;
			default:
				this.status = 'none';
				break;
			}
		},
		fetchData () {
			const { giftId } = this.$route.params;
			if (!giftId) {
				this.status = 'none';
				return;
			}
			this.isLoading = true;

			return fetch(`/promotion/v1/groupGift/${giftId}`, {
				method: 'POST'
			})
			.then(res => res.json())
			.then(res => {
				const { bizCode, data } = res;

				this.parseStatus(bizCode, data);

				if (bizCode === 10000 || bizCode === 73710) {
					const originData = { ...data };
					originData.gift.initBal /= 10000;
					this.gift = originData.gift;
					this.rankList = originData.gift.rank.map(x => {
						x.giftAmount = formatNumber(x.giftAmount / 10000, 2);
						return x;
					});
				}

				this.isLoading = false;
			})
			.catch(() => {
				this.isLoading = false;
				this.$toast('Something went wrong. Please try again.');
			});
		}
	},
	mounted () {
		this.fetchData();
	}
};
</script>

<style lang="less">
@import "base/styles/variable.less";
@import "base/styles/icon.less";

@purple: #36008a;

body,
.page-content,
.m-main-wrap {
	height: 100%;
}

.m-catch-gift-result {
	width: 100%;
	max-width: 800px;
	min-height: 100%;
	margin: 0 auto;
	padding: 12/@rem 0;
	box-sizing: border-box;
	position: relative;
	background: linear-gradient(to bottom, #4300b3, #320081);;
	background-color: #4300b3;
	color: @white;

	.m-wrap-status {
		&--done,
		&--over {
			.m-result-title {
				margin-top: 53/@rem;
			}
		}

		&--limited {
			.m-result-title {
				margin: 53/@rem 20/@rem 0;
			}

			.m-icon {
				.m-icon-light2();

				&:before {
					font-size: 16/@rem;
					color: @lightGreen;
				}
			}
		}
	}

	.m-result-title {
		margin: 62/@rem 25/@rem 0;

		.m-title {
			font-size: 24/@rem;
			font-weight: bold;
			line-height: 28/@rem;
			color: @midYellow;
			text-align: center;
			position: relative;

			.m-text {
				position: relative;

				.m-icon,
				&:before,
				&:after {
					content: '+';
					font-size: 14/@rem;
					line-height: 1;
					font-weight: 900;
					font-style: italic;
					color: #fac111;
					position: absolute;
					top: -8/@rem;
				}

				.m-icon {
					color: #4772ff;
					top: -30/@rem;
					right: -8/@rem;
				}

				&:before {
					left: -9/@rem;
				}

				&:after {
					right: -9/@rem;
				}
			}
		}

		.m-desc {
			margin-top: 6/@rem;
			font-size: 14/@rem;
			font-weight: bold;
			line-height: 16/@rem;
			color: @fogGray;
		}
	}

	.m-gift-wrap {
		margin: 3/@rem auto 0;
		position: relative;
		width: 360/@rem;
		max-width: 100%;
		padding-top: (122/362)*100%;
		background: url(../images/giftBg.png) no-repeat 0 0;
		background-size: 100% auto;

		.m-gift {
			display: block;
			color: @white;
			height: (95/122) * 100%;
			max-width: (320/360) * 100%;
			position: absolute;
			bottom: 0;
			left: 20/@rem;
			right: 20/@rem;
		}

		.m-gift-info {
			position: absolute;
			top: 50%;
			left: 20/@rem;
			padding: 8/@rem 0;
			transform: translateY(-50%);

			.m-title {
				font-size: 26/@rem;
				font-weight: 900;
				line-height: 32/@rem;
			}

			.m-desc {
				margin-top: 8/@rem;
				font-size: 14/@rem;
				font-weight: 500;
				line-height: 16/@rem;
			}
		}

		.m-use-btn {
			display: inline-block;
			position: absolute;
			right: 20/@rem;
			top: 50%;
			transform: translateY(-50%);
			padding: 0 20/@rem;
			height: 32/@rem;
			line-height: 32/@rem;
			text-align: center;
			border-radius: 17/@rem;
			background-image: linear-gradient(to right, #51a8ec, #4a79f5 33%, #2528ca);
			background-color: #4a79f5;
			color: @white;
			font-size: 16/@rem;
			font-weight: 900;
		}
	}

	.m-use-all {
		display: block;
		margin: 8/@rem 20/@rem;
		height: 44/@rem;
		line-height: 44/@rem;
		border-radius: 2px;
		border: solid 2px @midGreen;
		font-size: 18/@rem;
		font-weight: 900;
		color: @lightGreen;
		text-align: center;
	}

	.m-rank-list {
		margin: 60/@rem 20/@rem 20/@rem;
		padding: 20/@rem 0;
		background-color: fade(@white, 10%);
		border-radius: 2px;

		.m-title {
			font-size: 15/@rem;
			font-weight: 900;
			color: @midYellow;
			text-align: center;
			line-height: 18/@rem;

			& > span {
				display: inline-block;
				position: relative;

				&:before,
				&:after {
					content: '+';
					font-size: 15/@rem;
					line-height: 1;
					font-weight: 900;
					font-style: italic;
					color: #5c8cff;
					position: absolute;
					top: 50%;
					transform: translateY(-50%);
					margin-top: -2px;
				}

				&:before {
					left: -28/@rem;
				}
				&:after {
					right: -28/@rem;
				}
			}

		}

		& > ul {
			margin-top: 20/@rem;
		}

		.m-list-item {
			padding: 0 20/@rem;
			box-sizing: border-box;
			display: flex;
			justify-content: space-between;
			color: @white;
			height: 30/@rem;
			line-height: 30/@rem;
			position: relative;

			&.is-top {
				border-radius: 2px;
				background: url(../images/topBg.png) #ff8401 no-repeat 0 0;
				background-size: auto 100%;
			}

			&:after {
				content: '';
				height: 1px;
				background: fade(@white, 10%);
				position: absolute;
				bottom: 0;
				left: 20/@rem;
				right: 20/@rem;
			}
		}
	}

	.m-get-more {
		margin: 20/@rem 20/@rem;

		.m-desc {
			margin-bottom: 6/@rem;
			color: fade(@white, 80%);
		}
	}

	.m-download-btn {
		display: block;
		text-align: center;
		color: @white;
		height: 44/@rem;
		line-height: 44/@rem;
		font-size: 18/@rem;
		font-weight: 900;
		border-radius: 2px;
		background: @green linear-gradient(to bottom, #13d700, #0d9737);

		&:hover,
		&:active {
			background: #075000 linear-gradient(to bottom, #075000, #0d9737);
		}

		&.is-loading {
			background: @dark;

			span {
				opacity: 0.5;
			}

			&:before {
				background-color: transparent;
			}
		}
	}

	.m-footer-desc {
		margin-top: 20/@rem;
		padding: 20/@rem;
	}
}
</style>
