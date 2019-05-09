<template>
	<span class="m-gift-tip" v-if="showGiftTxt"><i class="m-icon--dollar2"></i>{{giftTxt}}</span>
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
@import 'base/style/variable.less';
@import 'base/style/icon.less';
.m-gift-tip{
	width:250px;
	padding-left:25px;
	position: relative;
	font-size: 14px;
	font-weight: bold;
	line-height: 1;
	display: inline-block;
	vertical-align: middle;
	margin-left: 17px;
	color:@green;
	.m-icon--dollar2{
		position: absolute;
		left:0;
		// top:5px;
		.m-icon-dollar2();
		&:before{
			color:@green;
			font-size: 18px;
		}
	}
}
</style>
