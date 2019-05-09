<template>
	<div class="home-top">
		<div class="first-part-wrap">
			<div class="first-part">
				<div class="img img1">
					<img src="../common/components/imgBanner/left.jpg">
				</div>
				<div class="top-main">
					<!-- popular -->
					<div class="popular" v-if="adLoading && !popularList.length">
						<div class="m-sec-loading">
							<div>
								<i class="m-icon-loading"></i>
								<p class="m-text-msg">Loading…</p>
							</div>
						</div>
					</div>

					<div class="popular" v-else>
						<div class="popular-text">Popular</div>
							<template v-if="popularList.length">
								<div class="popular-list">
    								<a v-for="(p, index) in popularList" :href='p.linkUrl' :key="index" class="top-link"><span class="top-link-item">{{p.text}}</span><span class="arrow"></span></a>
    							</div>
							</template>
							<template v-else>
								<div class="popular-list">
    								<a v-for="(p, index) in defaultList" :href='p.linkUrl' :key="index" class="top-link"><span class="top-link-item">{{p.text}}</span><span class="arrow"></span></a>
    							</div>
							</template>
					</div>

					<!-- 轮播图 -->
					<template v-if="adLoading && !getMainBanner.length">
						<div class="main-banner">
							<div class="m-sec-loading">
								<div>
									<i class="m-icon-loading"></i>
									<p class="m-text-msg">Loading…</p>
								</div>
							</div>
						</div>
					</template>
					<template v-else>
						<template v-if="getMainBanner.length">
							<af-carousel
        						:itemsList="getMainBanner"
        						:carouselOps="ops"
        						class="main-banner"
        					>
        					</af-carousel>
						</template>
						<template v-else>
							<div class="main-banner">
								<div class="m-sec-error">
	  							  <div>
	  								<i class="m-icon-error"></i>
	  								</div>
	  							</div>
							</div>
						</template>
					</template>

					<!-- 登录相关 -->
					<template v-if="isLogin">
						<div class="m-proAds-wrapper m-sec-loading" v-if="adLoading">
							<div>
								<i class="m-icon-loading"></i>
								<p class="m-text-msg">Loading…</p>
							</div>
						</div>
						<template v-else>
							<div :class="[
									'm-proAds-wrapper',
									{
										'm-sec-error': !getDepositeAds
									}
								]"
								@click="goDeposit"
							>
								<img :src='`${getDepositeAds.imgUrl}`' :alt="getDepositeAds.text" v-if="getDepositeAds" />
								<div v-else>
									<div>
	    								  <i class="m-icon-error"></i>
	    							  </div>
								</div>
							</div>
						</template>
					</template>

					<template v-else>
						<InstantRegister
							:account="account"
							theme="black"
						/>
					</template>

				</div>
				<div class="img img2">
					<img src="../common/components/imgBanner/right.jpg">
				</div>
			</div>
		</div>

		<!-- 广播广告 -->
		<Broadcast />

		<div class="second-banner">
			<template v-if="adLoading && !getSecondBanner">
				<div class="m-sec-loading">
					<div>
					  <div>
							<i class="m-icon-loading"></i>
							<p class="m-text-msg">Loading…</p>
						</div>
					</div>
				</div>
			</template>

			<template v-else-if="getSecondBanner">
				<template v-if="getSecondBanner.linkUrl && getSecondBanner.imgUrl">
					<a :href="getSecondBanner.linkUrl" class="m-image-wrapper">
		    			<img :src="getSecondBanner.imgUrl" :alt="getSecondBanner.text" />
		    		</a>
				</template>
				<template v-else-if="getSecondBanner.imgUrl">
					<div class="m-image-wrapper">
						<img :src="getSecondBanner.imgUrl" :alt="getSecondBanner.text" />
					</div>
				</template>
			</template>

			<template v-else>
				<div class="m-sec-error">
					<div>
						<i class="m-icon-error"></i>
					</div>
				</div>
			</template>

		</div>

	</div>
</template>

<script>
import { EventBus } from 'kernel/js/eventBus.js';
import AfCarousel from 'packages/carousel';
import { mapState, mapActions } from 'vuex';
// import { userCenterConfig } from 'config/order/userCenterConfig';
import commonEvent from 'config/eventConfig/commonEvent';
import { popularConfig } from 'config/home/popularConfig';
import Broadcast from './bdcast.vue';

export default {
	name: 'home-top',

	components: {
		AfCarousel,
		Broadcast
	},

	data() {
		return {
			ops: {
				indicators: true,
				interval: 5000,
				controls: true
			},
			account: '',
			isLogin: window.loginStatus,
			// showCurrency: window.showCurrency,
			defaultList: popularConfig
		};
	},

	computed: {
		...mapState('home', [
			'popularList',
			'ouGoal',
			'promotionAd',
			'adLoading'
		]),
		getMainBanner() {
			const mainBanner = this.promotionAd.mainBanner || [];
			const ret = [];

			mainBanner.forEach(banner => {
				ret.push({
					link: banner.linkUrl,
					img: banner.imgUrl
				});
			});

			return ret;
		},
		getSecondBanner() {
			return this.promotionAd.secondBanner || null;
		},
		getDepositeAds() {
			return this.promotionAd.mainDepositPop || null;
		}
	},
	methods: {
		...mapActions('home', [
			'getPromotionAd'
		]),
		goDeposit() {
			const depositeAds = this.getDepositeAds || {};
			if (depositeAds.linkUrl) {
				window.open(depositeAds.linkUrl, '_blank');
			}
		}
	},
	mounted() {
		EventBus.$on(commonEvent.UPDATE_LOGIN_STATUS, () => {
			this.isLogin = window.loginStatus;
			window.loginStatus && this.getPromotionAd(true);
		});

		// EventBus.$on(commonEvent.UPDATE_ACCOUNT, val => {
		// 	this.account = val;
		// });
	}
};
</script>

<style lang="less">

</style>
