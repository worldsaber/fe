<template>
	<div class="odds-boost-banner" v-if="showBanner">
		<img class="banner-image" :src="oddsBoostImgUrl" @click="onImageClick"/>
		<span class="close-btn" @click="onCloseBtn"></span>
	</div>
</template>
<script>
import { oddsBoostActivity } from 'config/activity/activityConfig';
import { LS } from 'storage/index';
// import { mapState } from 'vuex';
import { getAdConfig } from 'utils/getAdConfig';

export default {
	props: {
		source: {
			type: String,
			'default': 'banner'
		},
		periodId: {
			type: String,
		}
	},
	data() {
		const key = `ODDS_BOOST_${this.source}`;
		const pId = LS.get(key);

		return {
			closed: false,
			oddsBoostUrl: oddsBoostActivity,
			oddsBoostImgUrl: null,
			pId,
		};
	},
	computed: {
		// ...mapState('oddsBoost', [
		// 	'needClaim',
		// ]),
		showBanner() {
			const closed = this.pId === this.periodId; // 历史关闭
			return !closed && !this.closed && this.oddsBoostImgUrl;
		}
	},
	created() {
		this.getAds();
	},
	methods: {
		onCloseBtn() {
			const key = `ODDS_BOOST_${this.source}`;
			LS.set(key, this.periodId);
			this.closed = true;
			this.$emit('closed');
		},
		getAds() {
			getAdConfig('oddsBoostLink').then(ads => {
				const ad = ads[0];
				if (ad) {
					this.oddsBoostImgUrl = ad.imgUrl;
					if (ad.linkUrl) {
						this.oddsBoostUrl = ad.linkUrl;
					}
				}
			});
		},
		onImageClick() {
			location.href = this.oddsBoostUrl;
		}
	}
};
</script>
<style lang="less">
@import 'base/styles/variable.less';
@import 'base/styles/icon.less';

.odds-boost-banner{
	position: relative;
	display: flex;
	align-items: center;
	justify-content: space-around;
	width: 100%;
	// height: 52/@rem;
	background-image: linear-gradient(278deg, #8333b8, #272351);

	.claim-offer{
		font-size: 14/@rem;
		font-weight: bold;
		color: #ffe600;
		.arrow-right{
			.m-icon-arrow--right();
			&::before{
				color: #ffe600;
				font-size: 14/@rem;
			}
		}
	}
	.banner-image{
		width: 100%;
		// height: 52/@rem;
	}
	.close-btn{
		position: absolute;
		right: 5/@rem;
		top: 50%;
		margin-top: -9/@rem;
		height: 18/@rem;
		width: 18/@rem;
		line-height: 18/@rem;
		border-radius: 9/@rem;
		background-color: rgba(255, 255, 255, 0.15);
		text-align: center;
		.m-icon-close();
		&::before{
			font-size: 10/@rem;

			color: #f2f3f5;
		}
	}
}
.odds-boost-icon{
	height: 20/@rem;
	width: 30/@rem;
	margin: -8/@rem 5/@rem 0 0;
}
.odds-boost-text{
	font-size: 18/@rem;
	line-height: 30/@rem;
	font-weight: bold;
	color: #FFF;
}
</style>
