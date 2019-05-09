<template>
	<div>
		<OrderShare
			v-if="contentData.bizType !== 4"
			:shareCfg="shareCfg"
			:orderId="orderId"
			:percent="contentData.percent"
			:winnings="contentData.winnings" />

		<Share v-else :shareCfg="shareCfg"/>
	</div>
</template>

<script>
import 'components/share';
import OrderShare from 'components/share/orderShare';

export default {
	components: {
		OrderShare,
	},
	data () {
		return {
			orderId: '',
			shareCfg: {
				url: '',
				text: window.shareTitle || 'Want to be the next Super Winner? Bet now!'
			}
		};
	},
	created () {
		if (this.contentData.bizType !== 4) {
			this.orderId = this.contentData.orderId || '';
			// 默认url,如果会在OrderShare中从新覆盖
			this.shareCfg.url = `${location.origin}/${window.country}/m/`;
		} else {
			this.shareCfg.url = this.contentData.shareUrl;
			this.invitation = `${this.contentData.shareUrl}`;
			this.encodeInvitation = encodeURI(this.invitation);
		}
	}
};
</script>

<style lang="less">
@import "base/styles/variable.less";
@import "base/styles/icon.less";
.pop-share-container {
  h1 {
    position: relative;
    top: 5/@rem;
    font-size: 14/@rem;
    font-weight: 900;
    line-height: 1.39;
    text-align: center;
  }

  .m-icon-wrapper {
	  padding-top: 37/@rem;
	  text-align: center;

	  .m-desc {
		  line-height: 14/@rem;
		  font-size: 12/@rem;
		  text-align: center;
		  color: @dark;
		  display: block;
	  }
  }

  .m-fb,
  .m-wapp {
	  display: inline-block;
	  vertical-align: top;
  }

  .m-fb {
	  margin-right: 66/@rem;
  }

  .m-icon-fb {
	  .m-icon-fb();
	  color: @fbnBlue;
	  cursor: pointer;

	  &:before {
		  font-size: 36/@rem;
	  }
  }

  .m-icon-wapp {
	  .m-icon-whatsapp();
	  color: green;
	  cursor: pointer;

	  &:before {
		  font-size: 36/@rem;
	  }
  }

  .wrapper {
    flex: 1;
    display: flex;
    flex-flow: column;
    align-items: center;
  }

  .m-icon-close {
    cursor: pointer;
    color: #8c8c8c;
    .m-icon-close();
  }
  .top {
    position: absolute;
    top: 9px;
    right: 11px;
  }
}
.es-dialog.m-win-share {
	background: none;
	padding-top: 0;
	box-shadow: none;
	.m-share-bar{
		position: static;
	}
	.m-share-mask{
		display: none;
	}
}
</style>
