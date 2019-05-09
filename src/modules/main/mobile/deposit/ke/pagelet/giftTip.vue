<template>
  <p class="m-gift-tip" v-if="showGiftTxt"><i class="m-icon--dollar2"></i>{{giftTxt}}</p>
</template>
<script>
import { getAdConfig } from 'utils/getAdConfig';

export default {
	data () {
		return {
			giftTxt: '',
		};
	},
	computed: {
		showGiftTxt () {
			return this.giftTxt !== '';
		}
	},
	created () {
		getAdConfig('depositBanner').then(obj => {
			if (obj[0] && obj[0].text) {
				this.giftTxt = obj[0].text;
			}
		});
	},
};
</script>
<style lang="less">
@import 'base/styles/variable.less';
@import 'base/styles/icon.less';
.m-gift-tip{
  color:@green;
	font-size: 13/@rem;
	padding-left:24/@rem;
	margin-top: 16/@rem;
	position: relative;
  .m-icon--dollar2{
		position: absolute;
		left: 0;top:0;
    .m-icon-dollar2();
    &:before{
      color:#f8be1c;
      font-size: 15/@rem;
    }
  }
}
</style>


