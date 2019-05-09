<template lang="html">
	<div class="m-page-wrapper">
		<div class="m-img-wrapper" v-if="bannerImg&&planId===8&&showPage('sms')">
			<img :src="bannerImg" />
		</div>
		<div v-if="showPage('index')">
			<div class="m-img-wrapper" v-if="bannerImg">
			  	<img :src="bannerImg" />
			</div>
			<!-- header ad -->
			<a  class="page-header-link" :href="headerAd.linkUrl" v-if="headerAd">
				<img :src="headerAd.imgUrl" />
			</a>
			<slot name="topContent"></slot>
			<Login class="page-login-wrap" :commitBtnText="btnLabel"/>
			<slot name="bottomContent"></slot>
			<!-- footer ad -->
			<a  class="page-footer-link" :href="footerAd.linkUrl" v-if="footerAd">
				<img :src="footerAd.imgUrl" />
			</a>
		</div>
		<Sms v-if="showPage('sms')"/>
		<Success v-if="showPage('success')" :autoJmpUrl="jumpURL"/>
	</div>
</template>

<script>
import { mapState } from 'vuex';
import { pagePath } from 'config/pageConfig';
import Login from './pagelet/register.vue';
import Sms from './pagelet/sms.vue';
import Success from './pagelet/success.vue';

// const defaultImg1 = require('./image/topBanner.png');

export default {
	name: 'ActivityReg',

	props: {
		// 可以配置的头图
		topImg: {
			type: String,
			'default': ''
		},
		// 可配置的成功跳转url
		succUrl: {
			type: String,
			'default': ''
		},
		// 是否有首页
		hasIndex: {
			type: Boolean,
			'default': true
		},
		// 是否有sms页面
		hasSms: {
			type: Boolean,
			'default': true
		},
		// 是否有成功页
		hasSuc: {
			type: Boolean,
			'default': true
		},
		headerAd: {
			type: Object
		},
		footerAd: {
			type: Object
		},
	},

	data () {
		return {
			// bannerImg: defaultImg1,
			modulePath: [],
			jumpURL: pagePath.home,
			planId: +URL.getPara('planId') || 1
		};
	},

	components: {
		Login,
		Sms,
		Success
	},

	computed: {
		...mapState('activityRegister', [
			'moduleName'
		]),
		bannerImg() {
			return this.topImg;
		},
		btnLabel() {
			if (this.headerAd) {
				return this.headerAd.btnText;
			}
		}
	},
	watch: {
		moduleName (val) {
			// 打开了成功页面-触发成功事件
			if (val && val.includes('success')) {
				this.$emit('regSuccess');
			}
		}
	},
	methods: {
		showPage (name) {
			return name === this.moduleName && this.modulePath.includes(name);
		},
	},
	created () {
		this.hasIndex && this.modulePath.push('index');
		this.hasSms && this.modulePath.push('sms');
		this.hasSuc && this.modulePath.push('success');
		// 这2个值理论上不会变，就直接初始化设置就ok
		if (this.succUrl) {
			this.jumpURL = this.succUrl;
		}
	}
};
</script>

<style lang="less">
.m-page-wrapper {
  .m-img-wrapper {
	width: 100%;
    // height: 413px;

    > img {
      width: 100%;
      height: 100%;
    }
  }
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
</style>
