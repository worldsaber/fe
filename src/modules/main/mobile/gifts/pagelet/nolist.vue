<template>
  <div class="m-gift-nolist">
    <div class="m-gift-ad-notxt" v-if="showAd">
      	<p><i class="m-icon--dollar2"></i>{{giftsText.text}}</p>
		<AfButton v-if="showBtn"
			id="m-btn-go-deposit"
        	extraType="primary" 
        	@click.prevent="goUrl" >
			{{giftsText.btnText}}
		</AfButton>
    </div>
	<p class="m-gift-notxt" v-else>Currently no available gifts.</p>
	<a class="gifts-bottom-pic" :href="giftsPic.linkUrl || 'javascript: void(0)'" v-if="giftsPic && giftsPic.imgUrl"><img :src="giftsPic.imgUrl" /></a>
  </div>
</template>
<script>
import AfButton from 'packages/button/button.vue';
import { getComplexAdConfig } from 'utils/getAdConfig';

export default {
	components: {
		AfButton,
	},
	data() {
		return {
			ads: {}
		};
	},
	props: {
		tabType: {
			type: Number,
			'default': 1
		}
	},
	computed: {
		showGiftTxt () {
			return !!this.giftsText.text;
		},
		showBtn () {
			return this.giftsText.btnText && this.giftsText.linkUrl;
		},
		showAd () {
			return this.tabType === 0 && this.showGiftTxt;
			// return false;
		},
		giftsText() {
			return this.ads.giftsBottom || {};
		},
		giftsPic() {
			return this.ads.giftsBottomPicture || {};
		}
	},
	created() {
		this.getConfigs();
	},
	methods: {
		goUrl () {
			window.location.href = this.giftsText.linkUrl;
		},
		getConfigs() {
			getComplexAdConfig([{
				spotId: 'giftsBottom',  // 文字
			}, {
				spotId: 'giftsBottomPicture'   // 图片
			}]).then(res => {
				if (res) {
					return res.reduce((data, cur) => {
						if (cur.spotId && cur.ads) {
							data[cur.spotId] = cur.ads;
						}
						return data;
					}, {});
				}
				return Promise.reject();
			}).then(data => {
				this.ads = data;
			});
		}
	}
};
</script>
<style lang="less">
@import 'base/styles/variable.less';
@import 'base/styles/icon.less';
.m-gift-nolist{
	// width: 73.3%;
	margin: 0 auto;
  	font-size: 16/@rem;
  	text-align: center;
	color:@darkGray;
	.m-gift-notxt{
		margin-top: 120/@rem;
		font-size: 13/@rem;
	}
	.m-gift-ad-notxt{
		width: 265/@rem;
		margin: 0 auto;
		margin-top: 120/@rem;
		p{
			font-size: 13/@rem;
			color: @green;
			margin:78/@rem auto 27/@rem;
			position: relative;
			font-weight: 500;
			line-height: 1.54;
			.m-icon--dollar2{
				display: inline-block;
				padding-right: 5/@rem;
				.m-icon-dollar2();
				&:before{
					color:#f8be1c;
					font-size: 15/@rem;
				}
			}
		}
	}
	#m-btn-go-deposit{
		width: 200/@rem !important;
		height: 36/@rem !important;
		font-size: 14/@rem;
	}
	.af-button--primary{
		background-color: @white !important;
		border: 1/@rem solid @green !important; 
		span{
			color: @green !important;
		}
	}
	.gifts-bottom-pic{
		display: block;
		margin-top: 100/@rem;
		img{
			width: 100%;
		}
	}
}
</style>

