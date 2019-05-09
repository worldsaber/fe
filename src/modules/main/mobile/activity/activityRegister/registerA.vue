<template>
<div>
	<ActivityReg :succUrl="jumpURL" @regSuccess="succ" :headerAd="headerAd" :footerAd="footerAd"/>
</div>
</template>
<script>
import { URL } from 'utils';
import { userCenterUrl } from 'config/mycenter/dataConfig';
import { baseUrl } from 'config/pageConfig';
import ActivityReg from 'components/activityReg';
import 'statistics/tj';
import succ from 'statistics/succ';

import { getComplexAdConfig } from 'utils/getAdConfig';

export default {
	props: {
		source: String,
	},
	data () {
		return {
			planId: 1,
			// 如果为空组件内部取默认
			bannerImg: '',
			// 如果为空组件内部取默认
			jumpURL: '',
			headerAd: null,
			footerAd: null,
		};
	},
	components: {
		ActivityReg,
	},
	created () {
		this.planId = +URL.getPara('planId') || 1;
		this.getJumpURL();
		this.getAdConfig();
	},
	mounted () {
		const loading = document.querySelector('#pageLoading');
		loading && (loading.style.display = 'none');
	},
	methods: {
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
		getAdConfig() {
			const source = this.source;
			let headerSpotId = 'promotionRegisterHeader';
			let footerSpotId = 'promotionRegisterFooter';
			if (source === 'planId7') {
				headerSpotId = 'promotionRegisterHeader7';
				footerSpotId = 'promotionRegisterFooter7';
			}
			getComplexAdConfig([{
				spotId: headerSpotId,
			}, {
				spotId: footerSpotId
			}]).then(data => {
				const header = data.find(item => item.spotId === headerSpotId);
				const footer = data.find(item => item.spotId === footerSpotId);
				if (header) {
					this.headerAd = header.ads;
					if (this.headerAd && !this.headerAd.linkUrl) {
						this.headerAd.linkUrl = 'javascript: void(0)'; // eslint-disable-line
					}
				}
				if (footer) {
					this.footerAd = footer.ads;
					if (this.footerAd && !this.footerAd.linkUrl) {
						this.footerAd.linkUrl = 'javascript: void(0)'; // eslint-disable-line
					}
				}
			});
		},
		succ
	}
};
</script>
<style lang="less">
</style>
