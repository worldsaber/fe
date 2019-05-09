<template>
	<div class="m-page-wrapper">
		<div class="page-register-wrap" v-if="!showSuccess">
			<!-- header ad -->
			<a class="page-header-link" :href="headerAd.linkUrl" v-if="headerAd">
				<img :src="headerAd.imgUrl" />
			</a>
			<Register :btnLabel="btnLabel" class="page-register" verifyLabel="Complete Registration" @success="onSuccess"/>
			<!-- footer ad -->
			<a class="page-footer-link" :href="footerAd.linkUrl" v-if="footerAd">
				<img :src="footerAd.imgUrl" />
			</a>
		</div>
		<Success v-if="showSuccess" :autoJmpUrl="jumpURL"/>
	</div>
</template>
<script>
import { URL } from 'utils';
import { userCenterUrl } from 'config/mycenter/dataConfig';
import { baseUrl } from 'config/pageConfig';
import 'statistics/tj';
import succ from 'statistics/succ';

import { getComplexAdConfig } from 'utils/getAdConfig';
import Register from 'components/depositReg/register.vue';
import Success from 'components/activityReg/pagelet/success.vue';

export default {
	props: {
		source: String
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
			showSuccess: false,
			btnLabel: 'Register'
		};
	},
	components: {
		Register,
		Success,
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
					if (header.ads && header.ads.btnText) {
						this.btnLabel = header.ads.btnText;
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
		succ,
		onSuccess() {
			this.showSuccess = true;
			succ();
		}
	}
};
</script>
<style lang="less">
@import 'base/styles/variable.less';
.m-page-wrapper {
  .page-header-link{
	  display: block;
	  width: 100%;
	//   padding-bottom: 30px;
	  img{
		  width: 100%;
	  }
  }
  .page-footer-link{
	  display: block;
	//   position: absolute;
	  margin-top: 100px;
	  width: 100%;
	  img{
		  width: 100%;
	  }
  }
  .page-login-wrap{
	  margin-top: 40px;
  }
}
.page-register {
	.deposit-enter-mobile .enter-mobile-container .verifyInputs .m-input-wap-prepend{
		color: #353a45;
		background-color: #FFF;
	}
	.deposit-enter-mobile .enter-mobile-container .verifyInputs input{
		background-color: #FFF;
		color: #353a45;
	}
	.deposit-enter-mobile .enter-mobile-container .verifyInputs{
		border: 1px solid #9ca0ab;
	}
	.deposit-enter-mobile .enter-mobile-container .verifyInputs.m-input-wap-wrapper.m-input-wap-wrapper--error{
		border: 1px solid @red !important;
	}
	.deposit-enter-mobile .enter-mobile-container .error-message{
		color: @red;
	}
	.deposit-code-verify .verifyMobile .verifyInputs input{
		background-color: #FFF;
		color: #353a45;
	}
	.deposit-code-verify .verifyMobile .btn-wrap .back-btn{
		border: 1px solid #9ca0ab;
	}
	.deposit-code-verify .verifyMobile .btn-wrap .back-btn .back-icon::before{
		color: #353a45;
	}
	.deposit-code-verify .verifyMobile .verifyInputs{
		border: 1px solid #9ca0ab;
	}
	.deposit-code-verify .verifyMobile .btn-wrap .verify-btn{
		background-color: #0d9737;
		color: #FFF;
	}
	.deposit-enter-mobile .enter-mobile-container .enter-mobile-btn{
		background-color: #0d9737;
		color: #FFF;
	}
	.deposit-code-verify .verifyMobile .action-label{
		color: #353a45;
	}
	.deposit-code-verify .verifyMobile .send-again{
		color: #0d9737;
	}
}
</style>
