<template>
	<div class="m-issue-rank">
		<h1 class="m-rank-h1">Bring Victory to Your Country!</h1>
		<h1 class="m-rank-h2">Will you become the champion?</h1>
		<p class="m-rank-desc">For all participants of the Winning Country</p>
		<div class='m-rank-kes'><span>{{showCurrencyOrigin}}</span>{{getShowGifts}}</div>
		<div class="m-rank-advert" v-if="logoUrl">
			<span>Sponsored by</span>
			<img class="m-rank-advert-image" :src="logoUrl" />
		</div>
		<div class="m-rank-heat">Heat Index</div>
		<div class="m-rank-country">
			<div class="country-wrap">
				<img class="icon-kenya" src="../image/kenya-icon.png">
				Kenya
			</div>
			<div class="country-wrap">
				Nigeria
				<img class="icon-nigeria" src="../image/nigeria-icon.png">
			</div>
		</div>
		<div class="m-rank-vs"><img class="icon-vs" src="../image/vs-bar.svg"></div>
		<p class="m-rank-rule">Heat index is adjusted in accordance to the number of customers online from each country and the ratio of correct answers in proportion to the number of total participants from each country.</p>
		<div class="m-rank-claim">
			<i class="m-icon-claim"></i>
			<p class="claim-text">Claims: we do not wish to promote any conflicts between both countries, our hope is to make both countries work together to reach their aims.</p>
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex';
import { getAdvertInObject } from '../js/commonFun';

export default {
	date() {
		return {};
	},
	computed: {
		...mapState('issue', [
			'showCurrencyOrigin',
			'baseInfo',
			'adConfig'
		]),
		getShowGifts() {
			const baseInfo = this.baseInfo || {};

			return baseInfo.showCountryGiftAmount || '-';
		},
		quizShowPartnerLogo() {
			const advert = this.adConfig.quizShowPartnerLogo || {};
			return getAdvertInObject(advert);
		},
		logoUrl() {
			// return require('../image/tecno.png'); // test data

			if (this.quizShowPartnerLogo) {
				return this.quizShowPartnerLogo.imgUrl;
			}
			return null;
		}
	}
};
</script>

<style lang="less">
@import '~base/styles/variable.less';
@import 'base/styles/icon.less';

.m-issue-rank {
	position: absolute;
	min-height: 100%;
	background-image: linear-gradient(to bottom, #2b0098, #7c2bb7);
	padding-top: 54/@rem;
	padding-bottom: 36/@rem;

	.m-rank-h1 {
		margin: 0 20/@rem 4/@rem 20/@rem;
		font-size: 24/@rem;
		font-weight: bold;
		line-height: 28/@rem;
		text-align: center;
		color: @midYellow;
	}
	.m-rank-h2 {
		margin: 0 20/@rem 30/@rem 20/@rem;
		font-size: 16/@rem;
		line-height: 20/@rem;
		font-weight: bold;
		text-align: center;
		color: @midYellow;
	}
	.m-rank-desc {
		margin: 0 20/@rem 2/@rem 20/@rem;
		font-size: 20/@rem;
		line-height: 24/@rem;
		font-weight: bold;
		text-align: center;
		color: @white;
	}
	.m-rank-kes {
		margin: 0 40/@rem 40/@rem 30/@rem;
		text-align: center;
		background-image: url('../image/rank-win.png');
		background-repeat: no-repeat;
		background-size: 100% 100%;
		font-size: 36/@rem;
		padding-top: 42/@rem;
		padding-bottom: 16/@rem;
		line-height: 42/@rem;
		font-weight: bold;
		color: @white;
		span {
			font-size: 20/@rem;
			margin-right: 6/@rem;
			line-height: 26/@rem;
			font-weight: normal;
		}
	}
	.m-rank-advert {
		display: flex;
		justify-content: center;
		align-items: center;
		margin: -30/@rem 0 24/@rem;
		font-size: 12/@rem;
		color: #FFF;
		
	}
	.m-rank-advert-image {
		margin-left: 5/@rem;		
	}

	.m-rank-heat {
		font-size: 16/@rem;
		line-height: 20/@rem;
		font-weight: bold;
		text-align: center;
		color: @white;
	}
	.m-rank-country {
		display: flex;
		align-items: center;
		margin: 0 20/@rem;
		justify-content: space-between;
		.country-wrap {
			flex: 0 0 auto;
			color: @white;
			font-size: 14/@rem;
			font-weight: bold;
			line-height: 26/@rem;
			.icon-kenya {
				width: 26/@rem;
				height: 26/@rem;
				margin-right: 10/@rem;
			}
			.icon-nigeria {
				width: 26/@rem;
				height: 26/@rem;
				margin-left: 10/@rem;
			}
		}
	}
	.m-rank-vs {
		margin: 0 20/@rem;
		.icon-vs {
			width: 100%;
		}
	}
	.m-rank-rule {
		margin: 1/@rem 20/@rem 30/@rem 20/@rem;
		font-size: 12/@rem;
		color: @white;
		line-height: 14/@rem;
	}
	.m-rank-claim {
		display: flex;
		align-items: flex-start;
		justify-content: center;
		margin: 0 20/@rem;
		color: @white;
		opacity: 0.6;
		.m-icon-claim {
			.m-icon-light2();
			color: @white;
			width: 12/@rem;
			height: 12/@rem;
			margin-right: 10/@rem;
			margin-top: -4/@rem;
		}
		.claim-text {
			font-size: 12/@rem;
			line-height: 14/@rem;
		}
	}
}
</style>
