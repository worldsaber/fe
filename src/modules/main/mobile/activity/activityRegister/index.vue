<template>
	<Layout :isHaveBottomNav="false" :isHaveNavBar="false" :isHasFooter="planId === 8">
		<div slot="mid">
			<div>
				<planID3  v-if="planId === 3" :succUrl="jumpURL" :topImg="bannerImg" @regSuccess="succ"/>
				<planID5  v-else-if="planId === 5" :succUrl="jumpURL" :topImg="bannerImg" @regSuccess="succ"/>
				<planID7  v-else-if="planId === 7" />
				<planID8  v-else-if="planId === 8" :topImg="bannerImg" />
				<ActivityReg  v-else :succUrl="jumpURL" :topImg="bannerImg" @regSuccess="succ"/>
			</div>
		</div>
	</Layout>
</template>
<script>
import { URL } from 'utils';
import { userCenterUrl } from 'config/mycenter/dataConfig';
import { baseUrl } from 'config/pageConfig';
import ActivityReg from 'components/activityReg';
import 'statistics/tj';
import Layout from 'components/layout/main.vue';
import succ from 'statistics/succ';
import { mapMutations } from 'vuex';

import planID3 from './landingPage/planID3';
import planID5 from './landingPage/planID5';
import planID7 from './landingPage/planID7';
import planID8 from './landingPage/planID8';

const defaultImg2 = require('./image/topBanner2.png');
const defaultImg3 = require('./image/topBanner3.png');
const defaultImg4 = require('./image/topBanner4.png');
const defaultImg8 = require('./image/banner-ke.jpg');

export default {
	data () {
		return {
			planId: 1,
			// 如果为空组件内部取默认
			bannerImg: '',
			// 如果为空组件内部取默认
			jumpURL: ''
		};
	},
	components: {
		Layout,
		ActivityReg,
		planID3,
		planID5,
		planID7,
		planID8
	},
	created () {
		this.planId = +URL.getPara('planId') || 1;
		this.getJumpURL();
		this.getBannerImg();
	},
	mounted () {
		const loading = document.querySelector('#pageLoading');
		loading && (loading.style.display = 'none');

		if (this.planId !== 8) {
			this.changeLoading(false);
		}
	},
	methods: {
		...mapMutations('layout', ['changeLoading']),
		getJumpURL () {
			const url = URL.getPara('url');
			if (url) {
				this.jumpURL = url;
			} else if (this.planId === 1 || this.planId === 2 || this.planId === 5) {
				this.jumpURL = baseUrl + 'promotions/first_deposit';
			} else if (this.planId === 4) {
				this.jumpURL = userCenterUrl.gift;
			} else if (this.planId === 6) {
				// 目前这个url地址只能先写死
				this.jumpURL = 'https://www.sportybet.com/swdp/pagemaker/sportybet/ke/promotion_losebet/index.htm?time=' + new Date();
			}
		},
		getBannerImg () {
			if (this.planId === 1) {
				this.bannerImg = defaultImg4;
				this.$nextTick(() => {
					document.querySelector('img').style.marginBottom = '30px';
				});
			} else if (this.planId === 3 || this.planId === 5) {
				this.bannerImg = defaultImg3;
			} else if (this.planId === 8) {
				this.bannerImg = defaultImg8;
				this.$nextTick(() => {
					document.querySelector('img').style.marginBottom = '30px';
				});
			} else {
				this.bannerImg = defaultImg2;
			}
		},
		succ
	}
};
</script>
<style lang="less">
	.m-footer-header {
		display: none;
	}
</style>
